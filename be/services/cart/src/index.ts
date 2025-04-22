import express from 'express';

const app = express();

app.get('/cart/health', (_req, res) => {
  res.send('Cart service is healthy!');
});

app.listen(3001, () => {
  console.log('Cart service running on port 3001');
});
