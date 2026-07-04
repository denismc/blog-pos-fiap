import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { IUsuario } from '../interfaces/IUsuario';
import {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
  CriarUsuarioForm,
  AtualizarUsuarioForm,
} from '../schemas/usuarioSchema';

interface FormUsuarioProps {
  usuarioInicial?: IUsuario | null;
  onSalvar: (dados: CriarUsuarioForm | AtualizarUsuarioForm) => Promise<void>;
  onCancelar: () => void;
}

function FormUsuario({ usuarioInicial, onSalvar, onCancelar }: FormUsuarioProps) {
  const isEdicao = !!usuarioInicial;
  const schema = isEdicao ? atualizarUsuarioSchema : criarUsuarioSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CriarUsuarioForm | AtualizarUsuarioForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: usuarioInicial?.nome ?? '',
      email: usuarioInicial?.email ?? '',
      senha: '',
      perfil: usuarioInicial?.perfil ?? undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSalvar)}>
      <div className="campo">
        <label>Nome</label>
        <input type="text" {...register('nome')} />
        {errors.nome && <span className="erro-campo">{errors.nome.message}</span>}
      </div>
      <div className="campo">
        <label>Email</label>
        <input type="email" {...register('email')} />
        {errors.email && <span className="erro-campo">{errors.email.message}</span>}
      </div>
      <div className="campo">
        <label>Perfil</label>
        <select {...register('perfil')}>
          <option value="">Selecione...</option>
          <option value="Administrador">Administrador</option>
          <option value="Professor">Professor</option>
          <option value="Aluno">Aluno</option>
        </select>
        {errors.perfil && <span className="erro-campo">{errors.perfil.message}</span>}
      </div>
      <div className="campo">
        <label>Senha {isEdicao && '(deixe em branco para manter)'}</label>
        <input type="password" {...register('senha')} />
        {errors.senha && <span className="erro-campo">{errors.senha.message}</span>}
      </div>
      <div className="acoes-modal">
        <button type="button" onClick={onCancelar}>Cancelar</button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

export default FormUsuario;