import express from 'express';

import { Provider } from '../models/provider.js';

export const providerRouter = express.Router();

/**
 * Create a new provider.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The created provider.
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
 * Get a provider by CIF or get all providers.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The provider(s) found.
 */
providerRouter.get('/providers', async (req, res) => {
  const filter = req.query.cif ? { cif: req.query.cif.toString() } : {};

  try {
    const provider = await Provider.find(filter);
    if (provider.length === 0) {
      return res.status(404).send('Provider not found!');
    }
    return res.status(200).send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Get a provider by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The provider found.
 */
providerRouter.get('/providers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).send('Provider not found!');
    }
    return res.status(200).send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Update a provider by CIF.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated provider.
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
      return res.status(404).send('Provider not found!');
    }
    return res.status(200).send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Update a provider by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated provider.
 */
providerRouter.patch('/providers/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  const id = req.params.id;

  try {
    const provider = await Provider.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!provider) {
      return res.status(404).send('Provider not found!');
    }
    return res.status(200).send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Delete a provider by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted provider.
 */
providerRouter.delete('/providers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const provider = await Provider.findByIdAndDelete(id);
    if (!provider) {
      return res.status(404).send('Provider not found!');
    }
    return res.status(200).send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Delete a provider by CIF or delete all providers.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted provider(s).
 */
providerRouter.delete('/providers', async (req, res) => {
  const filter = req.query.cif? { cif: req.query.cif.toString() } : {};

  try {
    const provider = await Provider.findOneAndDelete(filter);
    if (!provider) {
      return res.status(404).send('Provider not found!');
    }
    return res.status(200).send(provider);
  } catch (e) {
    return res.status(400).send(e);
  }
});
