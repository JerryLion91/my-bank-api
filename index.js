import express from 'express';
import { promises as fs } from 'fs';
import accountsRouter from './routes/acounts.js';
import logger from './log/logger.js';

const { writeFile, readFile } = fs;
global.dataPath = 'accounts.json';

const app = express();
app.use(express.json());

app.use('/accounts', accountsRouter);

app.listen(8080, async () => {
  try {
    await readFile(global.dataPath);
    logger.info('myBankApi is running...');
  } catch (err) {
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
