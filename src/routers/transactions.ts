import express from 'express';

import { Transaction } from '../models/transaction.js';
import { Customer } from '../models/customer.js';
import { Provider } from '../models/provider.js';
import { Furniture } from '../models/furniture.js';

export const transactionRouter = express.Router();

/**
 * @swagger
 * /transactions:
 *  post:
 *   summary: Create a new transaction
 */
transactionRouter.post('/transactions', async (req, res) => {
  const { entity, type, furniture, observations } = req.body;

  // Validate entity
  let entityModel;
  let filter = {};
  try {
    if (entity.type === 'Customer') {
      filter = { nif: entity.nif.toString() };
      entityModel = await Customer.find(filter);
    } else if (entity.type === 'Provider') {
      filter = { cif: entity.cif.toString() };
      entityModel = await Provider.find(filter);
    } else {
      return res.status(400).send('Invalid entity type');
    }
    if (!entityModel) {
      return res.status(404).send('Entity not found');
    }
  } catch (e) {
    return res.status(500).send(e);
  }

  // Validate furniture
  let totalAmount = 0;
  let newFurniture;
  for (const item of furniture) {
    filter = {name: item.name};
    const furnitureModel = await Furniture.findOne(filter);
    if (!furnitureModel && (type === 'Purchase Order' || type === 'Refund from client')) {
      newFurniture = new Furniture({
        name: item.name,
        description: item.description,
        color: item.color,
        price: item.price,
        stock: item.quantity
      });
      try {
        await newFurniture.save();
      } catch (e) {
        return res.status(400).send(e);
      }
    } else if (!furnitureModel) {
      return res.status(404).send('Furniture not found');
    }
    let furniture_model;
    furnitureModel ? furniture_model = furnitureModel : furniture_model = newFurniture;
    if (type === 'Purchase Order' || type === 'Refund from client') {
      if (furnitureModel) furnitureModel.stock += item.quantity;
    }
    if (type === 'Sale to client' || type === 'Refund to provider') {
      if (furniture_model.stock < item.quantity) {
        return res.status(400).send('Not enough stock');
      }
      furniture_model.stock -= item.quantity;
    }
    totalAmount += furniture_model.price * item.quantity;
    try {
      furnitureModel ? await furnitureModel.save() : await newFurniture.save();
    } catch (e) {
      return res
    }
  }

  // Create transaction
  const transaction = new Transaction({
    entity: entityModel,
    type,
    furniture,
    observations,
    totalAmount
  });

  try {
    await transaction.save();
    res.status(201).send(transaction);
  } catch (e) {
    res.status(400).send(e);
  }
	return res.status(200).send('Success');
});

/**
 * @swagger
 * /transactions:
 *  get:
 *   summary: Get all transactions or by iden_number or CIF
 */
transactionRouter.get('/transactions', async (req, res) => {
  const { iden_number } = req.query;
  let filter = {};

  if (iden_number) {
    const customer = await Customer.findOne({ nif: iden_number });
    const provider = await Provider.findOne({ cif: iden_number });
    if (!customer && !provider) {
      return res.status(404).send('Entity not found');
    }
    filter = { entity: customer ? customer._id : (provider ? provider._id : null) };
  }

  try {
    const transactions = await Transaction.find(filter);
    return res.send(transactions);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /transactions:
 *  get:
 *   summary: Get transactions by date range and type
 */
transactionRouter.get('/transactions', async (req, res) => {
  const { startDate, endDate, type } = req.query;
  let filter = {};

  /*if (iden_number) {
    const customer = await Customer.findOne({ iden_number });
    const provider = await Provider.findOne({ cif: iden_number });
    if (!customer && !provider) {
      return res.status(404).send('Entity not found');
    }
    filter = { entity: customer ? customer._id : (provider ? provider._id : null) };
  }*/

  if (startDate && endDate) {
    const startDateString = startDate.toString();
    const endDateString = endDate.toString();
    const time = { $gte: new Date(startDateString), $lte: new Date(endDateString) };
    filter = { dateTime: time };
  }

	if (type) {
	  filter = {type: type};
	}

  try {
    const transactions = await Transaction.find(filter);
    return res.send(transactions);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *  put:
 *   summary: Update a transaction by ID
 */
transactionRouter.put('/transactions/:id', async (req, res) => {
  const id = req.params.id;
  const { entity, type, furniture, observations } = req.body;

  // Validate entity
  let entityModel;
  try {
    if (entity.type === 'Customer') {
      entityModel = await Customer.findById(entity.id);
    } else if (entity.type === 'Provider') {
      entityModel = await Provider.findById(entity.id);
    } else {
      return res.status(400).send('Invalid entity type');
    }
    if (!entityModel) {
      return res.status(404).send('Entity not found');
    }
  } catch (e) {
    return res.status(500).send(e);
  }

  // Validate furniture
  let totalAmount = 0;
  for (const item of furniture) {
    const furnitureModel = await Furniture.findById(item.furnitureId);
    if (!furnitureModel) {
      return res.status(404).send('Furniture not found');
    }
    totalAmount += furnitureModel.price * item.quantity;
  }

  // Update transaction
  try {
    const transaction = await Transaction.findByIdAndUpdate(id, {
      entity: entityModel,
      type,
      furniture,
      observations,
      totalAmount
    }, { new: true });
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.send(transaction);
  } catch (e) {
    res.status(400).send(e);
  }
	return res.status(200).send('Success');
});

/**
 * @swagger
 * /transactions/{id}:
 *  delete:
 *   summary: Delete a transaction by ID
 */
transactionRouter.delete('/transactions/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.send(transaction);
  } catch (e) {
    res.status(500).send(e);
  }
	return res.status(200).send('Success');
});

/**
 * @swagger
 * /transactions/customer/{iden_number}:
 *  get:
 *   summary: Get transactions by customer iden_number
 */
transactionRouter.get('/transactions/customer/:iden_number', async (req, res) => {
  const iden_number = req.params.iden_number;
  
  try {
    const customer = await Customer.findOne({ iden_number });
    if (!customer) {
      return res.status(404).send('Customer not found');
    }

    const transactions = await Transaction.find({ entity: customer._id });
    return res.send(transactions);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /transactions/provider/{cif}:
 *  get:
 *   summary: Get transactions by provider CIF
 */
transactionRouter.get('/transactions/provider/:cif', async (req, res) => {
  const cif = req.params.cif;
  
  try {
    const provider = await Provider.findOne({ cif });
    if (!provider) {
      return res.status(404).send('Provider not found');
    }

    const transactions = await Transaction.find({ entity: provider._id });
    return res.send(transactions);
  } catch (e) {
    return res.status(500).send(e);
  }
});
