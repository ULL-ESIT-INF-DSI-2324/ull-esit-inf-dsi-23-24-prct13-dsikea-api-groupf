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
    return res.send(customer);
  } catch (e) {
    return res.status(500).send();
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
    return res.send(customer);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /customers/{id}:
 *  put:
 *   summary: Update a customer by ID
 */
customerRouter.put('/customers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
    if (!customer) {
      return res.status(404).send();
    }
    return res.send(customer);
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
    return res.send(customer);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /customers/nif/{nif}:
 *  delete:
 *   summary: Delete a customer by NIF
 */
customerRouter.delete('/customers/nif/:nif', async (req, res) => {
  const nif = req.params.nif;

  try {
    const customer = await Customer.findOneAndDelete({ nif });
    if (!customer) {
      return res.status(404).send();
    }
    return res.send(customer);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /customers/nif/{nif}:
 *  put:
 *   summary: Update a customer by NIF
 */
customerRouter.put('/customers/nif/:nif', async (req, res) => {
  const nif = req.params.nif;

  try {
    const customer = await Customer.findOneAndUpdate({ nif }, req.body, { new: true });
    if (!customer) {
      return res.status(404).send();
    }
    return res.send(customer);
  } catch (e) {
    return res.status(400).send(e);
  }
});
