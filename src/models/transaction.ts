import { Document, model, Schema} from "mongoose";

import { FurnitureInterface } from "./furniture.js";
import { ProviderInterface } from "./provider.js";
import { CustomerInterface } from "./customer.js";

interface TransactionInterface extends Document {
  entity: CustomerInterface | ProviderInterface;
  type: 'Purchase Order' | 'Sell Order' | 'Refund from client' | 'Refund to provider'; // Tipo de transacción
  furniture: { name: FurnitureInterface, quantity: number }[]; // Muebles involucrados y cantidad
  dateTime?: Date; // Fecha y hora de la transacción
  observations?: string; // Observaciones
  totalAmount: number; // Importe total de la transacción
}

const transactionSchema = new Schema<TransactionInterface>({
  entity: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'CustomerInterface' || 'ProviderInterface'
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