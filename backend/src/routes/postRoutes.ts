import express from 'express';
import { PostRepository } from '../repositories/PostRepository.js';
import { PostController } from '../controllers/postController.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { autorizar } from '../middlewares/autorizar.js';
import { criarPostSchema, atualizarPostSchema } from '../schemas/postSchema.js';

const router = express.Router();
const repository = new PostRepository();
const controller = new PostController(repository);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Criar novo post (Professor ou Administrador)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - conteudo
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Introdução ao Node.js
 *               conteudo:
 *                 type: string
 *                 example: Node.js é um runtime JavaScript...
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.post('/', autorizar('Administrador', 'Professor'), validarSchema(criarPostSchema), (req, res) =>
  controller.criarPost(req, res)
);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Buscar posts por título ou conteúdo
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         example: node
 *     responses:
 *       200:
 *         description: Lista de posts encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/search', (req, res) => controller.pesquisarPosts(req, res));

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Listar todos os posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/', (req, res) => controller.listarPosts(req, res));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Buscar post por ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Post não encontrado
 */
router.get('/:id', (req, res) => controller.buscarPost(req, res));

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualizar post (somente o autor ou Administrador)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Introdução ao Node.js (atualizado)
 *               conteudo:
 *                 type: string
 *                 example: Node.js é um runtime JavaScript...
 *               autor:
 *                 type: string
 *                 description: Somente Administrador pode reatribuir o autor
 *                 example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Post não encontrado
 */
router.put('/:id', autorizar('Administrador', 'Professor'), validarSchema(atualizarPostSchema), (req, res) =>
  controller.atualizarPost(req, res)
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Deletar post (somente o autor ou Administrador)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64a1b2c3d4e5f6a7b8c9d0e1
 *     responses:
 *       200:
 *         description: Post deletado com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Post não encontrado
 */
router.delete('/:id', autorizar('Administrador', 'Professor'), (req, res) => controller.deletarPost(req, res));

export default router;
