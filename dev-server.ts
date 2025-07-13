import { createServer } from 'vite';
import express from 'express';
import cors from 'cors';
import { createRoutes } from './server/routes';
import { MemStorage } from './server/storage';

const app = express();
const storage = new MemStorage();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use(createRoutes(storage));

const PORT = process.env.PORT || 3000;

async function startServer() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: './client',
    resolve: {
      alias: {
        '@': '/src',
        '@shared': '../shared',
        '@assets': '/src/assets',
      },
    },
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Business Intelligence Tool ready`);
  });
}

startServer().catch(console.error);