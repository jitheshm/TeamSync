import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors'
import { connectConsumers } from './events/kafka/consumerStart';
import connect from './config/db/connect';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;
app.use(logger('dev'));
app.use(express.json());
app.use(cors())
connect().then(() => {
  connectConsumers()

})







app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});