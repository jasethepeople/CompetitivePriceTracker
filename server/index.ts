import express from 'express';
import cors from 'cors';
import { createRoutes } from './routes';
import { MemStorage } from './storage';

const app = express();
const storage = new MemStorage();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(createRoutes(storage));

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});