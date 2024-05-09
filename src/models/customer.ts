import { Document, model, Schema } from "mongoose";
import validator from 'validator';

export interface CustomerInterface extends Document {
  name: string;
  nif: string;
  address: string;
  email?: string;
  phone: string;
}

const customerSchema = new Schema<CustomerInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Name must start with a capital letter');
      } else if (!validator.isAlpha(value)) {
        throw new Error('Name must contain only letters');
      }
    },
  },
  nif: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!validator.isLength(value, { min: 9, max: 9 })) {
        throw new Error('NIF must have 9 characters');
      } else if (!validator.isAlphanumeric(value)) {
        throw new Error('NIF must contain only letters and numbers');
      } else if (!value.match(/[0-9]+[A-Z]$/)) {
        throw new Error('NIF must end with a capital letter and the rest must be numbers');
      }
      /// isTaxID(value, 'ES') // https://www.npmjs.com/package/tax-id
    }
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    validate: (value: string) => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (validator.isMobilePhone(value, 'es-ES')) {
        throw new Error('Invalid phone number');
      }
    }
  }
});

export const Customer = model<CustomerInterface>('Customer', customerSchema);