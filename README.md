# Apollousa_Bot

![Apollousa Bot Icon](assets/icon.png)

## 📌 Sobre o projeto

O **Apollousa_Bot** é um bot para o **Telegram**, desenvolvido em **TypeScript**, utilizando:

- A **biblioteca oficial do Telegram** para Node.js
- A estrutura de chatbot [**Gear Roboto**](https://github.com/isaias-silva/gear-roboto)

O projeto foi criado para ser uma **base extensível**, permitindo a criação de comandos personalizados com **registro automático de comandos** via API do Telegram.

---

## 🚀 Principais recursos

- Estrutura modular e de fácil manutenção
- Registro dinâmico de comandos no Telegram
- Suporte a múltiplos comandos por meio do padrão **CommanderFunctions**
- Exemplos de comandos disponíveis em:  
  ```
  src/commands
  ```
- é possível também a implementação de fluxos de conversa e atendimento através do DefaultFlow da biblioteca **gear-roboto**, é testável no comando `/talk`.
---

## ⚙️ Como configurar

1. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```
   API_KEY=SEU_TOKEN_DO_BOT
   ```

   > O token do bot pode ser obtido através do [**@BotFather**](https://t.me/botfather) no Telegram.

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie em modo de desenvolvimento:

   ```bash
   npm run dev
   ```
4. ou compile o código e execute o bot em produção:
 
  ```bash
    npm run build
    npm start
  ```
---

## 🛠️ Criando novos comandos

Para adicionar um novo comando, crie um arquivo dentro da pasta `src/commands`, seguindo a estrutura de **CommanderFunctions**.

A classe TelegramEngine cuidará automaticamente do registro e da execução dos comandos.

---


## 📄 Licença

Este projeto é distribuído sob a licença **MIT**.