import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  nama?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash wajib diisi"],
    },
    nama: {
      type: String,
      default: "Admin Panitia MPK",
    },
  },
  {
    timestamps: true,
  }
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
