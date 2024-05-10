import request from 'supertest';
import { Furniture } from '../src/models/furniture.js';
import { app } from '../src/index.js';
import 'mocha';
import { expect } from 'chai';

let furniture1, furniture2;

beforeEach(async () => {
	await Furniture.deleteMany();

	furniture1 = {
		name: 'Chair 1',
		type: 'Chair',
		description: 'Comfortable chair for the living room',
		color: 'Brown',
		dimensions: '100x80x60',
		price: 100,
		stock: 10
	};

	furniture2 = {
		name: 'Table 1',
		type: 'Table',
		description: 'Wooden table for dining room',
		color: 'Black',
		dimensions: '200x100x80',
		price: 200,
		stock: 5
	};
});

describe('Furniture', () => {
	// POST /furnitures
	it('Should create a new furniture', async () => {
		const response1 = await request(app)
			.post('/furnitures')
			.send(furniture1)
			.expect(201);

		expect(response1.body).to.include({
			name: furniture1.name,
			type: furniture1.type,
			description: furniture1.description,
			color: furniture1.color,
			dimensions: furniture1.dimensions,
			price: furniture1.price,
			stock: furniture1.stock
		});

		const response2 = await request(app)
			.post('/furnitures')
			.send(furniture2)
			.expect(201);

		expect(response2.body).to.include({
			name: furniture2.name,
			type: furniture2.type,
			description: furniture2.description,
			color: furniture2.color,
			dimensions: furniture2.dimensions,
			price: furniture2.price,
			stock: furniture2.stock
		});
	});

	it('Should get an error by trying to post a furniture without required values', async () => {
		await request(app)
			.post('/furnitures')
			.send({})
			.expect(400);

		await request(app)
			.post('/furnitures')
			.send({ name: 'Furniture Test' })
			.expect(400);
	});

	it('Should get an error by trying to post a furniture with an invalid format of name through validators', async () => {
		await request(app)
			.post('/furnitures')
			.send({ ...furniture1, name: 'chair' })
			.expect(400);
	});

	it('Should get an error by trying to post a furniture with an invalid format of type through validators', async () => {
		await request(app)
			.post('/furnitures')
			// enum: ['Sofa', 'Table', 'Chair', 'Bed', 'Wardrobe', 'Desk', 'Shelf', 'Dresser', 'Cupboard', 'Stool', 'Couches', 'Sideboard']
			.send({ ...furniture1, type: 'Cabinet' })
			.expect(400);
	});

	// GET /furnitures
	it('Should get all furnitures', async () => {
		await new Furniture(furniture1).save();
		await new Furniture(furniture2).save();

		const response = await request(app)
			.get('/furnitures')
			.expect(200);

		expect(response.body.length).to.equal(2);
	});

	it('Should get a furniture by name', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.get('/furnitures')
			.query({ name: 'Chair 1' })
			.expect(200);
	});

	it('Should get an error by trying to get a furniture by name when not found', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.get('/furnitures')
			.query({ name: 'Invalid Name' })
			.expect(404);
	});

	// GET /furnitures/:id
	it('Should get a furniture by ID', async () => {
		const furniture = await new Furniture(furniture1).save();

		await request(app)
			.get(`/furnitures/${furniture._id}`)
			.expect(200);	
	});

	it('Should get an error by trying to get a furniture by ID when not found', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.get('/furnitures/000000000000000000000000')
			.expect(404);
	});

	it('Should get an error by trying to get a furniture by ID with an invalid value', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.get('/furnitures/invalid_id')
			.expect(400);
	});

	// PATCH /furnitures
	it('Should update a furniture by name', async () => {
		await new Furniture(furniture1).save();

		const response = await request(app)
			.patch('/furnitures')
			.query({ name: 'Chair 1' })
			.send({ description: 'Updated description' })
			.expect(200);

		expect(response.body).to.include({
			name: 'Chair 1',
			type: furniture1.type,
			description: 'Updated description',
			color: furniture1.color,
			dimensions: furniture1.dimensions,
			price: furniture1.price,
			stock: furniture1.stock
		});
	});

	it('Should update a furniture by name with multiple filters', async () => {
		await new Furniture(furniture1).save();

		const response = await request(app)
			.patch('/furnitures')
			.query({ name: 'Chair 1', color: 'Brown', description: 'Comfortable chair for the living room'})
			.send({ price: 99 })
			.expect(200);

		expect(response.body).to.include({
			name: 'Chair 1',
			type: furniture1.type,
			description: 'Comfortable chair for the living room',
			color: 'Brown',
			dimensions: furniture1.dimensions,
			price: 99,
			stock: furniture1.stock
		});
	});

	it('Should get an error by trying to update a furniture by name without filters', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.patch('/furnitures')
			.send({ description: 'Updated description' })
			.expect(400);
	});

	it('Should get an error by trying to update a furniture by name when not found', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.patch('/furnitures')
			.query({ name: 'Invalid Name' })
			.send({ description: 'Updated description' })
			.expect(404);
	});

	it('Should get an error by trying to update a furniture by color when not found', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.patch('/furnitures')
			.query({ color: 'Invalid Color' })
			.send({ description: 'Updated description' })
			.expect(404);
	});

	it('Should get an error by trying to update a furniture by description when not found', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.patch('/furnitures')
			.query({ description: 'Invalid Description' })
			.send({ description: 'Updated description' })
			.expect(404);
	});

	it('Should get an error by trying to update a furniture with an invalid value', async () => {
		await new Furniture(furniture1).save();

		await request(app)
			.patch('/furnitures')
			.query({ name: 'Chair 1' })
			.send({ price: 'Invalid Price' })
			.expect(400);

		// Cannot change name
		await request(app)
			.patch('/furnitures')
			.query({ name: 'Chair 1' })
			.send({ name: 'Chair 0' })
			.expect(400);
	});

	// PATCH /furnitures/:id
	it('Should update a furniture by ID', async () => {
		const newFurniture = await new Furniture(furniture1).save();

		const response = await request(app)
			.patch(`/furnitures/${newFurniture.id}`)
			.send({ description: 'Updated description' })
			.expect(200);

		expect(response.body).to.include({
			name: 'Chair 1',
			type: furniture1.type,
			description: 'Updated description',
			color: furniture1.color,
			dimensions: furniture1.dimensions,
			price: furniture1.price,
			stock: furniture1.stock
		});
	});

	it('Should get an error by trying to update a furniture by ID when not found', async () => {
		const newFurniture = await new Furniture(furniture1).save();

		await request(app)
			.patch('/furnitures/000000000000000000000000')
			.send({ description: 'Updated description' })
			.expect(404);
	});

	it('Should get an error by trying to update a furniture by ID with an invalid value', async () => {
		const newFurniture = await new Furniture(furniture1).save();

		await request(app)
			.patch(`/furnitures/${newFurniture.id}`)
			.send({ price: 'Invalid Price' })
			.expect(400);

		// Cannot change name
		await request(app)
			.patch(`/furnitures/${newFurniture.id}`)
			.query({ name: 'Chair 1' })
			.send({ name: 'Chair 0' })
			.expect(400);
	});

	// DELETE /furnitures
	it('Should delete a furniture by name', async () => {
		await new Furniture(furniture1).save();
		await new Furniture(furniture2).save();

		await request(app)
			.delete('/furnitures')
			.query({ name: 'Chair 1' })
			.expect(200);

		const furnitures = await Furniture.find();
		expect(furnitures.length).to.equal(1);
	});

	it('Should get an error by trying to delete a furniture by name when not found', async () => {
		await new Furniture(furniture1).save();
		await new Furniture(furniture2).save();

		await request(app)
			.delete('/furnitures')
			.query({ name: 'Invalid Name' })
			.expect(404);
	});

	// DELETE /furnitures/:id
	it('Should delete a furniture by ID', async () => {
		const newFurniture = await new Furniture(furniture1).save();

		await request(app)
			.delete(`/furnitures/${newFurniture.id}`)
			.expect(200);

		const furniture = await Furniture.findById(newFurniture.id);
		expect(furniture).to.be.null;
	});

	it('Should get an error by trying to delete a furniture by ID when not found', async () => {
		const newFurniture = await new Furniture(furniture1).save();

		await request(app)
			.delete('/furnitures/000000000000000000000000')
			.expect(404);

		// Last test delete
		await request(app)
			.delete(`/furnitures/${newFurniture.id}`)
			.expect(200);
	});
});
