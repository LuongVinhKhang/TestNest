import cors from 'cors';
import { type CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN,
};

export { cors, corsOptions };
