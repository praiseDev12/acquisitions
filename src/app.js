import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';

const app = express();
app.use(helmet());

app.get('/', (req, res) => {
  logger.info('Hello from Acquisitions!');
  res.status(200).send('Hello from Acquisitions API!');
});

export default app;
