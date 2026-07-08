import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login Argon2id — API',
      version: '1.0.0',
      description: 'Documentação da API do boilerplate de autenticação',
    },
    servers: [
      {
        url: '/api',
        description: 'API Base',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            perfil: {
              type: 'string',
              enum: ['Administrador', 'Professor', 'Aluno'],
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            titulo: { type: 'string', example: 'Introdução ao Node.js' },
            conteudo: { type: 'string', example: 'Node.js é um runtime JavaScript...' },
            autor: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
                nome: { type: 'string', example: 'João Silva' },
              },
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          },
        },
        ErroValidacao: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Dados inválidos' },
            detalhes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  campo: { type: 'string', example: 'email' },
                  mensagem: { type: 'string', example: 'Email inválido' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);