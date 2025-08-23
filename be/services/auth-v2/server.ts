import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';

export function startServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use('/auth', authRoutes);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Auth service listening on port ${port}`);
  });
}
