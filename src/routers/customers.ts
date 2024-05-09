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
 *   summary: Get all customers
 */
customerRouter.get('/customers', async (_, res) => {
  try {
    const customers = await Customer.find();
    res.status(201).send(customers);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * @swagger
 * /customers/{id}:
 *  get:
 *   summary: Get a customer by NIF
 */
customerRouter.get('/customers', async (req, res) => {
  try {
    const customer = await Customer.findOne({ nif: req.query.nif });
    if (!customer) {
      return res.status(404).send();
    }
    return res.send(customer);
  } catch (e) {
    return res.status(500).send();
  }
});