# Sistema de Gestão Empresarial (ERP) Completo

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## 🚀 Sobre o Projeto

Este não é apenas um projeto de portfólio; é um **sistema de gestão empresarial (ERP) completo, desenvolvido e implementado em um ambiente de produção real**. Durante dois anos, atuei como desenvolvedor Full Stack imerso nas operações da empresa, participando ativamente da produção, logística e suporte. Essa experiência me permitiu entender profundamente as dores e necessidades do negócio e traduzi-las em soluções de software eficazes.

O sistema foi criado do zero para automatizar processos, fornecer insights financeiros claros, gerenciar a logística de envios e, crucialmente, **calcular a complexa divisão de lucros entre os sócios e produtores**, eliminando planilhas e processos manuais.

> ### ⚠️ Nota para Recrutadores e Avaliadores Técnicos
> Este repositório foi tornado público para fins de demonstração do meu trabalho, arquitetura e organização de código. A empresa que financiou o projeto ainda o utiliza ativamente em suas operações diárias (o nome foi omitido por questões de confidencialidade).
>
> Devido à complexidade do ecossistema, integrações com APIs pagas e chaves de segurança sensíveis, **não incluí instruções para instalação local**. 
> 
> 💡 **No entanto, me coloco à total disposição para ligar o servidor em produção e realizar uma demonstração ao vivo.** Terei o maior prazer em apresentar a interface funcionando, explicar o fluxo de dados e detalhar a lógica de negócio por trás do código em uma videochamada. Basta entrar em contato!

---

## ✨ Funcionalidades Principais

O sistema é dividido em múltiplos portais, cada um com seu próprio conjunto de funcionalidades e nível de acesso baseado em autenticação JWT.

### 🏛️ Painel Administrativo
*   **Gestão de Pedidos Completa:** Criação, edição, cancelamento e acompanhamento de status (`Em produção`, `Pronto para envio`, `Enviado`, `Finalizado`).
*   **Controle Financeiro:** Lançamento de pagamentos de clientes e registro de gastos da empresa.
*   **Divisão de Lucros Automatizada:** Módulos complexos para calcular e registrar repasses para produtores, sócios e para o caixa da empresa, com base em regras de negócio específicas.
*   **Gestão de Estoque:** Controle de produtos acabados e matérias-primas, com funcionalidades para adicionar e reduzir quantidades.
*   **Gerenciamento de Clientes e Funcionários:** CRUD completo para clientes, vendedores e produtores.
*   **Gestão de E-commerce:** Manutenção de produtos, preços e estoque da loja virtual.
*   **Gestão de Cupons de Desconto:** Criação e administração de cupons para revendedores.
*   **Gestão de Repasses (Logística):** Interface para gerenciar o pagamento de comissões aos entregadores.

### 👤 Portal do Cliente
*   Autenticação de usuário (Login/Cadastro).
*   Confirmação de e-mail e recuperação de senha.
*   Área do cliente para gerenciar dados pessoais e endereços.
*   Histórico de pedidos realizados através do site.
*   Checkout de pagamento integrado com **MercadoPago**.

### 🚚 Portal do Entregador (Logística)
*   Autenticação específica para entregadores.
*   Visualização de pedidos prontos para envio.
*   Formulário para confirmar o envio, registrando dados do frete, nota fiscal e WayBill (DHL).
*   Acompanhamento de envios em trânsito.
*   Gestão e criação de faturas da DHL.
*   Extrato de comissões a receber e histórico de pagamentos (repasses).

---

## 🛠️ Tecnologias e Ferramentas

Este projeto foi construído utilizando um conjunto de tecnologias robustas e confiáveis:

*   **Backend:** Node.js, Express.js
*   **Banco de Dados:** MySQL com o driver `mysql2`
*   **Autenticação:** JSON Web Tokens (JWT) para controle de acesso e `bcrypt` para hashing de senhas.
*   **Armazenamento de Arquivos:** Firebase Admin SDK (Cloud Storage) para notas fiscais e documentos de envio.
*   **Integrações de API:**
    *   **Pagamentos:** MercadoPago SDK
    *   **E-mails Transacionais:** SendGrid
    *   **Consulta de Endereços:** ViaCEP
    *   **Cotação de Moedas:** AwesomeAPI (com API de fallback).
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
*   **Gerenciamento de Ambiente:** `dotenv`.

---

## 🏗️ Arquitetura e Estrutura do Projeto

O projeto segue uma estrutura organizada, visando a separação de responsabilidades e a manutenibilidade:

*   **`server.js`**: Ponto de entrada da aplicação, configuração do Express, middlewares globais e definição das rotas principais.
*   **`db.js`**: Módulo centralizado para a configuração e exportação dos pools de conexão com o banco de dados MySQL, com conexões separadas por nível de permissão.
*   **`/routes`**: Diretório que organiza os endpoints da API por funcionalidade (e.g., `pedidos.js`, `clientes.js`, `envios.js`), mantendo o código limpo e modular.
*   **`/middleware`**: Contém os middlewares de autenticação (e.g., `auth.js`, `authClientes.js`), que protegem as rotas e validam os tokens JWT.
*   **`/public`**: Armazena todos os arquivos estáticos do frontend (HTML, CSS, JS), organizados por portal (admin, cliente, entregador).

---

### 💡 Destaques Técnicos e Precauções Adotadas

Abaixo, destaco algumas das precauções arquiteturais e lógicas de negócio implementadas para garantir a robustez do sistema em produção:

**1. Resiliência na Conversão de Moeda (Mecanismo de Fallback):**
A aplicação depende de cotações do dólar em tempo real para precificação e cálculos financeiros. Como precaução contra instabilidades de serviços terceiros, foi implementado um mecanismo de *fallback*. Caso a API principal de cotação sofra uma queda ou demore a responder (timeout), o sistema intercepta a falha e aciona automaticamente uma segunda API de contingência. Isso garante que a operação da empresa não seja paralisada por falhas externas, mantendo a resiliência do sistema.

**2. Atomicidade e Integridade Financeira (Transações SQL):**
Operações financeiras complexas, como a geração de lotes de repasse para entregadores, exigem múltiplas inserções e atualizações simultâneas no banco de dados (ex: criar o registro do lote, vincular os pedidos específicos a este lote e alterar o status de pagamento de cada um desses pedidos). Para evitar qualquer inconsistência nos dados caso ocorra um erro no meio do processo (como uma queda de conexão), toda a operação foi encapsulada em transações SQL. Se uma única etapa falhar, o sistema executa um *rollback* automático, desfazendo todas as alterações daquela requisição e garantindo que o banco de dados permaneça em um estado consistente e seguro.

---

## 📬 Contato e Agendamento de Demonstração

Ficou interessado em ver o sistema em ação? Entre em contato comigo para agendarmos uma demonstração do ERP rodando em ambiente de produção!

**[Seu Nome Completo]**

*   **E-mail:** [tpowertech7@gmail.com](mailto:tpowertech7@gmail.com)
*   **LinkedIn:** [https://www.linkedin.com/in/matheustavares7/](https://www.linkedin.com/in/matheustavares7/)
*   **GitHub:** [https://github.com/TeteuPower](https://github.com/TeteuPower)