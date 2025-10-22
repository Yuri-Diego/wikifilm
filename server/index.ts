import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './src/config/database.js';
import { getTMDbService } from './src/tmdb.service.js';
import apiRoutes from './src/routes.js'

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true,
}));

app.use(express.json());

app.use('/api', apiRoutes)

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
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();