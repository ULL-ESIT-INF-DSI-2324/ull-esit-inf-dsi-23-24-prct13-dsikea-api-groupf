import request from 'supertest';
import { Provider } from '../src/models/provider.js';
import { app } from '../src/index.js';
import 'mocha';
import { expect } from 'chai';

let provider1, provider2, provider_bad_name, provider_bad_cif, provider_bad_email, provider_same_cif, provider_same_email, provider_same_phone;

beforeEach(async () => {
	await Provider.deleteMany();

	provider1 = {
		name: 'Provider 1',
		cif: 'A12345678',
		address: 'C/ Example 1',
		email: 'provider1@gmail.com',
		phone: '123456789'
	};

	provider2 = {
		name: 'Provider 2',
		cif: 'B87654321',
		address: 'C/ Example 2',
		email: 'provider2@gmail.com',
		phone: '987654321'
	};

	provider_bad_name = {
		name: 'provider',
		cif: 'C12345678',
		address: 'C/ Example 3',
		phone: '113456789'
	};

	provider_bad_cif = {
		name: 'Provider 3',
		cif: '12345678',
		address: 'C/ Example 4',
		phone: '111456789'
	};

	provider_bad_email = {
		name: 'Provider 4',
		cif: 'D12345678',
		address: 'C/ Example 5',
		email: 'provider4',
		phone: '111156789'
	};

	provider_same_cif = {
		name: 'Provider 5',
		cif: 'A12345678',
		address: 'C/ Example 6',
		phone: '111116789'
	};

	provider_same_email = {
		name: 'Provider 6',
		cif: 'E12345678',
		address: 'C/ Example 7',
		email: 'provider1@gmail.com',
		phone: '111111789'
	};

	provider_same_phone = {
		name: 'Provider 7',
		cif: 'F12345678',
		address: 'C/ Example 8',
		phone: '123456789'
	};
});

describe('Providers', () => {
	// POST /providers
	it('Should create a new Provider', async () => {
		const response1 = await request(app)
			.post('/providers')
			.send(provider1)
			.expect(201);

		expect(response1.body).to.include({
			name: provider1.name,
			cif: provider1.cif,
			address: provider1.address,
			email: provider1.email,
			phone: provider1.phone
		});

		const response2 = await request(app)
			.post('/providers')
			.send(provider2)
			.expect(201);

		expect(response2.body).to.include({
			name: provider2.name,
			cif: provider2.cif,
			address: provider2.address,
			email: provider2.email,
			phone: provider2.phone
		});
	});

	it('Should get an error by trying to post an invalid format of name through validators', async () => {
		await request(app)
			.post('/providers')
			.send(provider_bad_name)
			.expect(400);
	});

	it('Should get an error by trying to post an invalid format of CIF through validators', async () => {
		await request(app)
			.post('/providers')
			.send(provider_bad_cif)
			.expect(400);
	});

	it('Should get an error by trying to post an invalid format of email through validators', async () => {
		await request(app)
			.post('/providers')
			.send(provider_bad_email)
			.expect(400);
	});

	it('Should get an error by trying to post a provider without required values', async () => {
		await request(app)
			.post('/providers')
			.send({})
			.expect(400);
		await request(app)
			.post('/providers')
			.send({ name: 'Provider Test' })
			.expect(400);
	});

	it('Should get an error by trying to post a provider with an already existing CIF', async () => {
		await new Provider(provider1).save();
		await request(app)
			.post('/providers')
			.send(provider_same_cif)
			.expect(400);
	});

	it('Should get an error by trying to post a provider with an already existing email', async () => {
		await new Provider(provider1).save();
		await request(app)
			.post('/providers')
			.send(provider_same_email)
			.expect(400);
	});

	it('Should get an error by trying to post a provider with an already existing phone', async () => {
		await new Provider(provider1).save();
		await request(app)
			.post('/providers')
			.send(provider_same_phone)
			.expect(400);
	});

	// GET /providers
	it('Should get all providers', async () => {
		await new Provider(provider1).save();
		await new Provider(provider2).save();

		const response = await request(app)
			.get('/providers')
			.expect(200);

		expect(response.body.length).to.equal(2);
	});

	it('Should get a provider by CIF', async () => {
		await new Provider(provider1).save();

		await request(app)
			.get('/providers?cif=A12345678')
			.expect(200);
	});

	it('Should get an error by trying to get a provider by CIF when not found', async () => {
		await new Provider(provider1).save();

		await request(app)
			.get('/providers')
			.query({ cif: 'Z12345678' })
			.expect(404);
	});

	// GET /providers/:id
	it('Should get a provider by ID', async () => {
		const provider = await new Provider(provider1).save();

		await request(app)
			.get(`/providers/${provider._id}`)
			.expect(200);	
	});

	it('Should get an error by trying to get a provider by ID when not found', async () => {
		await new Provider(provider1).save();

		await request(app)
			.get('/providers/000000000000000000000000')
			.expect(404);
	});

	it('Should get an error trying to get a provider by ID with an invalid value', async () => {
		await new Provider(provider1).save();
		await new Provider(provider2).save();

		await request(app)
			.get('/providers/12345678')
			.expect(400);
	});

	// PATCH /providers
	it('Should update a provider by CIF', async () => {
		await new Provider(provider1).save();

		const response = await request(app)
			.patch('/providers?cif=A12345678')
			.send({ name: 'Provider 1 Updated' })
			.expect(200);

		expect(response.body).to.include({
			name: 'Provider 1 Updated',
			cif: provider1.cif,
			address: provider1.address,
			email: provider1.email,
			phone: provider1.phone
		});
	});

	it('Should get an error by trying to update a provider by CIF when not found', async () => {
		await new Provider(provider1).save();

		await request(app)
			.patch('/providers?cif=Z12345678')
			.send({ name: 'Provider 1 Updated' })
			.expect(404);
	});

	it('Should get an error by trying to update a provider by CIF with an invalid value', async () => {
		await new Provider(provider1).save();

		await request(app)
			.patch('/providers?cif=A12345678')
			.send({ cif: provider2.cif })
			.expect(400);
	});

	it('Should get an error by trying to update a provider by CIF with an invalid format of name through validators', async () => {
		await new Provider(provider1).save();

		await request(app)
			.patch('/providers?cif=A12345678')
			.send({ name: 'provider' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider by CIF with an invalid format of email through validators', async () => {
		await new Provider(provider1).save();

		await request(app)
			.patch('/providers?cif=A12345678')
			.send({ email: 'provider' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an already existing CIF', async () => {
			await new Provider(provider1).save();
			await new Provider(provider2).save();
			await request(app)
				.patch('/providers?cif=A12345678')
				.send({ cif: 'B87654321' })
				.expect(400);
	});

	it('Should get an error by trying to update a provider with an already existing email', async () => {
		await new Provider(provider1).save();
		await new Provider(provider2).save();
		await request(app)
			.patch('/providers?cif=A12345678')
			.send({ email: 'provider2@gmail.com' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an already existing phone', async () => {
		await new Provider(provider1).save();
		await new Provider(provider2).save();
		await request(app)
			.patch('/providers?cif=A12345678')
			.send({ phone: '987654321' })
			.expect(400);
	});

	// PATCH /providers/:id
	it('Should update a provider by ID', async () => {
		const newProvider = await new Provider(provider1).save();

		const response = await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({name: provider2.name, address: provider2.address, email: provider2.email, phone: provider2.phone})
			.expect(200);

		expect(response.body).to.include({
			name: provider2.name,
			cif: provider1.cif,
			address: provider2.address,
			email: provider2.email,
			phone: provider2.phone
		});
	});

	it('Should get an error trying to update a provider by ID when not found', async () => {
		const newProvider = await new Provider(provider1).save();

		await request(app)
			.patch('/providers/000000000000000000000000')
			.send({name: provider2.name, address: provider2.address, email: provider2.email, phone: provider2.phone})
			.expect(404);
	});

	it('Should get an error trying to update a provider by ID with an invalid value', async () => {
		const newProvider = await new Provider(provider1).save();

		await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({ cif: provider2.cif })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an invalid format of name through validators', async () => {
		const newProvider = await new Provider(provider1).save();
		await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({ name: 'prueba 3' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an invalid format of CIF through validators', async () => {
		const newProvider = await new Provider(provider1).save();
		await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({ cif: '12345678' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an invalid format of email through validators', async () => {
		const newProvider = await new Provider(provider1).save();
		await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({ email: 'prueba5' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an already existing CIF', async () => {
		const newProvider = await new Provider(provider1).save();
		await new Provider(provider2).save();
		await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({ cif: '87654321A' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an already existing email', async () => {
		const newProvider = await new Provider(provider1).save();
		await new Provider(provider2).save();
		await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({ email: 'provider2@gmail.com' })
			.expect(400);
	});

	it('Should get an error by trying to update a provider with an already existing phone', async () => {
		const newProvider = await new Provider(provider1).save();
		await new Provider(provider2).save();
		await request(app)
			.patch(`/providers/${newProvider.id}`)
			.send({ phone: '987654321' })
			.expect(400);
	});

	// DELETE /providers
	it('Should delete the first provider according to the filter (CIF)', async () => {
		await new Provider(provider1).save();
		await new Provider(provider2).save();

		await request(app)
			.delete('/providers')
			.expect(200);

		const providers = await Provider.find();
		expect(providers).to.be.lengthOf(1);
	});

	it('Should delete a provider by CIF', async () => {
		await new Provider(provider1).save();

		await request(app)
			.delete(`/providers?cif=A12345678`)
			.expect(200);

		const provider = await Provider.findOne({ cif: 'A12345678' });
		expect(provider).to.be.null;
	});

	it('Should get an error trying to delete a provider by CIF when not found', async () => {
		await new Provider(provider1).save();

		await request(app)
			.delete('/providers?cif=Z12345678')
			.expect(404);
	});

	// DELETE /provider/:id
	it('Should delete a provider by ID', async () => {
		const newProvider = await new Provider(provider1).save();

		await request(app)
			.delete(`/providers/${newProvider.id}`)
			.expect(200);

		const provider = await Provider.findById(newProvider.id);
		expect(provider).to.be.null;
	});

	it('Should get an error trying to delete a provider by ID when not found', async () => {
		const newProvider = await new Provider(provider1).save();

		await request(app)
			.delete('/providers/000000000000000000000000')
			.expect(404);
	});

	it('Should get an error trying to delete a provider by ID with an invalid value', async () => {
		const newProvider = await new Provider(provider1).save();

		await request(app)
			.delete(`/providers/12345678`)
			.expect(400);

		// Last test delete
		await request(app)
			.delete(`/providers/${newProvider.id}`)
			.expect(200);
	});
});