var admin = require("firebase-admin");
require('dotenv').config();
// const { dbEntregador } = require('../../db'); // Você precisará disso para buscar existentes

const enderecoBucket = process.env.FIREBASE_STORAGE_BUCKET;

// Função auxiliar de upload que retorna uma Promise
const realizarUploadFirebase = (arquivoOriginal, tipoArquivo, pedido_id) => {
    return new Promise((resolve, reject) => {
        if (!arquivoOriginal) {
            return reject(new Error(`Arquivo para ${tipoArquivo} não fornecido.`));
        }

        // Nome de arquivo único e organizado
        const nomeArquivoNoStorage = `envios/pedido-${pedido_id}/${tipoArquivo}/${Date.now().toString(36)}_${arquivoOriginal.originalname.replace(/\s+/g, '_')}`;
        //console.log(`Iniciando upload de ${tipoArquivo} para: ${nomeArquivoNoStorage}`);

        const bucket = admin.storage().bucket(enderecoBucket);
        const file = bucket.file(nomeArquivoNoStorage);

        const stream = file.createWriteStream({
            metadata: {
                contentType: arquivoOriginal.mimetype
            }
        });

        stream.on("error", err => {
            console.error(`Erro no stream para ${nomeArquivoNoStorage}:`, err);
            reject(err); // Rejeita a promise em caso de erro no stream
        });

        stream.on("finish", async () => {
            try {
                // Gera URL assinada
                const options = {
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
                };
                const [signedUrl] = await file.getSignedUrl(options);
                console.log(`${tipoArquivo} (${nomeArquivoNoStorage}) enviado. URL assinada gerada.`);
                resolve({ tipo: tipoArquivo, url: signedUrl, caminhoNoStorage: nomeArquivoNoStorage }); // Resolve com a URL e o tipo
            } catch (error) {
                console.error(`Erro ao gerar URL assinada para ${nomeArquivoNoStorage}:`, error);
                reject(error); // Rejeita a promise se houver erro na URL assinada
            }
        });

        stream.end(arquivoOriginal.buffer);
    });
};

// Função para buscar URL existente (se você for adicionar essa lógica)
const buscarUrlExistenteDoDB = (pedido_id, colunaArquivo) => {
    return new Promise((resolve, reject) => {
        // ... (implementação como na resposta anterior)
        // Por agora, vamos simular que não há arquivo existente se não foi enviado
        resolve(null);
    });
};


const uploadArquivosEnvio = async (req, res, next) => {
    //console.log("Iniciando o upload de arquivos para o Firebase Storage...");

    const { pedido_id } = req.body;
    if (!pedido_id) {
        console.error("ERRO: pedido_id não fornecido.");
        return next(new Error("ID do pedido é necessário."));
    }

    // Inicializa onde as URLs finais serão armazenadas
    req.firebaseUrls = {
        nota_fiscal: null,
        documentos_envio: null
    };

    // --- Lógica de Upload ---
    const promisesDeUpload = [];

    // 1. Nota Fiscal
    const notaFiscalFile = req.files && req.files.nota_fiscal && req.files.nota_fiscal[0];
    if (notaFiscalFile) {
        //console.log("Adicionando promise de upload para nota fiscal...");
        promisesDeUpload.push(realizarUploadFirebase(notaFiscalFile, "nota_fiscal", pedido_id));
    } else {
        // Se não houver novo arquivo, você buscaria o existente aqui
        console.log("Nenhum novo arquivo de nota fiscal. Buscando existente (simulado)...");
        promisesDeUpload.push(buscarUrlExistenteDoDB(pedido_id, 'nota_fiscal').then(url => ({ tipo: 'nota_fiscal', url })));
    }

    // 2. Documentos de Envio
    const documentoEnvioFile = req.files && req.files.documentos_envio && req.files.documentos_envio[0];
    if (documentoEnvioFile) {
        //console.log("Adicionando promise de upload para documentos de envio...");
        promisesDeUpload.push(realizarUploadFirebase(documentoEnvioFile, "documentos_envio", pedido_id));
    } else {
        // Se não houver novo arquivo, você buscaria o existente aqui
        console.log("Nenhum novo arquivo de documentos de envio. Buscando existente (simulado)...");
        promisesDeUpload.push(buscarUrlExistenteDoDB(pedido_id, 'documentos_envio').then(url => ({ tipo: 'documentos_envio', url })));
    }


    // --- Aguardar todos os uploads (ou buscas) ---
    if (promisesDeUpload.length === 0 && (!req.files || Object.keys(req.files).length === 0)) {
        console.log("Nenhum arquivo para processar (nem novo, nem para buscar).");
        // Se você não tiver a lógica de buscar existentes implementada e nenhum arquivo for enviado,
        // você pode querer chamar next() aqui se isso for um cenário válido.
        // Por ora, a lógica abaixo lidará com isso se promisesDeUpload estiver vazio.
    }

    try {
        // Promise.all espera que todas as promises no array sejam resolvidas
        const resultados = await Promise.all(promisesDeUpload);

        // Processa os resultados e armazena as URLs em req.firebaseUrls
        resultados.forEach(resultado => {
            if (resultado && resultado.url) { // Verifica se a URL não é null (caso buscarUrlExistenteDoDB retorne null)
                if (resultado.tipo === "nota_fiscal") {
                    req.firebaseUrls.nota_fiscal = resultado.url;
                } else if (resultado.tipo === "documentos_envio") {
                    req.firebaseUrls.documentos_envio = resultado.url;
                }
            }
        });

        console.log("Todos os arquivos processados. URLs finais:", req.firebaseUrls);
        // **AQUI É O LUGAR CORRETO PARA O next()**
        next();

    } catch (error) {
        console.error("Erro durante o processamento de um ou mais arquivos:", error);
        next(error); // Passa o erro para o próximo error handler
    }
};

module.exports = uploadArquivosEnvio;