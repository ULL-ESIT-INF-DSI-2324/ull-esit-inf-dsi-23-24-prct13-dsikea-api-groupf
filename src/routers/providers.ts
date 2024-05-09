import express from 'express';

import { Provider } from '../models/provider.js';

export const providerRouter = express.Router();

/**
 * @swagger
 * /providers:
 *  post:
 *   summary: Create a new provider
 */
providerRouter.post('/providers', async (req, res) => {
  const provider = new Provider(req.body);
  try {
    await provider.save();
    res.status(201).send(provider);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @swagger
 * /providers/{id}:
 *  get:
 *   summary: Get a provider by ID or all of them
 */
providerRouter.get('/providers', async (req, res) => {
  const filter = req.query.cif ? { cif: req.query.cif.toString() } : {};

  try {
    const provider = await Provider.find(filter);
    if (!provider) {
      return res.status(404).send();
    }
    return res.send(provider);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /providers/{id}:
 *  get:
 *   summary: Get a provider by ID
 */
providerRouter.get('/providers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).send();
    }
    return res.send(provider);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /providers/{id}:
 *  put:
 *   summary: Update a provider by ID
 */
providerRouter.put('/providers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const provider = await Provider.findByIdAndUpdate(id, req.body, { new: true });
    if (!provider) {
      return res.status(404).send();
    }
    return res.send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @swagger
 * /providers/{id}:
 *  delete:
 *   summary: Delete a provider by ID
 */
providerRouter.delete('/providers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const provider = await Provider.findByIdAndDelete(id);
    if (!provider) {
      return res.status(404).send();
    }
    return res.send(provider);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /providers/cif/{cif}:
 *  get:
 *   summary: Get a provider by CIF
 */
providerRouter.get('/providers/cif/:cif', async (req, res) => {
  const cif = req.params.cif;

  try {
    const provider = await Provider.findOne({ cif });
    if (!provider) {
      return res.status(404).send();
    }
    return res.send(provider);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /providers/cif/{cif}:
 *  delete:
 *   summary: Delete a provider by CIF
 */
providerRouter.delete('/providers/cif/:cif', async (req, res) => {
  const cif = req.params.cif;

  try {
    const provider = await Provider.findOneAndDelete({ cif });
    if (!provider) {
      return res.status(404).send();
    }
    return res.send(provider);
  } catch (e) {
    return res.status(500).send();
  }
});
