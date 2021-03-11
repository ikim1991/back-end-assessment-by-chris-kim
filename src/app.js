import express from 'express';
import './database/mongoose.js';
import errorHandler from './middleware/errorHandler.js';
import sessions from './middleware/sessions.js';

const app = express();

// Middleware to Handle JSON Parsing
app.use(express.json())

// Middleware to Initialize and Handle Sessions
app.use(sessions);

// Middleware for Error Handling
app.use(errorHandler)

export default app;
