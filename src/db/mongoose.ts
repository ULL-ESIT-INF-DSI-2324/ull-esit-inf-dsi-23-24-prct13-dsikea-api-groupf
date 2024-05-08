import { connect } from 'mongoose';

try {
  await connect('mongodb+srv://dsikea:APIRestDSIkea@cluster0.mff29th.mongodb.net/');
  console.log('Connection to MongoDB server established');
} catch (error) {
  console.log(error);
}

