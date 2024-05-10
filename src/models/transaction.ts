import { Document, model, Schema} from "mongoose";

import { FurnitureInterface } from "./furniture.js";
import { ProviderInterface } from "./provider.js";
import { CustomerInterface } from "./customer.js";

interface TransactionInterface extends Document {
  entity: { type: ProviderInterface | CustomerInterface, nif?: CustomerInterface, cif?: ProviderInterface};
  type: 'Purchase Order' | 'Sell Order' | 'Refund from client' | 'Refund to provider'; // Tipo de transacción
  furniture: { name: FurnitureInterface, body?: {type: FurnitureInterface, description: FurnitureInterface, color: FurnitureInterface, dimensions: FurnitureInterface, price: FurnitureInterface}, quantity: number }[]; // Muebles involucrados y cantidad
  dateTime?: Date; // Fecha y hora de la transacción
  observations?: string; // Observaciones
  totalAmount: number; // Importe total de la transacción
}

const transactionSchema = new Schema<TransactionInterface>({
  entity: {
    type: {
      type: String,
      required: true,
      refPath: 'ProviderInterface' || 'CustomerInterface'
    },
    nif: {
      type: String,
      required: false,
      refPath: 'CustomerInterface'
    },
    cif: {
      type: String,
      required: false,
      refPath: 'ProviderInterface'
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['Purchase Order', 'Sell Order', 'Refund from client', 'Refund to provider']
  },
  furniture: [{
    name: {
      type: String,
      required: true,
      ref: 'Furniture'
    },
    body : {
      type: {
        type: String,
        required: false,
        ref: 'Furniture'
      },
      description: {
        type: String,
        required: false,
        ref: 'Furniture'
      },
      color: {
        type: String,
        required: false,
        ref: 'Furniture'
      },
      dimensions: {
        type: String,
        required: false,
        ref: 'Furniture'
      },
      price: {
        type: Number,
        required: false,
        ref: 'Furniture'
      }
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  dateTime: {
    type: Date,
    default: Date.now,
  },
  observations: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  }
});

export const Transaction = model<TransactionInterface>('Transaction', transactionSchema);