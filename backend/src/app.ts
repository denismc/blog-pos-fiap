import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { env } from './config/env.js';
import seed from './seed.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { autenticar } from './middlewares/authMiddleware.js';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  })
);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', autenticar, usuarioRoutes);

mongoose
  .connect(env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB conectado!');
    await seed();
  })
  .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
