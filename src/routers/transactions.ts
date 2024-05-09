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
 *   summary: Get transactions
 */
transactionRouter.get('/transactions', async (req, res) => {
  const { nif, startDate, endDate, type } = req.query;
	const filter: any = {};

	if (nif) {
		const customer = await Customer.findOne({ nif });
		const provider = await Provider.findOne({ cif: nif });
		if (!customer && !provider) {
			return res.status(404).send('Entity not found');
		}
		filter.entity = customer ? customer._id : provider?. _id;
	}

	if (startDate && endDate) {
		const startDateString = startDate.toString();
		const endDateString = endDate.toString();
		filter.dateTime = { $gte: new Date(startDateString), $lte: new Date(endDateString) };
	}

	if (type) {
	  filter.type = type;
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
 * /transactions/customer/{nif}:
 *  get:
 *   summary: Get transactions by customer NIF
 */
transactionRouter.get('/transactions/customer/:nif', async (req, res) => {
  const nif = req.params.nif;
  
  try {
    const customer = await Customer.findOne({ nif });
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
