import express from 'express';
import { promises as fs } from 'fs';
import accountsRouter from './routes/acounts.js';
import logger from './log/logger.js';
import cors from 'cors';
import { swaggerDocument } from './doc.js';
import swaggerUi from 'swagger-ui-express';

const { writeFile, readFile } = fs;
global.dataPath = 'accounts.json';
/**
 * cria a const do express
 */
const app = express();
/**
 * permite o uso de arquivos tipo json
 */
app.use(express.json());
/**
 * libera o acesso a pasta 'public' para visualizacao estatica
 */
app.use(express.static('public'));
/**
 * configura documentacao do swagger
 */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/**
 * Cors para liberar acesso de outros servidores
 * pode ser configurado por rota tbm
 */
app.use(cors());
/**
 * direciona todas a requisicoes /accounts para o roteador
 */
app.use('/accounts', accountsRouter);
/**
 * define a porta para subir o servidor
 */
app.listen(8080, async () => {
  try {
    await readFile(global.dataPath);
    logger.info('myBankApi is running...');
  } catch (err) {
    //Se o json nao foi criado, cria json
    const initialJSON = {
      nextId: 1,
      accounts: [],
    };
    writeFile(global.dataPath, JSON.stringify(initialJSON))
      .then(() => {
        logger.info('File created, myBankApi is running...');
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
