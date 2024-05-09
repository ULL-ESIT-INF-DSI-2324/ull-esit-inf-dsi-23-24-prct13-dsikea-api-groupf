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
 * /furnitures:
 *  get:
 *   summary: Get furniture by name, description, color or all of them
 */
furnitureRouter.get('/furnitures', async (req, res) => {

  const filter_name = req.query.name? { name: req.query.name.toString() } : {};
  const filter_desc = req.query.description? { description: req.query.description.toString() } : {};
  const filter_color = req.query.color? { color: req.query.color.toString() } : {};
  const filter = { ...filter_name, ...filter_desc, ...filter_color };

  try {
    const furniture = await Furniture.find(filter);
    if (!furniture) {
      return res.status(404).send();
    }
    return res.status(201).send(furniture);
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
    return res.status(201).send(furniture);
  } catch (e) {
    return res.status(500).send();
  }
});

/**
 * @swagger
 * /furnitures:
 *  patch:
 *   summary: Update a furniture by name, description, color or all of them
 */
furnitureRouter.patch('/furnitures', async (req, res) => {
  if(!req.query.name && !req.query.description && !req.query.color) {
    return res.status(400).send('Cannot update without a name, description or color.')
  }

  const filter_name = req.query.name? { name: req.query.name.toString() } : {};
  const filter_desc = req.query.description? { description: req.query.description.toString() } : {};
  const filter_color = req.query.color? { color: req.query.color.toString() } : {};
  const filter = { ...filter_name, ...filter_desc, ...filter_color };

  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'dimensions', 'price', 'stock'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const furniture = await Furniture.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!furniture) {
      return res.status(404).send();
    }
    return res.status(201).send(furniture);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @swagger
 * /furnitures/{id}:
 *  patch:
 *   summary: Update a furniture by ID
 */
furnitureRouter.patch('/furnitures/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const furniture = await Furniture.findByIdAndUpdate(id, req.body, { new: true });
    if (!furniture) {
      return res.status(404).send();
    }
    return res.status(201).send(furniture);
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
    return res.status(201).send(furniture);
  } catch (e) {
    return res.status(500).send();
  }
});


