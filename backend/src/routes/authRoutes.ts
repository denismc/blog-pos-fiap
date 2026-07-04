import express from 'express';
import { login } from '../controllers/authController.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { loginSchema } from '../schemas/usuarioSchema.js';

const router = express.Router();

router.post('/login', validarSchema(loginSchema), login);

export default router;