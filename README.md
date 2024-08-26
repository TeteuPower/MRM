# MRM - Sistema de Gerenciamento de Vendas e Estoque

**Um sistema web completo para gerenciar clientes, vendas, estoque, funcionários e finanças, desenvolvido com a ajuda da inteligência artificial Gemini 1.5 Pro.**

## Visão Geral

O MRM é um sistema web intuitivo e poderoso projetado para simplificar o gerenciamento de negócios. Ele oferece uma gama completa de funcionalidades, incluindo:

- **Gerenciamento de Clientes:** Cadastro, consulta e atualização de dados de clientes, com extrato de transações e saldo.
- **Gerenciamento de Vendas:** Criação de novas vendas, adição de produtos ao carrinho, cálculo de valores, atualização de estoque e registro de pagamentos.
- **Controle de Estoque:** Visualização e atualização de estoque de produtos e matérias-primas, com alertas visuais para níveis baixos.
- **Gerenciamento de Funcionários:** Cadastro, remoção e visualização do desempenho de vendedores e produtores.
- **Controle Financeiro:** Registro de repasses de comissão aos produtores, pagamentos de clientes, visualização de clientes com saldo negativo e resumo mensal de ganhos.

## Processo de Desenvolvimento

O desenvolvimento do MRM foi um processo impulsionado pela inteligência artificial Gemini 1.5 Pro. A IA forneceu sugestões de código, ajudou a resolver problemas, otimizou a lógica e aprimorou a estrutura do sistema.

## Linguagens e Tecnologias

- **HTML:** Estrutura e conteúdo das páginas web.
- **CSS:** Estilização e layout das páginas web, com foco em um tema escuro e moderno.
- **JavaScript:** Lógica do sistema, interação com o usuário, manipulação de dados e comunicação com o servidor.
- **Node.js:** Ambiente de execução JavaScript no servidor para conectar o sistema ao banco de dados Postgres.
- **MySQL Database:** Banco de dados relacional para armazenar os dados do sistema de forma persistente.
- **Railway:** Plataforma de implantação e hospedagem para o sistema web e o banco de dados.

## Estrutura do Código

O código do sistema está organizado da seguinte forma:

### Backend (Node.js)

- **`server.js`:** Arquivo principal do servidor Node.js, responsável por:
    - Configurar o servidor Express.
    - Conectar ao banco de dados MySQL.
    - Definir as rotas principais da API.
    - Iniciar o servidor.
- **`db.js`:** Contém a lógica para conectar ao banco de dados MySQL e exportar a conexão.
- **`routes/`:** Pasta que contém os arquivos que definem as rotas da API:
- **`middleware/`:** Pasta que contém os middlewares para a API:
    - **`auth.js`:** Middleware para autenticação com JWT.

### Frontend (HTML, CSS, JavaScript)

- **`public/`:** Pasta que contém os arquivos estáticos do frontend:
    - **`html/`:**
    - **`css/`:** 
    - **`js/`:** 
- **Arquivos JavaScript Específicos:** Cada página HTML possui um arquivo JavaScript correspondente para lidar com a lógica específica daquela página.
- **`funcoes.js`:** Contém funções JavaScript reutilizáveis, como funções para formatar datas.

### Observações

- **Autenticação:** As APIs são protegidas por JWT (JSON Web Token). A rota `/api/login` gera um token para administradores autenticados, e o middleware `auth.js` verifica a validade do token em rotas protegidas.
- **Organização:** A estrutura do backend segue boas práticas de organização, separando as responsabilidades em rotas.
- **Escalabilidade:** A estrutura é escalável, permitindo adicionar novas rotas e funcionalidades de forma organizada.

## Destaques do Projeto

- **Tema Escuro e Moderno:** O sistema possui um tema escuro e moderno, proporcionando uma experiência visual agradável.
- **Interface Intuitiva:** A interface do usuário é intuitiva e fácil de usar, com menus de navegação claros e modais informativos.
- **Responsividade:** O sistema é responsivo e se adapta a diferentes tamanhos de tela, incluindo dispositivos móveis.
- **Persistência de Dados:** Os dados do sistema são armazenados em um banco de dados MySQL, garantindo a persistência das informações.
- **Segurança:** As credenciais do banco de dados são armazenadas de forma segura usando variáveis de ambiente e autentificação token JWT.

## Próximos Passos

- Implementar a área do cliente, permitindo que os clientes façam login, visualizem seus pedidos e atualizem seus dados.
- Integrar com um sistema de pagamento para processar pagamentos online.
- Adicionar recursos avançados de relatórios e análises.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests no repositório do GitHub.

## Agradecimentos

Um agradecimento especial à inteligência artificial Gemini 1.5 Pro por sua valiosa assistência no desenvolvimento deste projeto.
