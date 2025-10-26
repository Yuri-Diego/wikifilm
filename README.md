# 🎬 WIKIFILM

![Screenshot 1](./public/search.png)
![Screenshot 2](./public/MovieDetailsDarkTheme.png)

## 📖 Sobre o Projeto

WIKIFILM é uma plataforma web moderna de catálogo de filmes que consome a API do TMDB (The Movie Database) para apresentar informações detalhadas sobre filmes. O projeto foi desenvolvido com uma arquitetura de microsserviços, proporcionando escalabilidade e manutenibilidade.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express** - Framework web
- **Zod** - Validação de schemas
- **CORS** - Controle de acesso
- **Swagger** - Documentação da API

### Frontend
- **React** com **JavaScript**
- **Vite.js** - Build tool e dev server
- **Wouter** - Roteamento
- **Tailwind CSS** - Estilização
- **Toast Personalizado** - Notificações e feedbacks
- **Hooks personalizados**: useToast, useMobile

### Banco de Dados
- **PostgreSQL**
- **Prisma ORM**

### Deploy
- **Frontend**: Vercel
- **Backend**: Render
- **Banco de Dados**: Neon

## ✨ Funcionalidades

- 📱 Layout responsivo (Web e Mobile)
- 🎥 Catálogo completo de filmes
- 🔍 Busca de filmes pelo nome
- 📊 Informações detalhadas dos filmes
- ❤️ Gerenciamento e Compartilhamento de Favoritos
- 🔔 Feedbacks visuais com notificações
- 🎨 Interface moderna e intuitiva

## 🛠️ Como Rodar Localmente

### Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL instalado e rodando
- Conta no TMDB para obter a API Key

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/Yuri-Diego/wikifilm.git
cd wikifilm
```

2. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `server` seguindo o exemplo do `.env.example`:

```bash
# 🔗 URL de conexão com o banco de dados PostgreSQL LOCAL
# Formato: postgresql://<usuario>:<senha>@<host>:<porta>/<nome_do_banco>
DATABASE_URL_LOCAL="postgresql://user:password@localhost:5432/wikifilm"

# 🎬 Chave de API do TMDB (The Movie Database)
# Obtenha em: https://www.themoviedb.org/settings/api
TMDB_API_KEY="your_tmdb_api_key_here"

BACKEND_PORT=3000

FRONTEND_URL=http://localhost:5000
```

3. **Instale as dependências do Backend**
```bash
cd .\server\
npm install
```

4. **Configure o banco de dados**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Inicie o Backend**
```bash
npm run dev
```

6. **Instale as dependências do Frontend**

Em outro terminal:
```bash
cd .\client\
npm install
```

7. **Inicie o Frontend**
```bash
npm run dev
```

8. **Acesse a aplicação**

Abra seu navegador e acesse:
- Frontend: `http://localhost:5000`
- Backend API: `http://localhost:3000`
- Documentação Swagger: `http://localhost:3000/api-docs`

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger. Com o backend rodando, acesse:
```
http://localhost:3000/api-docs
```
Ou se preferir ver online sem está com a aplicação rodando localmente, acesse:
```
https://wikifilm.onrender.com/api-docs/
```
![Screenshot 2](./public/Swagger%20ui.png)

## 🌐 Links do Projeto

- **Aplicação Online**: [WikiFilm - Vercel](https://wikifilm-ya.vercel.app/)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por **Yuri Almeida**

- GitHub: [Yuri-Diego](https://github.com/Yuri-Diego)
- LinkedIn: [Yuri Almeida](https://www.linkedin.com/in/dev-yurialmeida/)
- Email: dev.yurialmeida@gmail.com

---

⭐ Se você gostou deste projeto, considere dar uma estrela no repositório!