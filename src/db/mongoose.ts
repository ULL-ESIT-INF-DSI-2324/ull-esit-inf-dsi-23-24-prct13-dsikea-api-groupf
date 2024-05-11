import { connect } from 'mongoose';

try {
  //await connect('mongodb+srv://dsikea:APIRestDSIkea@cluster0.mff29th.mongodb.net/');
  await connect(process.env.MONGODB_URL!);
  console.log('Connection to MongoDB server established');
} catch (error) {
  console.log(error);
}