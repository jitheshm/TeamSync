import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors'
import connect from './config/db/connect';
import { connectConsumers } from './events/kafka/consumerStart';
import router from './routes/router';
import errorHandler from './middlewares/errorHandler';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3002;
app.use(logger('dev'));
app.use(express.json());
app.use(cors())
connect().then(() => {
  connectConsumers()
})

app.use('/', router)

app.use(errorHandler);



app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});