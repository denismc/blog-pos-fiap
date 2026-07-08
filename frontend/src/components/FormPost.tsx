import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { IPost } from '../interfaces/IPost';
import { criarPostSchema, atualizarPostSchema, CriarPostForm, AtualizarPostForm } from '../schemas/postSchema';

interface FormPostProps {
  postInicial?: IPost | null;
  onSalvar: (dados: CriarPostForm | AtualizarPostForm) => Promise<void>;
  onCancelar: () => void;
}

function FormPost({ postInicial, onSalvar, onCancelar }: FormPostProps) {
  const isEdicao = !!postInicial;
  const schema = isEdicao ? atualizarPostSchema : criarPostSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CriarPostForm | AtualizarPostForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: postInicial?.titulo ?? '',
      conteudo: postInicial?.conteudo ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSalvar)}>
      <div className="campo">
        <label>Título</label>
        <input type="text" {...register('titulo')} />
        {errors.titulo && <span className="erro-campo">{errors.titulo.message}</span>}
      </div>
      <div className="campo">
        <label>Conteúdo</label>
        <textarea rows={8} {...register('conteudo')} />
        {errors.conteudo && <span className="erro-campo">{errors.conteudo.message}</span>}
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

export default FormPost;
