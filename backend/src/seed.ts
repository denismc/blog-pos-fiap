import Usuario from './models/usuarioModel.js';
import argon2 from 'argon2';

const seed = async () => {
  const total = await Usuario.countDocuments();
  if (total > 0) return;

  const pepper = process.env.PEPPER;
  const senhaHash = await argon2.hash('admin123' + pepper, {
    type: argon2.argon2id,
  });

  await Usuario.create({
    nome: 'Administrador',
    email: 'admin@admin.com',
    senha: senhaHash,
    perfil: 'Administrador',
  });

  console.log('Usuário padrão criado: admin@admin.com / admin123');
};

export default seed;
