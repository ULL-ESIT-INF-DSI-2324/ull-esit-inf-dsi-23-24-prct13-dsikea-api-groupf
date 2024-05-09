import express from 'express';

import { Furniture } from '../models/furniture.js';

export const furnitureRouter = express.Router();

/**
 * @swagger
 * /furnitures:
 *  post:
 *   summary: Create a new furniture
 */
furnitureRouter.post('/furnitures', async (req, res) => {
  const furniture = new Furniture(req.body);
  try {
    await furniture.save();
    res.status(201).send(furniture);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @swagger
 * /furnitures/{id}:
 *  get:
 *   summary: Get a furniture by ID or all of them
 */
furnitureRouter.get('/furnitures', async (req, res) => {
  const filter = req.query.name ? { name: { $regex: req.query.name.toString(), $options: 'i' } } : {};

  try {
    const furniture = await Furniture.find(filter);
    if (!furniture) {
      return res.status(404).send();
    }
    return res.send(furniture);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /furnitures/{id}:
 *  get:
 *   summary: Get a furniture by ID
 */
furnitureRouter.get('/furnitures/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const furniture = await Furniture.findById(id);
    if (!furniture) {
      return res.status(404).send();
    }
    return res.send(furniture);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /furnitures/{id}:
 *  put:
 *   summary: Update a furniture by ID
 */
furnitureRouter.put('/furnitures/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const furniture = await Furniture.findByIdAndUpdate(id, req.body, { new: true });
    if (!furniture) {
      return res.status(404).send();
    }
    return res.send(furniture);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @swagger
 * /furnitures/{id}:
 *  delete:
 *   summary: Delete a furniture by ID
 */
furnitureRouter.delete('/furnitures/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const furniture = await Furniture.findByIdAndDelete(id);
    if (!furniture) {
      return res.status(404).send();
    }
    return res.send(furniture);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /furnitures/search:
 *  get:
 *   summary: Search for furniture by name, description, color, or all of them
 */
furnitureRouter.get('/furnitures/search', async (req, res) => {
  const { name, description, color } = req.query;
  const filter: any = {};

  if (name) filter.name = { $regex: name.toString(), $options: 'i' };
  if (description) filter.description = { $regex: description.toString(), $options: 'i' };
  if (color) filter.color = { $regex: color.toString(), $options: 'i' };

  try {
    const furniture = await Furniture.find(filter);
    if (!furniture) {
      return res.status(404).send();
    }
    return res.send(furniture);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /furnitures/{id}:
 *  delete:
 *   summary: Delete a furniture by ID
 */
furnitureRouter.delete('/furnitures/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const furniture = await Furniture.findByIdAndDelete(id);
    if (!furniture) {
      return res.status(404).send();
    }
    return res.send(furniture);
  } catch (e) {
    return res.status(500).send();
  }
});
