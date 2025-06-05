import morgan from 'morgan';

// Morgan supports different predefined logging formats:
// 'dev' – Concise colored output (default for development).
// 'combined' – Standard Apache-style logs.
// 'common' – Shorter Apache logs.
// 'short' – Minimal logs.
// 'tiny' – Super lightweight logs.

let logLevel = 'dev';
if (process.env.NODE_ENV === 'production') {
  logLevel = 'combined'; // Use detailed logging in production
} else {
  logLevel = 'dev'; // Use concise logs in development
}

const logger = morgan(logLevel);

export default logger;
