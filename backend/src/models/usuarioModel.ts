import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    senha: {
      type: String,
      required: true,
      select: false,
    },
    perfil: {
      type: String,
      enum: ['Administrador', 'Professor', 'Aluno'],
      required: true,
      default: 'Aluno',
    },
  },
  {
    timestamps: true,
  }
);

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
