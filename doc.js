export const swaggerDocument = {
  swagger: '2.0',
  info: {
    description: 'myBankAPI documentation',
    version: '1.0.0',
    title: 'My Bank API',
  },
  host: 'localhost:8080',
  tags: [
    {
      name: 'account',
      description: 'Account management',
    },
  ],
  schemes: ['http'],
  paths: {
    '/account': {
      post: {
        tags: ['account'],
        summary: 'create a new account',
        description: '',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'account object that needs to be added to the list',
            required: true,
            schema: {
              $ref: '#/definitions/Account',
            },
          },
        ],
        responses: {
          200: {
            description: 'Account created',
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
      get: {
        tags: ['account'],
        summary: 'Logs out current logged in user session',
        description: '',
        operationId: 'logoutUser',
        produces: ['application/json'],
        parameters: [],
        responses: {
          default: {
            description: 'successful operation',
          },
        },
      },
      put: {
        tags: ['account'],
        summary: 'Updated user',
        description: 'This can only be done by the logged in user.',
        operationId: 'updateUser',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Updated user object',
            required: true,
            schema: {
              $ref: '#/definitions/Account',
            },
          },
        ],
        responses: {
          400: {
            description: 'Invalid user supplied',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    },
    '/account/{id}': {
      get: {
        tags: ['account'],
        summary: 'Get user by user name',
        description: '',
        operationId: 'getUserByName',
        produces: ['application/json'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description:
              'The name that needs to be fetched. Use user1 for testing. ',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#/definitions/Account',
            },
          },
          400: {
            description: 'Invalid username supplied',
          },
          404: {
            description: 'User not found',
          },
        },
      },
      delete: {
        tags: ['account'],
        summary: 'Delete user',
        description: 'This can only be done by the logged in user.',
        operationId: 'deleteUser',
        produces: ['application/json'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The name that needs to be deleted',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          400: {
            description: 'Invalid username supplied',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    },
  },
  definitions: {
    Account: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1,
        },
        name: {
          type: 'string',
          example: 'Jerry',
        },
        balance: {
          type: 'integer',
          example: '199.99',
        },
      },
    },
  },
};
