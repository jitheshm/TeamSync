import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';
import connect from './config/db/connect';
import { connectConsumers } from './events/consumerStart';
import socketHandler from './socketHandler/socketHandler';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3006;

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

connect().then(() => {
  connectConsumers();
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

socketHandler(io);
// Start the server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
