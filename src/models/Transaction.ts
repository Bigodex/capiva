import {
  Schema,
  model,
  models,
  type Model,
} from "mongoose";

export type TransactionType =
  | "income"
  | "expense"
  | "investment";

export interface ITransaction {
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "income",
        "expense",
        "investment",
      ],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  (models.Transaction as Model<ITransaction>) ||
  model<ITransaction>(
    "Transaction",
    TransactionSchema
  );

export default Transaction;