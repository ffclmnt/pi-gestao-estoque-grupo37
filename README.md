# Gestor de Inventário e Pedidos (B2B)

Projeto Integrador do curso de **Análise e Desenvolvimento de Sistemas** do Centro Universitário Senac (2026), grupo 37.

Plataforma web para pequenas e médias distribuidoras B2B que unifica vendas e logística em um único ambiente. O objetivo é acabar com os controles paralelos e manuais, que levam a vendas de produtos sem saldo real, atrasos na separação de mercadorias e falhas de comunicação interna.

## Equipe

- Fernanda Faedo Calamante
- Frank Holbach Duarte
- Thais Gabriel Almeida Gai

## O que já está implementado

O painel de operações do **gerente de operações (persona Carlos)**:

- Contadores de pedidos pendentes e de produtos com estoque baixo
- Lista de alertas de estoque baixo (estoque atual e estoque mínimo)
- Fila de pedidos aguardando aprovação, com ação de **aprovar** ou **rejeitar** a saída de mercadoria
- Ao aprovar, o sistema confere o saldo e dá baixa no estoque na **mesma transação**
- Versão **mobile instalável (PWA)** do mesmo painel

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Java 21, Spring Boot, Maven (Maven Wrapper incluído) |
| Banco de dados | MySQL |
| Frontend | JavaScript puro com Vite |
| Mobile | PWA (manifesto, service worker e CSS responsivo) |

## Estrutura do repositório

```
backend/    API REST em Java (Spring Boot)
database/   script.sql com as tabelas e dados de exemplo
frontend/   painel web e PWA (Vite)
```

## Como rodar

### Pré-requisitos

- **Java 21**
- **MySQL** com um usuário `root` (o projeto espera a senha `admin`, veja o passo 2)
- **Node.js** na versão 20.19 ou superior, ou 22.12 ou superior

### 1. Criar o banco de dados

Na raiz do projeto:

```
mysql -u root -p < database/script.sql
```

O script cria o banco `gestao_estoque`, as tabelas e alguns dados de exemplo.

### 2. Conferir a conexão com o banco

O arquivo `backend/src/main/resources/application.properties` aponta para `localhost:3306` com o usuário `root` e a senha `admin`. Se a sua senha do MySQL for outra, troque o valor de `spring.datasource.password` apenas na sua máquina.

### 3. Subir o backend

```
cd backend
./mvnw spring-boot:run
```

No Windows, use `mvnw.cmd spring-boot:run`. Aguarde a mensagem `Tomcat started on port 8080` e deixe o terminal aberto.

### 4. Subir o frontend

Em outro terminal:

```
cd frontend
npm install
npm run dev
```

Abra o endereço mostrado no terminal, normalmente `http://localhost:5173/`.

O Vite repassa as chamadas que começam com `/api` para o backend em `localhost:8080` (configurado em `frontend/vite.config.js`). Por isso o backend precisa estar rodando antes de abrir o painel.

## API

| Método | Rota | O que faz |
|---|---|---|
| `GET` | `/api/operacoes/estoque-baixo` | Lista os produtos com estoque no mínimo ou abaixo dele |
| `GET` | `/api/operacoes/pedidos-pendentes` | Lista os pedidos aguardando aprovação |
| `POST` | `/api/operacoes/pedidos/{id}/aprovar` | Aprova o pedido e dá baixa no estoque |
| `POST` | `/api/operacoes/pedidos/{id}/rejeitar` | Rejeita o pedido |

O arquivo `backend/src/main/resources/operacoes.http` tem exemplos prontos para testar essas rotas com a extensão REST Client do VS Code.

## Versão mobile (PWA)

O painel pode ser instalado como aplicativo:

1. Com o backend e o front rodando, abra `http://localhost:5173/` no **Google Chrome**.
2. Clique no ícone de instalação na barra de endereço (ou use o menu do Chrome, em *Instalar Gestor de Estoque*).
3. Para ver o layout de celular sem um aparelho, abra as ferramentas de desenvolvedor (`F12`) e ative o modo dispositivo.

Observações:

- Em telas pequenas, a tabela de pedidos vira uma lista de cartões, e os botões de ação ficam maiores.
- O service worker guarda os arquivos do próprio app para abrir sem internet, mas **nunca guarda as respostas da API**, para que ninguém aprove pedidos olhando um estoque desatualizado.
- A instalação em um celular de verdade exige endereço **HTTPS**. Em `localhost`, ela funciona no computador.

## Evoluções previstas

Itens do escopo original ainda não implementados nesta entrega:

- Cadastro de clientes e de produtos
- Criação de pedidos pelos atendentes de vendas, com verificação de saldo em tempo real
- Histórico de movimentação de estoque (entrada, saída e usuário)
- Login e perfis de acesso (atendente, gerente, analista)

## Referências

- NIELSEN, J.; LORANGER, H. *Usabilidade na Web: projetando websites com qualidade*. Rio de Janeiro: Elsevier, 2007.
- PRESSMAN, R. S.; MAXIM, B. R. *Engenharia de Software: uma abordagem profissional*. 8. ed. Porto Alegre: AMGH, 2016.
- SOMMERVILLE, I. *Engenharia de Software*. 10. ed. São Paulo: Pearson, 2019.
