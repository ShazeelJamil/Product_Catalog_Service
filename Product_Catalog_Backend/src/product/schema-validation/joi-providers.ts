import * as joi from 'joi';
import { AddProductSchema } from './add-product.schema';

export const JoiSchemaProvider = {
  provide: 'AddProductSchema',
  useValue: AddProductSchema,
};
