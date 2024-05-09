import { Document, model, Schema } from "mongoose";

export interface FurnitureInterface extends Document {
  type: string;
  name: string;
  description: string;
  color: string;
  dimensions: string;
  price: number;
  stock: number;
}

const furnitureSchema = new Schema<FurnitureInterface>({
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['Sofa', 'Table', 'Chair', 'Bed', 'Wardrobe', 'Desk', 'Shelf', 'Dresser', 'Cupboard', 'Stool', 'Couches', 'Sideboard'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Name must start with a capital letter');
      }
    },
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  dimensions: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
});

export const Furniture = model<FurnitureInterface>('Furniture', furnitureSchema);