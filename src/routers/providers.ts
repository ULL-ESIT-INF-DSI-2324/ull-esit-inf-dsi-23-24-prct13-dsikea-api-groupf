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
 * /providers:
 *  get:
 *   summary: Get a provider by CIF or all of them
 */
providerRouter.get('/providers', async (req, res) => {
  const filter = req.query.cif ? { cif: req.query.cif.toString() } : {};

  try {
    const provider = await Provider.find(filter);
    if (!provider) {
      return res.status(404).send();
    }
    return res.status(201).send(provider);
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
 * /providers:
 *  patch:
 *   summary: Update a provider by CIF
 */
providerRouter.patch('/providers', async (req, res) => {
  if(!req.query.cif) {
    return res.status(400).send('Cannot update without a cif.')
  }
  const filter = { cif: req.query.cif.toString() };
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const provider = await Provider.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!provider) {
      return res.status(404).send();
    }
    return res.status(201).send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @swagger
 * /provider:
 *  patch:
 *   summary: Update a provider by ID
 */
providerRouter.patch('/provider/:id', async (req, res) => {
  const id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const provider = await Provider.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!provider) {
      return res.status(404).send();
    }
    return res.status(201).send(provider);
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
    return res.status(201).send(provider);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /providers:
 *  delete:
 *   summary: Delete a provider by CIF or all of them
 */
providerRouter.delete('/providers', async (req, res) => {
  const filter = req.query.cif? { cif: req.query.cif.toString() } : {};

  try {
    const provider = await Provider.findOneAndDelete(filter);
    if (!provider) {
      return res.status(404).send({error: "Provider not found"});
    }
    return res.status(200).send(provider);
  } catch (e) {
    return res.status(500).send();
  }
});
