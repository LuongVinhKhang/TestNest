import { checkSchema } from 'express-validator';

export const cartSchemaValidation = checkSchema({
  items: {
    isArray: {
      errorMessage: 'Items must be an array',
    },
  },
  'items.*.productId': {
    isInt: {
      errorMessage: 'Product ID must be an integer',
    },
  },
  'items.*.quantity': {
    isInt: {
      options: { min: 1 },
      errorMessage: 'Quantity must be at least 1',
    },
  },
});
