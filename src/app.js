import express from 'express';
import './database/mongoose.js';
import redisClient from './database/redis.js';

const app = express();

// Middleware to Handle JSON Parsing
app.use(express.json())

export default app;
