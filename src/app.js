import express from 'express';
import './database/mongoose.js';
import sessions from './middleware/sessions.js';

const app = express();

// Middleware to Handle JSON Parsing
app.use(express.json())

// Middleware to Initialize and Handle Sessions
app.use(sessions);

export default app;
