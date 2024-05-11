import express from 'express';

import { Transaction } from '../models/transaction.js';
import { Customer } from '../models/customer.js';
import { Provider } from '../models/provider.js';
import { Furniture } from '../models/furniture.js';

export const transactionRouter = express.Router();


/**
 * Create a new transaction.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The created transaction or an error response.
 */
transactionRouter.post('/transactions', async (req, res) => {
  let { entity, type, furniture, observations } = req.body;

  // Validate entity
  let entityModel;
  let filter = {};
  try {
    if (entity.type === 'Customer') {
      filter = { nif: entity.nif.toString() };
      entityModel = await Customer.findOne(filter);
    } else if (entity.type === 'Provider') {
      filter = { cif: entity.cif.toString() };
      entityModel = await Provider.findOne(filter);
    } else {
      return res.status(400).send('Invalid entity type');
    }
    if (!entityModel) {
      return res.status(404).send('Entity not found');
    }
    if (entity.type === 'Customer' && (type === 'Refund to provider' || type === 'Purchase Order')) {
      return res.status(400).send('Invalid transaction type for Customers');
    } else if (entity.type === 'Provider' && (type === 'Refund from client' || type === 'Sell Order')) {
      return res.status(400).send('Invalid transaction type for Providers');
    }
  } catch (e) {
    return res.status(400).send(e);
  }

  // Validate furniture
  let totalAmount = 0;
  let newFurniture;
  for (const item of furniture) {
    const furnitureFilter = { name: item.name };
    try {
      const furnitureModel = await Furniture.findOne(furnitureFilter);
      ///if (type === 'Refund from client' || type === 'Refund to provider') isValidRefund(type, furnitureModel, item.quantity, entityModel);
      if (!furnitureModel && (type === 'Purchase Order' || type === 'Refund from client')) {
        newFurniture = new Furniture({
          type: item.body.type,
          name: item.name,
          description: item.body.description,
          color: item.body.color,
          dimensions: item.body.dimensions,
          price: item.body.price,
          stock: item.quantity
        });
        totalAmount += newFurniture.price * item.quantity;
        await newFurniture.save();
      } else if (!furnitureModel) {
        return res.status(404).send('Furniture not found');
      } else {
        if (type === 'Purchase Order' || type === 'Refund from client') {
          furnitureModel.stock += item.quantity;
        } else {
          if (furnitureModel.stock < item.quantity) {
            return res.status(400).send('Not enough stock');
          }
          furnitureModel.stock -= item.quantity;
        }
        totalAmount += furnitureModel.price * item.quantity;
        await furnitureModel.save();
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  }

  // Create transaction
  const transaction = new Transaction({
    entity,
    type,
    furniture,
    observations,
    totalAmount
  });

  try {
    await transaction.save();
    return res.status(201).send(transaction);
  } catch (e) {
    return res.status(400).send(e);
  }
});


/**
 * Get transactions by date range, type, CIF/NIF or all of them.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The transactions that match the specified filters or an error response.
 */
transactionRouter.get('/transactions', async (req, res) => {
  //const { startDate, endDate, type } = req.query;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const type = req.query.type;

  let filter_time = {};
  let filter_type = {};

  if (startDate && endDate) {
    const startDateString = startDate.toString();
    const endDateString = endDate.toString();
    const time = { 
      $gte: new Date(startDateString), 
      $lte: new Date(endDateString)
    };
    filter_time = { dateTime: time };
  }

	if (type) {
	  filter_type = { type: type };
	}

  const filter_iden = req.query.nif ? { entity: {type: 'Customer', nif: req.query.nif.toString()} } : 
                                      (req.query.cif ? { entity: {type: 'Provider', cif: req.query.cif.toString()} } : {});

  const filter = { ...filter_time, ...filter_type, ...filter_iden };

  try {
    const transactions = await Transaction.find(filter);
    return res.status(200).send(transactions);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Get a transaction by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The transaction with the specified ID or an error response.
 */
transactionRouter.get('/transactions/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    return res.status(200).send(transaction);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Update a transaction by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The updated transaction or an error response.
 */
transactionRouter.patch('/transactions/:id', async (req, res) => {
  const id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ['furniture', 'observations'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send('Invalid updates');
  }

  let transaction;

  try {
    transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
  } catch (e) {
    return res.status(400).send(e);
  }
  
  // Validate furniture
  if (req.body.furniture.length > 0) transaction.totalAmount = 0;
  for (const item of req.body.furniture) {
    const furnitureFilter = { name: item.name };
    try {
      const furnitureModel = await Furniture.findOne(furnitureFilter);
      if (!furnitureModel) {
        return res.status(404).send('Furniture not found');
      } else {
        if (transaction.type === 'Purchase Order' || transaction.type === 'Refund from client') {
          furnitureModel.stock += item.quantity;
        } else {
          if (furnitureModel.stock < item.quantity) {
            return res.status(400).send('Not enough stock');
          }
          furnitureModel.stock -= item.quantity;
        }
        transaction.totalAmount += furnitureModel.price * item.quantity;
        await furnitureModel.save();
        await transaction.save();
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).send(transaction);
  } catch (e) {
    return res.status(400).send(e); 
  }
});

/**
 * Delete a transaction by ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The deleted transaction or an error response.
 */
transactionRouter.delete('/transactions/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    return res.status(200).send(transaction);
  } catch (e) {
    return res.status(400).send(e);
  }
});
