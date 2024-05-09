import { Document, model, Schema } from "mongoose";
import validator from 'validator';

export interface ProviderInterface extends Document {
  name: string;
  cif: string;
  address: string;
  email?: string;
  phone: string;
}

const providerSchema = new Schema<ProviderInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Name must start with a capital letter');
      }
    },
  },
  cif: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!validator.isLength(value, { min: 9, max: 9 })) {
        throw new Error('CIF must have 9 characters');
      } else if (!validator.isAlphanumeric(value)) {
        throw new Error('CIF must contain only letters and numbers');
      } else if (!value.match(/^[A-Z][0-9]+/)) {
        throw new Error('CIF must start with a capital letter and the rest must be numbers');
      }
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

export const Provider = model<ProviderInterface>('Provider', providerSchema);