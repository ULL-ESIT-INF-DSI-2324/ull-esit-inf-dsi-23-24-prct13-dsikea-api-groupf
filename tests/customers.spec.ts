import request from 'supertest';
import { Customer } from '../src/models/customer.js';
import { app } from '../src/index.js';
import 'mocha';
import { expect } from 'chai';
import { doesNotMatch } from 'assert';

const customer1 = {
	name: 'Prueba 1',
	nif: '12345678Z',
	address: 'Calle Falsa 123',
	email: 'prueba1@gmail.com',
	phone: '123456789'
}

const customer2 = {
	name: 'Prueba 2',
	nif: '87654321A',
	address: 'Calle Falsa 321',
	email: 'prueba2@gmail.com',
	phone: '987654321'
}

const customer_bad_name = {
	name: 'prueba 3',
	nif: '12345678Z',
	address: 'Calle Falsa 123',
	phone: '113456789'
}

const customer_bad_nif = {
	name: 'Prueba 4',
	nif: '12345678',
	address: 'Calle Falsa 123',
	phone: '111456789'
}

const customer_bad_email = {
	name: 'Prueba 5',
	nif: '12345678A',
	address: 'Calle Falsa 123',
	email: 'prueba5',
	phone: '111156789'
}

const customer_same_nif = {
	name: 'Prueba 6',
	nif: '12345678Z',
	address: 'Calle Falsa 123',
	phone: '111116789'
}

const customer_same_email = {
	name: 'Prueba 6',
	nif: '12345678B',
	address: 'Calle Falsa 123',
	email: 'prueba1@gmail.com',
	phone: '111111789'
}

const customer_same_phone = {
	name: 'Prueba 7',
	nif: '12345678C',
	address: 'Calle Falsa 123',
	phone: '123456789'
}

beforeEach(async () => {
	await Customer.deleteMany();
});

describe('Customers', () => {
	
	it('should create a new customer', async () => {
		await request(app).post('/customers').send(customer1).expect(201);

		await request(app).post('/customers').send(customer2).expect(201);
	});
	//it('Should get an error by trying to post an invalid format of name through validators', async () => {
	//	await request(app).post('/customers').send(customer_bad_name).expect(400);
	//});
	//it('Should get an error by trying to post an invalid format of nif through validators', async () => {
	//	await request(app).post('/customers').send(customer_bad_nif).expect(400);
	//});
	//it('Should get an error by trying to post an invalid format of email through validators', async () => {
	//	await request(app).post('/customers').send(customer_bad_email).expect(400);
	//});
	//it('Should get an error by trying to post a customer without requiered values', async () => {
	//	await request(app).post('/customers').send({}).expect(400);
	//});
	//it('Should get an error by trying to post a customer with an already existing nif', async () => {
	//	await new Customer(customer1).save();
	//	await request(app).post('/customers').send(customer_same_nif).expect(400);
	//});
	//it('Should get an error by trying to post a customer with an already existing email', async () => {
	//	await new Customer(customer1).save();
	//	await request(app).post('/customers').send(customer_same_email).expect(400);
	//});
	//it('Should get an error by trying to post a customer with an already existing phone', async () => {
	//	await new Customer(customer1).save();
	//	await request(app).post('/customers').send(customer_same_phone).expect(400);
	//});
//
	//it('should get all customers', async () => {
	//	await new Customer(customer1).save();
	//	await new Customer(customer2).save();
//
	//	await request(app).get('/customers').expect(200);
	//});
	//it('should get a customer by nif', async () => {
	//	await new Customer(customer1).save();
	//	await new Customer(customer2).save();
//
	//	await request(app).get('/customers?nif=12345678Z').expect(200);
	//	await request(app).get('/customers?nif=87654321A').expect(200);
	//});
	//it('should get a customer by nif', async () => {
	//	const newCustomer1 = await new Customer(customer1).save();
	//	const newCustomer2 = await new Customer(customer2).save();
//
	//	await request(app).get(`/customers?${newCustomer1.id}`).expect(200);
	//	await request(app).get(`/customers?${newCustomer2.id}`).expect(200);
	//});
//
	//it('should update a customer by nif', async () => {
	//	const newCustomer = await new Customer(customer1).save();
//
	//	await request(app).patch('/customers?nif=12345678Z').send({name: customer2.name, address: customer2.address, email: customer2.email, phone: customer2.phone}).expect(200);
	//});
	//it('should get an error trying to update a customer by nif when not found', async () => {
	//	await new Customer(customer1).save();
//
	//	await request(app).patch('/customers?nif=87654321A').send({name: customer2.name, address: customer2.address, email: customer2.email, phone: customer2.phone}).expect(404);
	//});
	//it('should get an error trying to update a customer by nif with an invalid value', async () => {
	//	await new Customer(customer1).save();
//
	//	await request(app).patch('/customers?nif=12345678').send({name: customer2.name, nif: customer2.nif, address: customer2.address, email: customer2.email, phone: customer2.phone}).expect(400);
	//});
	//it('Should get an error by trying to update a customer with an invalid format of name through validators', async () => {
	//	await new Customer(customer1).save();
	//	await request(app).patch('/customers?nif=12345678Z').send({ name: 'prueba 3' }).expect(400);
	//});
//
	//it('Should get an error by trying to update a customer with an invalid format of nif through validators', async () => {
	//	await new Customer(customer1).save();
	//	await request(app).patch('/customers?nif=12345678Z').send({ nif: '12345678' }).expect(400);
	//});
//
	//it('Should get an error by trying to update a customer with an invalid format of email through validators', async () => {
	//	await new Customer(customer1).save();
	//	await request(app).patch('/customers?nif=12345678Z').send({ email: 'prueba5' }).expect(400);
	//});
//
	//it('Should get an error by trying to update a customer without required values', async () => {
	//	await new Customer(customer1).save();
	//	await request(app).patch('/customers?nif=12345678Z').send({}).expect(400);
	//});

	//it('Should get an error by trying to update a customer with an already existing nif', async () => {
	//	await new Customer(customer1).save();
	//	await new Customer(customer2).save();
	//	await request(app).patch('/customers?nif=12345678Z').send({ nif: '87654321A' }).expect(400);
	//});
//
	//it('Should get an error by trying to update a customer with an already existing email', async () => {
	//	await new Customer(customer1).save();
	//	await new Customer(customer2).save();
	//	await request(app).patch('/customers?nif=12345678Z').send({ email: 'prueba2@gmail.com' }).expect(400);
	//});
//
	//it('Should get an error by trying to update a customer with an already existing phone', async () => {
	//	await new Customer(customer1).save();
	//	await new Customer(customer2).save();
	//	await request(app).patch('/customers?nif=12345678Z').send({ phone: '987654321' }).expect(400);
	//});
});