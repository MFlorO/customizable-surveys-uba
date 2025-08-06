const { PORT: ENV_PORT } = require('../backend/env');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Documentación de API - Encuestas',
    version: '1.0.0',
    description: 'API para la gestión de encuestas',
  },
  servers: [
    {
      url: `http://localhost:${ENV_PORT || 3001}`,
    },
  ],
  components: {
    schemas: {
      Survey: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: "Encuesta de satisfacción" },
          description: { type: 'string', example: "Queremos saber tu opinión" },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED'], example: 'DRAFT' },
          isEnable: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time', example: "2023-08-01T12:00:00Z" },
          updatedAt: { type: 'string', format: 'date-time', example: "2023-08-02T15:30:00Z" },
          sections: {
            type: 'array',
            items: { $ref: '#/components/schemas/Section' }
          }
        }
      },
      Section: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 10 },
          title: { type: 'string', example: "Sección 1" },
          order: { type: 'integer', example: 1 },
          surveyId: { type: 'integer', example: 1 },
          questions: {
            type: 'array',
            items: { $ref: '#/components/schemas/Question' }
          }
        }
      },
      Question: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 100 },
          title: { type: 'string', example: "¿Cuál es tu edad?" },
          description: { type: 'string', example: "Indica tu edad en años" },
          type: { type: 'string', enum: ['TEXT', 'TEXT_LIMITED', 'NUMBER', 'NUMBER_LIMITED', 'SELECT_ONE', 'SELECT_MULTIPLE'], example: 'NUMBER' },
          isRequired: { type: 'boolean', example: true },
          characterLimit: { type: 'integer', nullable: true, example: 100 },
          options: {
            type: 'array',
            items: { $ref: '#/components/schemas/Option' }
          }
        }
      },
      Option: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1000 },
          label: { type: 'string', example: "Opción A" },
          code: { type: 'integer', example: 1 },
          isCustomText: { type: 'boolean', example: false }
        }
      },
      SurveyResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 200 },
          surveyId: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time', example: "2023-08-05T10:00:00Z" },
          answers: {
            type: 'array',
            items: { $ref: '#/components/schemas/Answer' }
          }
        }
      },
      Answer: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 300 },
          responseId: { type: 'integer', example: 200 },
          questionId: { type: 'integer', example: 100 },
          optionCodes: {
            type: 'array',
            items: { type: 'integer' },
            example: [1, 2]
          },
          textAnswer: { type: 'string', nullable: true, example: "Me gustó mucho" },
          numericAnswer: { type: 'number', format: 'float', nullable: true, example: 23.5 },
          logicApplied: { type: 'boolean', example: false },
          logicAction: {
            type: 'string',
            enum: ['FINALIZE', 'DISABLE_QUESTION', 'ENABLE_QUESTION', 'DISABLE_SECTION'],
            nullable: true
          },
          logicTargetId: { type: 'integer', nullable: true }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};

