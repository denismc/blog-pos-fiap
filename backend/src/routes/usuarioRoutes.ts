import express from 'express';
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from '../controllers/usuarioController.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { autorizar } from '../middlewares/autorizar.js';
import {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
} from '../schemas/usuarioSchema.js';

const router = express.Router();

router.post('/', autorizar('Administrador'), validarSchema(criarUsuarioSchema), criarUsuario);
router.get('/', listarUsuarios);
router.get('/:id', buscarUsuario);
router.put('/:id', autorizar('Administrador'), validarSchema(atualizarUsuarioSchema), atualizarUsuario);
router.delete('/:id', autorizar('Administrador'), deletarUsuario);

export default router;