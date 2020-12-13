import express from 'express';
import { promises as fs } from 'fs';

const { writeFile, readFile } = fs;

const router = express.Router();

/**
 * post a new account
 */
router.post('/', async (req, res, next) => {
  try {
    let account = req.body;
    const accountsData = JSON.parse(await readFile(global.dataPath));

    account = {
      id: accountsData.nextId++, //atribui o id da conte e incrementa o nextID
      ...account, //spread all other data
    };

    accountsData.accounts.push(account); //insere a conta no banco de dados

    await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));
    res.send(account);
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
    if (accountById) {
      res.send(accountById);
    } else {
      throw new Error('Id da conta nao encontrado');
    }
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
    accountsData.accounts = accountsData.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));

    res.end();
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const accountsData = JSON.parse(await readFile(global.dataPath));
    const account = req.body;

    const accountIndex = accountsData.accounts.findIndex(
      (account) => account.id === parseInt(req.body.id)
    );
    if (accountIndex !== -1) {
      accountsData.accounts[accountIndex] = account;
      await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));
      res.send(account);
    } else {
      throw new Error('Id da conta nao encontrado');
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    const accountsData = JSON.parse(await readFile(global.dataPath));
    const account = req.body;

    const accountIndex = accountsData.accounts.findIndex(
      (account) => account.id === parseInt(req.body.id)
    );
    if (accountIndex !== -1) {
      accountsData.accounts[accountIndex].balance = account.balance;
      await writeFile(global.dataPath, JSON.stringify(accountsData, null, 2));
      res.send(accountsData.accounts[accountIndex]);
    } else {
      throw new Error('Id da conta nao encontrado');
    }
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send({ error: err.message });
});

export default router;
