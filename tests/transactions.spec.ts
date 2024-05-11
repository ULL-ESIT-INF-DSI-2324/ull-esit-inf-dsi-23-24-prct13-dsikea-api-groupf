import request from 'supertest';
import { Transaction } from '../src/models/transaction.js';
import { Customer } from '../src/models/customer.js';
import { Provider } from '../src/models/provider.js';
import { Furniture } from '../src/models/furniture.js';
import { app } from '../src/index.js';
import 'mocha';
import { expect } from 'chai';
import exp from 'constants';

let transaction1, transaction2, transaction3, transaction4, transaction5;
let customer, provider;
let furniture1, furniture2, furniture3, furniture4;

beforeEach(async () => {
	await Transaction.deleteMany();

  customer = {
    name: 'Customer 1',
    nif: '12345678A',
    address: 'Calle Falsa 123',
    phone: '666 555 444'
  };

  provider = {
    name: 'Provider',
    cif: 'A12345678',
    address: 'Calle Falsa 123',
    phone: '626 525 424'
  };

  furniture1 = {
    type: 'Chair',
    name: 'Chair 1',
    description: 'A chair',
    color: 'White',
    dimensions: '50x50x50',
    price: 100,
    stock: 10
  };

  furniture2 = {
    type: 'Table',
    name: 'Table 1',
    description: 'A table',
    color: 'Brown',
    dimensions: '100x100x50',
    price: 200,
    stock: 5
  };

  furniture3 = {
    type: 'Sofa',
    name: 'Sofa 1',
    description: 'A sofa',
    color: 'Black',
    dimensions: '200x100x50',
    price: 400,
    stock: 3
  };

  furniture4 = {
    type: 'Bed',
    name: 'Bed 1',
    description: 'A bed',
    color: 'Blue',
    dimensions: '200x150x50',
    price: 500,
    stock: 2
  };

	transaction1 = {
		entity: { type: 'Customer', nif: '12345678A' },
		type: 'Sell Order',
		furniture: [
			{ name: 'Chair 1', quantity: 2 },
			{ name: 'Table 1', quantity: 1 }
		],
		observations: 'Customer wants to buy furniture for their living room.',
		totalAmount: 400
	};

	transaction2 = {
		entity: { type: 'Provider', cif: 'A12345678' },
		type: 'Purchase Order',
		furniture: [
			{ name: 'Sofa 1', quantity: 1 },
			{ name: 'Bed 1', quantity: 1 }
		],
		observations: 'Ordering new stock for the store.',
		totalAmount: 900
	};

  transaction3 = {
    entity: { type: 'Customer', nif: '12345678A' },
    type: 'Refund from client',
    furniture: [
      { name: 'Chair 1', quantity: 1 }
    ],
    observations: 'Customer wants to return a chair.',
    totalAmount: 100
  };

  transaction4 = {
    entity: { type: 'Provider', cif: 'A12345678' },
    type: 'Refund to provider',
    furniture: [
      { name: 'Sofa 1', quantity: 1 }
    ],
    observations: 'Returning a sofa to the provider.',
    totalAmount: 400
  };

  transaction5 = {
    entity: { type: 'Provider', cif: 'A12345678' },
    type: 'Purchase Order',
    furniture: [
      { name: 'New Chair', 
      body: {
        type: 'Chair',
        description: 'A new chair',
        color: 'Black',
        dimensions: '50x50x50',
        price: 100
      },
      quantity: 10 }
    ],
    totalAmount: 1000
  };
});

describe('Transactions', () => {
	// POST /transactions
	it('Should create a new Sell Order transaction', async () => {
    await new Customer(customer).save();
    await new Furniture(furniture1).save();
    await new Furniture(furniture2).save();

		const response1 = await request(app)
			.post('/transactions')
			.send(transaction1)
			.expect(201);

		expect(response1.body).to.deep.include({
			entity: transaction1.entity,
			type: transaction1.type,
			observations: transaction1.observations,
			totalAmount: transaction1.totalAmount
		});
    
    expect(response1.body.furniture).to.have.lengthOf(2);
    expect(response1.body.furniture[0].name).to.equal('Chair 1');
    expect(response1.body.furniture[1].name).to.equal('Table 1');

	});

  it ('Should create a new Purchase Order transaction' , async () => {
    await new Provider(provider).save();
    await new Furniture(furniture3).save();
    await new Furniture(furniture4).save();

    const response2 = await request(app)
      .post('/transactions')
      .send(transaction2)
      .expect(201);

    expect(response2.body).to.deep.include({
      entity: transaction2.entity,
      type: transaction2.type,
      observations: transaction2.observations,
      totalAmount: transaction2.totalAmount
    });

    expect(response2.body.furniture).to.have.lengthOf(2);
    expect(response2.body.furniture[0].name).to.equal('Sofa 1');
    expect(response2.body.furniture[1].name).to.equal('Bed 1');

  });

  it ('Should create a new Refund from client transaction' , async () => {
    await new Customer(customer).save();
    await new Furniture(furniture1).save();

    const response3 = await request(app)
      .post('/transactions')
      .send(transaction3)
      .expect(201);

    expect(response3.body).to.deep.include({
      entity: transaction3.entity,
      type: transaction3.type,
      observations: transaction3.observations,
      totalAmount: transaction3.totalAmount
    });

    expect(response3.body.furniture).to.have.lengthOf(1);
    expect(response3.body.furniture[0].name).to.equal('Chair 1');

  });

  it ('Should create a new Refund to provider transaction' , async () => {
    await new Provider(provider).save();
    await new Furniture(furniture3).save();

    const response4 = await request(app)
      .post('/transactions')
      .send(transaction4)
      .expect(201);

    expect(response4.body).to.deep.include({
      entity: transaction4.entity,
      type: transaction4.type,
      observations: transaction4.observations,
      totalAmount: transaction4.totalAmount
    });

    expect(response4.body.furniture).to.have.lengthOf(1);
    expect(response4.body.furniture[0].name).to.equal('Sofa 1');

  });

  it ('Should create a new Purchase Order transaction with new furniture' , async () => {
    await new Provider(provider).save();

    const response5 = await request(app)
      .post('/transactions')
      .send(transaction5)
      .expect(201);

    expect(response5.body).to.deep.include({
      entity: transaction5.entity,
      type: transaction5.type,
      totalAmount: transaction5.totalAmount
    });

    expect(response5.body.furniture).to.have.lengthOf(1);
    expect(response5.body.furniture[0].name).to.equal('New Chair');

    const newFurniture = await Furniture.findOne({ name: 'New Chair' });
    expect(newFurniture).to.not.be.null;

  });

	it('Should get an error by trying to post a transaction without required values', async () => {
		await request(app)
			.post('/transactions')
			.send({})
			.expect(400);

		await request(app)
			.post('/transactions')
			.send({ type: 'Sell Order' })
			.expect(400);
	});

	it('Should get an error by trying to post a transaction with an invalid entity type', async () => {
		await request(app)
			.post('/transactions')
			.send({ ...transaction1, entity: { type: 'InvalidType', id: '12345678A' } })
			.expect(400);
	});

	it('Should get an error by trying to post a transaction with CIF from a Customer', async () => {
		await request(app)
			.post('/transactions')
			.send({ ...transaction1, entity: { type: 'Customer', cif: '12345678A' } })
			.expect(400);
	});

  it('Should get an error by trying to post a transaction with NIF from a Provider', async () => {
    await request(app)
      .post('/transactions')
      .send({ ...transaction2, entity: { type: 'Provider', nif: 'A12345678' } })
      .expect(400);
  });

  it('Should get an error by trying to post a transaction with invalid furniture', async () => {
    await new Customer(customer).save();

    await request(app)
      .post('/transactions')
      .send({ ...transaction1, furniture: [{ name: 'InvalidFurniture', quantity: 1 }] })
      .expect(404);
  });

  it('Should get an error by trying to post a transaction with invalid furniture quantity', async () => {
    await new Customer(customer).save();
    await new Furniture(furniture1).save();

    await request(app)
      .post('/transactions')
      .send({ ...transaction1, furniture: [{ name: 'Chair 1', quantity: 0 }] })
      .expect(400);
  });

  it('Should get an error by trying to post a transaction with type Sell Order and being a Provider', async () => {
    await new Provider(provider).save();

    await request(app)
      .post('/transactions')
      .send({ ...transaction2, type: 'Sell Order' })
      .expect(400);
  });

  it('Should get an error by trying to post a transaction with type Purchase Order and being a Customer', async () => {
    await new Customer(customer).save();

    await request(app)
      .post('/transactions')
      .send({ ...transaction1, type: 'Purchase Order' })
      .expect(400);
  });

  it('Should get an error by trying to post a transaction with type Refund from client and being a Provider', async () => {
    await new Provider(provider).save();

    await request(app)
      .post('/transactions')
      .send({ ...transaction4, type: 'Refund from client' })
      .expect(400);
  });

  it('Should get an error by trying to post a transaction with type Refund to provider and being a Customer', async () => {
    await new Customer(customer).save();

    await request(app)
      .post('/transactions')
      .send({ ...transaction3, type: 'Refund to provider' })
      .expect(400);
  });

	// GET /transactions
	it('Should get all transactions', async () => {
		await new Transaction(transaction1).save();
		await new Transaction(transaction2).save();
    await new Transaction(transaction3).save();
    await new Transaction(transaction4).save();
    await new Transaction(transaction5).save();

		const response = await request(app)
			.get('/transactions')
			.expect(200);

		expect(response.body.length).to.equal(5);
	});

	it('Should get transactions by date range', async () => {
		await new Transaction(transaction1).save();
		await new Transaction(transaction2).save();

		const startDate = new Date('2024-01-01');
		const endDate = new Date('2030-12-31');

		const response = await request(app)
			.get('/transactions')
			.query({ startDate, endDate })
			.expect(200);

		expect(response.body.length).to.equal(2);
	});

	it('Should get transactions by type', async () => {
		await new Transaction(transaction1).save();
		await new Transaction(transaction2).save();

		const response = await request(app)
			.get('/transactions')
			.query({ type: 'Sell Order' })
			.expect(200);

		expect(response.body.length).to.equal(1);
		expect(response.body[0].type).to.equal('Sell Order');
	});

	it('Should get transactions by entity NIF', async () => {
		await new Transaction(transaction1).save();
		await new Transaction(transaction2).save();

		const response = await request(app)
			.get('/transactions')
			.query({ nif: '12345678A' })
			.expect(200);

		expect(response.body.length).to.equal(1);
		expect(response.body[0].entity.type).to.equal('Customer');
		expect(response.body[0].entity.nif).to.equal('12345678A');
	});

	it('Should get transactions by entity CIF', async () => {
		await new Transaction(transaction1).save();
		await new Transaction(transaction2).save();

		const response = await request(app)
			.get('/transactions')
			.query({ cif: 'A12345678' })
			.expect(200);

		expect(response.body.length).to.equal(1);
		expect(response.body[0].entity.type).to.equal('Provider');
		expect(response.body[0].entity.cif).to.equal('A12345678');
	});

  it('Should get transactions by date range, type and entity CIF', async () => {
    await new Transaction(transaction1).save();
    await new Transaction(transaction2).save();
    await new Transaction(transaction3).save();
    await new Transaction(transaction4).save();

    const startDate = new Date('2024-01-01');
    const endDate = new Date('2030-12-31');

    const response = await request(app)
      .get('/transactions')
      .query({ startDate, endDate, type: 'Sell Order', cif: 'A12345678' })
      .expect(200);

    expect(response.body.length).to.equal(0);
  });

  it('Should get an error by trying to get transactions with invalid date range', async () => {
    await request(app)
      .get('/transactions')
      .query({ startDate: 'InvalidDate', endDate: 'InvalidDate' })
      .expect(400);
  });

  // PATCH /transactions/:id

  it('Should update a transaction by ID', async () => {
    const TransactionTest = await new Transaction(transaction1).save();

    const response = request(app)
      .patch(`/transactions/${TransactionTest._id}`)
      .send({ observations: 'Updated observations' })
      .expect(200);
  });

  it('Should get an error by trying to update a transaction with invalid ID', async () => {
    await request(app)
      .patch('/transactions/invalidID')
      .send({ observations: 'Updated observations' })
      .expect(400);
  });

  it('Should get an error by trying to update a transaction with invalid updates', async () => {
    const TransactionTest = await new Transaction(transaction1).save();

    await request(app)
      .patch(`/transactions/${TransactionTest._id}`)
      .send({ type: 'Sell Order' })
      .expect(400);
  });

  // DELETE /transactions/:id

  it('Should delete a transaction by ID', async () => {
    const TransactionTest = await new Transaction(transaction1).save();

    await request(app)
      .delete(`/transactions/${TransactionTest._id}`)
      .expect(200);

    const transaction = await Transaction.findById(TransactionTest._id);
    expect(transaction).to.be.null;
  });

  it('Should get an error by trying to delete a transaction with invalid ID', async () => {
    await request(app)
      .delete('/transactions/invalidID')
      .expect(400);
  });

});
