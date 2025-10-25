import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './src/config/database.js';
import { getTMDbService } from './src/tmdb.service.js';
import { swaggerSpec } from './src/config/swagger.config.js';
import apiRoutes from './src/routes.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS bloqueado: origem não permitida."));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Movies API - Documentation'
}));

// Endpoint para baixar o JSON do OpenAPI
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    
    getTMDbService();
    if (tmdbApiKey) {
      console.log('✅ TMDb service initialized');
    } else {
      console.warn('⚠️  TMDb service not configured - movie search will not work');
    }

    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();