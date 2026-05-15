import { createServer } from 'vite';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createRoutes } from './server/routes';
import { MemStorage } from './server/storage';

const app = express();
const storage = new MemStorage();

app.use(cors());
app.use(express.json());
app.use(createRoutes(storage));

const PORT = 5000;

async function startServer() {
  const vite = await createServer({
    server: { middlewareMode: true, allowedHosts: 'all' },
    appType: 'spa',
    root: path.resolve('./client'),
    resolve: {
      alias: {
        '@': path.resolve('./client/src'),
        '@shared': path.resolve('./shared'),
        '@assets': path.resolve('./client/src/assets'),
      },
    },
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Business Intelligence Tool ready`);
  });
}

startServer().catch(console.error);
