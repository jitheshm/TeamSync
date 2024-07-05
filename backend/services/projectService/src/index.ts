
import express, { Application } from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors'
import router from './routes/router';
import connect from './config/db/connect';
import { connectConsumers } from './events/kafka/consumerStart';
//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3005;
app.use(logger('dev'));
app.use(express.json());
app.use(cors())
connect().then(() => {
  connectConsumers()

}) //connect to db

app.use('/', router)



app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});