import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WikiFilm - API Routes',
      version: '1.0.2',
      description: 'WIKIFILM - website para gerenciamento de filmes, favoritos e compartilhamentos',
      contact: {
        name: 'Yuri Almeida',
        email: 'dev.yurialmeida@gmail.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.BACKEND_PORT || 3000}`,
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Movie: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 550 },
            title: { type: 'string', example: 'Fight Club' },
            overview: { type: 'string', example: 'A ticking-time-bomb insomniac...' },
            poster_path: { type: 'string', example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
            backdrop_path: { type: 'string', example: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg' },
            release_date: { type: 'string', example: '1999-10-15' },
            vote_average: { type: 'number', example: 8.4 },
            runtime: { type: 'number', example: 139 },
            genres: { 
              type: 'array',
              items: { type: 'string' },
              example: ['Drama', 'Thriller', 'Comedy']
            }
          }
        },
        Favorite: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            tmdbMovieId: { type: 'integer', example: 550 },
            title: { type: 'string', example: 'Fight Club' },
            posterPath: { type: 'string', nullable: true, example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
            backdropPath: { type: 'string', nullable: true, example: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg' },
            rating: { type: 'number', nullable: true, example: 8.4 },
            year: { type: 'string', nullable: true, example: '1999' },
            overview: { type: 'string', nullable: true, example: 'A ticking-time-bomb insomniac...' },
            releaseDate: { type: 'string', nullable: true, example: '1999-10-15' },
            runtime: { type: 'integer', nullable: true, example: 139 },
            genres: { 
              type: 'array',
              items: { type: 'string' },
              example: ['Drama', 'Thriller']
            }
          }
        },
        ShareLink: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 550 },
            shareId: { type: 'string', example: 'abc123xyz' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            moviesData: { 
              type: 'array',
              items: { $ref: '#/components/schemas/Favorite' },
              description: 'Lista de filmes favoritos compartilhados'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erro ao processar requisição' },
            error: { type: 'string', example: 'Error details' }
          }
        }
      }
    }
  },
  // IMPORTANTE: Aponta para os arquivos de rotas TypeScript
  apis: ['./src/routes/**/*.ts', './src/routes.ts']
};

export const swaggerSpec = swaggerJsdoc(options);