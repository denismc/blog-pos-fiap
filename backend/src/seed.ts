import Usuario from './models/usuarioModel.js';
import Post from './models/postModel.js';
import argon2 from 'argon2';

const seedUsuarios = async () => {
  const total = await Usuario.countDocuments();
  if (total > 0) return;

  const pepper = process.env.PEPPER;
  const hash = (senha: string) => argon2.hash(senha + pepper, { type: argon2.argon2id });

  await Usuario.create([
    {
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha: await hash('admin123'),
      perfil: 'Administrador',
    },
    {
      nome: 'Professor',
      email: 'professor@professor.com',
      senha: await hash('professor123'),
      perfil: 'Professor',
    },
    {
      nome: 'Aluno',
      email: 'aluno@aluno.com',
      senha: await hash('aluno123'),
      perfil: 'Aluno',
    },
  ]);

  console.log('Usuários padrão criados:');
  console.log('  Administrador: admin@admin.com / admin123');
  console.log('  Professor: professor@professor.com / professor123');
  console.log('  Aluno: aluno@aluno.com / aluno123');
};

const posts = [
  {
    titulo: 'Shadow AI no desenvolvimento: educar e monitorar funciona mais do que proibir',
    conteudo:
      'Um desenvolvedor trava em um bug e, para resolver, decide colar o trecho de código no Claude Code. A solução é recebida em poucos segundos. O problema é que, junto com o trecho colado, foram algumas informações estratégicas da empresa: uma chave de API, a lógica de um produto ou dados de clientes. Ninguém aprovou, ninguém viu e o time de segurança nem tem como saber que isso aconteceu.\n\nEssa cena é cada dia mais comum. A pressão por produtividade faz com que engenheiros e analistas usem a IA generativa numa velocidade que a governança não acompanha. E a adoção vem de baixo para cima: o dev escolhe a ferramenta que ele mais gosta e não espera processo de compra para começar.\n\nEsse movimento tem nome: Shadow AI.\n\nShadow AI é o uso de modelos e ferramentas de IA fora do radar das equipes de segurança, e já aparece nos relatórios do setor como o próximo grande vetor de risco em desenvolvimento de software.\n\nMas sim, é possível incorporar IA generativa sem desmontar os controles de DevSecOps, desde que haja visibilidade, auditoria e guardrails bem desenhados.',
  },
  {
    titulo: 'Como construir um portfólio no GitHub que atrai recrutadores e destaca seu perfil',
    conteudo:
      'Um recrutador abre seu perfil no GitHub e tem, em média, menos de um minuto para decidir se vale a pena seguir adiante. Nesse tempo, ele não vai ler cada linha do seu código. Vai bater o olho na organização do perfil e na clareza com que você descreve o que construiu. É um teste rápido, quase injusto, e a maioria dos candidatos nem passa por ele.\n\nO problema é que muita gente trata o GitHub como um HD na nuvem: um lugar para guardar código e nunca mais voltar, com repositórios sem descrição, projetos de tutorial copiados sem personalização, nenhum texto explicando o raciocínio por trás dos códigos. O resultado é um perfil que tecnicamente existe, mas não comunica nada.\n\nUm portfólio bem construído no GitHub funciona como evidência de que você sabe resolver problemas de fato. Ele mostra como você pensa e o que você entrega, algo que um currículo em PDF nunca vai conseguir fazer sozinho.\n\nMas como transformar seu perfil em uma ferramenta de marketing pessoal capaz de transformar visitas em entrevistas?',
  },
  {
    titulo: 'Por que o UX design é a base da inovação centrada no usuário',
    conteudo:
      'Muitas vezes, o mercado de tecnologia cai em uma armadilha perigosa: acreditar que inovação é sinônimo exclusivo de "novidade técnica". Construímos algoritmos complexos, interfaces cheias de funcionalidades e sistemas pesados sob a premissa de que a sofisticação tecnológica, por si só, será garantidora do sucesso.\n\nNo entanto, a história do Vale do Silício e do ecossistema de startups brasileiro está repleta de "ideias geniais" que fracassaram no primeiro contato com a realidade. O motivo? Eram soluções tecnicamente incríveis, mas desenhadas para problemas que não existiam.\n\nA verdadeira inovação não acontece dentro de uma sala de servidores, mas sim no ponto de equilíbrio entre o que a tecnologia permite construir, o que faz sentido para a estratégia da empresa e, acima de tudo, o que as pessoas realmente desejam e precisam.\n\nNo cenário atual, o UX Design (User Experience Design) surge como o verdadeiro divisor de águas. Ele deixa de ser uma "camada de estética" para se tornar a fundação estratégica de qualquer produto. Criar sem foco no usuário não é inovação, é apenas invenção sem propósito.',
  },
  {
    titulo: '5 ferramentas para desenvolver e implementar agentes de IA na prática',
    conteudo:
      'Os agentes de IA deixaram de ser uma promessa distante da automação inteligente. Eles já começam a ocupar um espaço mais concreto em operações, produtos e fluxos de trabalho, combinando raciocínio, contexto e execução em uma lógica que vai além das respostas isoladas de modelos generativos.\n\nEsse avanço trouxe uma questão mais prática do que conceitual. Entre tantas plataformas, frameworks e soluções empresariais, o desafio já não está apenas em entender o que esses sistemas são, mas em saber quais ferramentas realmente fazem sentido para desenvolver, testar e implementar esse tipo de arquitetura.\n\nAo observar esse movimento mais de perto, fica claro que o valor não está na adoção apressada, mas na capacidade de conectar tecnologia, integração e critério de implementação. É esse recorte que traduz o tema em escolhas mais maduras para quem atua, estuda ou quer crescer no mercado de tecnologia.',
  },
  {
    titulo: 'O que faz um Designer de Jogos e como ingressar na área em 2026',
    conteudo:
      'Entender o que faz o designer de jogos tornou-se fundamental para quem observa a indústria com interesse profissional. Criar um game envolve decisões críticas sobre mecânicas, progressão, desafio, narrativa e experiência do usuário. Por isso, essa atuação exige repertório criativo, além de muita lógica, método e colaboração entre diferentes áreas.\n\nMas essa é uma carreira que é vista de forma limitada e idealizada. Não imaginam que, na prática, o trabalho passa por estruturar sistemas, testar hipóteses, ajustar a jornada do jogador e participar de escolhas que afetam o funcionamento do projeto como um todo. É uma área muito estratégica.\n\nTer essa compreensão é cada vez mais importante, ainda mais em um cenário tecnológico tão acelerado. Com processos mais integrados e equipes cada vez mais multidisciplinares, conhecer melhor essa função ajuda a avaliar competências, caminhos de entrada e perspectivas de mercado com mais clareza.',
  },
];

const seedPosts = async () => {
  const total = await Post.countDocuments();
  if (total > 0) return;

  const professor = await Usuario.findOne({ email: 'professor@professor.com' });
  if (!professor) return;

  await Post.create(posts.map((post) => ({ ...post, autor: professor._id })));

  console.log(`${posts.length} posts padrão criados, autoria de ${professor.email}`);
};

const seed = async () => {
  await seedUsuarios();
  await seedPosts();
};

export default seed;
