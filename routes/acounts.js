import express from 'express';
import { promises as fs } from 'fs';

const { writeFile, readFile } = fs;

const router = express.Router();

/**
 * post a new account
 */
router.post('/', async (req, res) => {
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
    res.status(400).send({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const accountsData = JSON.parse(await readFile(global.dataPath));
    delete accountsData.nextId;
    res.send(accountsData);
  } catch (err) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
