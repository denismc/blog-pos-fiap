import express from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { AuthController } from '../controllers/authController.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { loginSchema } from '../schemas/usuarioSchema.js';

const router = express.Router();
const repository = new UsuarioRepository();
const controller = new AuthController(repository);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@admin.com
 *               senha:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       401:
 *         description: Credenciais inválidas
 */

router.post('/login', validarSchema(loginSchema), (req, res) => controller.login(req, res));

export default router;