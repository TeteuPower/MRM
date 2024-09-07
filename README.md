# MRM - Sistema de Gerenciamento de Vendas e Estoque

**Um sistema web completo para gerenciar clientes, vendas, estoque, funcionários e finanças, desenvolvido integralmente por mim!**

## Visão Geral

O MRM é um sistema web intuitivo e poderoso projetado para simplificar o gerenciamento de negócios. Ele oferece uma gama completa de funcionalidades, incluindo:

- **Gerenciamento de Clientes:** Cadastro, consulta e atualização de dados de clientes, com extrato de transações e saldo.
- **Gerenciamento de Vendas:** Criação de novas vendas com adição de produtos ao carrinho, cálculo de valores (insumos, comissões etc), atualização de estoque e registro de pagamentos.
- **Controle de Estoque:** Visualização e atualização de estoque de produtos e matérias-primas, com alertas visuais para níveis baixos, médio e altos!
- **Gerenciamento de Funcionários:** Cadastro, remoção e visualização do desempenho de vendedores e produtores.
- **Controle Financeiro:** Registro de repasses de comissão aos produtores, pagamentos de clientes, visualização de clientes com saldo negativo e resumo mensal de ganhos.

## Processo de Desenvolvimento

O desenvolvimento do MRM foi um processo impulsionado pela inteligência artificial Gemini 1.5 Pro. A IA forneceu sugestões de código, ajudou a resolver problemas, otimizou a lógica e aprimorou a estrutura do sistema.

## Linguagens e Tecnologias

- **HTML:** Estrutura e conteúdo das páginas web.
- **CSS:** Estilização e layout das páginas web, com foco em um tema escuro e moderno.
- **JavaScript:** Lógica do sistema, interação com o usuário, manipulação de dados e comunicação com o servidor.
- **Node.js:** Ambiente de execução JavaScript no servidor para conectar o sistema ao banco de dados MySQL.
- **MySQL Database:** Banco de dados relacional para armazenar os dados do sistema de forma persistente.
- **Railway:** Plataforma de implantação e hospedagem para o sistema web e o banco de dados.

### Segurança

- **Autenticação:** As APIs são protegidas por JWT (JSON Web Token). Rotas que geram um token para administradores autenticados, e para CADA acesso o middleware verifica a validade do token em rotas protegidas.
- **Redundância** As rotas são protegidas na criação do seu caminho e também na chamada. Os tokens de segurança têm validade de 1 hora e após o login precisa ser refeito. A página a cada 10s consulta se existe um token de segurança.
- **DB** As credenciais do DB são armazenadas em variáveis de ambiente!

## Estrutura do Código

O código do sistema está organizado da seguinte forma:

### Backend (Node.js)

- **`server.js`:** Arquivo principal do servidor Node.js, responsável por:
    - Configurar o servidor.
    - Definir as rotas principais das APIs.
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
- **`funcoes.js`:** Contém funções JavaScript reutilizáveis, que precisam ser acessadas em mais de uma página como por exemplo popular inputs com informações do DB.

### Observações

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

Contribuições são bem-vindas! Desenvolvi esse projeto como o meu "TCC" de programador, é o meu primeiro trabalho na área e espero melhorar muito e continuar desenvolvendo minhas habilidades de programador!

## Agradecimentos

Um agradecimento especial à inteligência artificial Gemini 1.5 Pro por sua valiosa assistência no desenvolvimento deste projeto.
