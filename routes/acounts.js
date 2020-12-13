import express from 'express';
import { promises as fs } from 'fs';
import logger from '../log/logger.js';

const { writeFile, readFile } = fs;

const router = express.Router();

/**
 * post a new account
 */
router.post('/', async (req, res, next) => {
  try {
    let account = req.body;
    if (!account.name || account.balance == null) {
      throw new Error('Dados insuficientes para ciar a conta.');
    }
    const accountsData = JSON.parse(await readFile(global.dataPath));

    account = {
      id: accountsData.nextId++, //atribui o id da conte e incrementa o nextID
      name: account.name,
      balance: account.balance,
    };

    accountsData.accounts.push(account); //insere a conta no banco de dados

    await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));
    res.send(account);
    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

/**
 * get all accounts
 */
router.get('/', async (req, res, next) => {
  try {
    const accountsData = JSON.parse(await readFile(global.dataPath));
    delete accountsData.nextId;
    res.send(accountsData);
    logger.info(`GET /account - all accounts`);
  } catch (err) {
    next(err);
  }
});

/**
 * get account by Id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const accountsData = JSON.parse(await readFile(global.dataPath));
    const accountById = accountsData.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    if (!accountById) {
      throw new Error('Id da conta nao encontrado');
    }
    res.send(accountById);
    logger.info(`GET /account/:id - ${JSON.stringify(accountById)}`);
  } catch (err) {
    next(err);
  }
});

/**
 * delete account by Id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const accountsData = JSON.parse(await readFile(global.dataPath));
    const accountById = accountsData.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    if (!accountById) {
      throw new Error('Id da conta nao encontrado');
    }
    accountsData.accounts = accountsData.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));

    res.end();
    logger.info(`DELETE /account/:id - ${JSON.stringify(accountById)}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const account = req.body;
    if (!account.id || !account.name || account.balance == null) {
      throw new Error('Dados insuficientes para ciar a conta.');
    }
    const accountsData = JSON.parse(await readFile(global.dataPath));
    const accountIndex = accountsData.accounts.findIndex(
      (account) => account.id === parseInt(req.body.id)
    );

    if (accountIndex === -1) {
      throw new Error('Id da conta nao encontrado');
    }
    accountsData.accounts[accountIndex] = {
      id: account.id,
      name: account.name,
      balance: account.balance,
    };
    await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));
    res.send(account);
    logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    const account = req.body;
    if (!account.id || account.balance == null) {
      throw new Error('Dados insuficientes para ciar a conta.');
    }
    const accountsData = JSON.parse(await readFile(global.dataPath));
    const accountIndex = accountsData.accounts.findIndex(
      (account) => account.id === parseInt(req.body.id)
    );
    if (accountIndex === -1) {
      throw new Error('Id da conta nao encontrado');
    }
    accountsData.accounts[accountIndex].balance = account.balance;
    await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));
    res.send(accountsData.accounts[accountIndex]);
    logger.info(
      `PATCH /account/updateBalance - ${JSON.stringify(
        accountsData.accounts[accountIndex]
      )}`
    );
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
