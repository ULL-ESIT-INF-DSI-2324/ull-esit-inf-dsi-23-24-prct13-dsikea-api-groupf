import express from 'express';

import { Customer } from '../models/customer.js';

export const customerRouter = express.Router();

/**
 * @swagger
 * /customers:
 *  post: 
 *   summary: Create a new customer
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
 * @swagger
 * /customers:
 *  get:
 *   summary: Get a customer by NIF or all of them
 */
customerRouter.get('/customers', async (req, res) => {
  const filter = req.query.nif? { nif: req.query.nif.toString() } : {};
  
  try {
    const customer = await Customer.find(filter);
    if (!customer) {
      return res.status(404).send();
    }
    return res.status(201).send(customer);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /customers/{id}:
 *  get:
 *   summary: Get a customer by ID
 */
customerRouter.get('/customers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).send();
    }
    return res.status(201).send(customer);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /customers:
 *  patch:
 *   summary: Update a customer by NIF
 */
customerRouter.patch('/customers', async (req, res) => {
  if(!req.query.nif) {
    return res.status(400).send('Cannot update without a nif.');
  }
  const filter = { nif: req.query.nif.toString() };

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'address'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const customer = await Customer.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!customer) {
      return res.status(404).send();
    }
    return res.status(201).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @swagger
 * /customers:
 *  patch:
 *   summary: Update a customer by ID
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
      return res.status(404).send();
    }
    return res.status(201).send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @swagger
 * /customers/{id}:
 *  delete:
 *   summary: Delete a customer by ID
 */
customerRouter.delete('/customers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).send();
    }
    return res.status(201).send(customer);
  } catch (e) {
    return res.status(500).send();
  }
});


/**
 * @swagger
 * /customers:
 *  delete:
 *   summary: Delete a customer by NIF or all of them
 */
customerRouter.delete('/customers', async (req, res) => {
  const filter = req.query.nif? { nif: req.query.nif.toString() } : {};

  try {
    const customer = await Customer.findOneAndDelete(filter);
    if (!customer) {
      return res.status(404).send({error: "Customer not found"});
    }
    return res.status(200).send(customer);
  } catch (e) {
    return res.status(500).send();
  }
});

