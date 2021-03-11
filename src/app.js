import express from 'express';

const app = express();

// Middleware to Handle JSON Parsing
app.use(express.json())


export default app;
