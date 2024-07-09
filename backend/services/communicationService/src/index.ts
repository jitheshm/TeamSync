
import express, { Application } from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors'
import connect from './config/db/connect';
import { connectConsumers } from './events/consumerStart';

// import router from './routes/router';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3006;
app.use(logger('dev'));
app.use(express.json());
app.use(cors())
connect().then(() => {
  connectConsumers()
}) 
app.use(()=>{
    console.log('Middleware')
})

// app.use('/', router)  





app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});