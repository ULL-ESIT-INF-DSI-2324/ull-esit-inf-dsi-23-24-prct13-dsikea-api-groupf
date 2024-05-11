import express from 'express';

import { Customer } from '../models/customer.js';

export const customerRouter = express.Router();

/**
 * Create a new customer.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The created customer or an error message.
 */
customerRouter.post('/customers', async (req, res) => {
  const customer = new Customer(req.body);
  try {
    await customer.save();
    res.status(201).send(customer);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Get a customer by NIF or retrieve all customers.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The customer(s) or an error message.
 */
customerRouter.get('/customers', async (req, res) => {
  const filter = req.query.nif ? { nif: req.query.nif.toString() } : {};

  try {
    const customer = await Customer.find(filter);
    if (customer.length === 0) {
      return res.status(404).send('Customer not found!');
    }
    return res.status(200).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Get a customer by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The customer or an error message.
 */
customerRouter.get('/customers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).send('Customer not found!');
    }
    return res.status(200).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Update a customer by NIF.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated customer or an error message.
 */
customerRouter.patch('/customers', async (req, res) => {
  if (!req.query.nif) {
    return res.status(400).send('Cannot update without a nif.');
  }
  const filter = { nif: req.query.nif.toString() };

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send('Invalid updates!');

  try {
    const customer = await Customer.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!customer) {
      return res.status(404).send('Customer not found!');
    }
    return res.status(200).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Update a customer by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated customer or an error message.
 */
customerRouter.patch('/customers/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  const id = req.params.id;

  try {
    const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!customer) {
      return res.status(404).send('Customer not found!');
    }
    return res.status(200).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Delete a customer by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted customer or an error message.
 */
customerRouter.delete('/customers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).send('Customer not found!');
    }
    return res.status(200).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Delete a customer by NIF or delete all customers.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted customer(s) or an error message.
 */
customerRouter.delete('/customers', async (req, res) => {
  const filter = req.query.nif ? { nif: req.query.nif.toString() } : {};

  try {
    const customer = await Customer.findOneAndDelete(filter);
    if (!customer) {
      return res.status(404).send('Customer not found!');
    }
    return res.status(200).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

