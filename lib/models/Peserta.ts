import mongoose, { Schema, Document, Model } from "mongoose";
import { hitungHasil, StatusSeleksi } from "../scoring";

export interface IPeserta extends Document {
  nama: string;
  kelasJurusan?: string;
  nomorPendaftaran: string;
  nilai: {
    mengaji: number;
    akademik: number;
    wawancara: number;
  };
  catatan?: {
    mengaji?: string;
    akademik?: string;
    wawancara?: string;
  };
  namaPenguji?: {
    mengaji?: string;
    akademik?: string;
    wawancara?: string;
  };
  pesanMPK?: string;
  linkWaGrup?: string;
  totalPoin: number;
  status: StatusSeleksi;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PesertaSchema = new Schema<IPeserta>(
  {
    nama: {
      type: String,
      required: [true, "Nama lengkap wajib diisi"],
      trim: true,
    },
    kelasJurusan: {
      type: String,
      trim: true,
      default: "",
    },
    nomorPendaftaran: {
      type: String,
      required: [true, "Nomor pendaftaran wajib diisi"],
      unique: true,
      trim: true,
    },
    nilai: {
      mengaji: { type: Number, required: true, min: 0, max: 5, default: 0 },
      akademik: { type: Number, required: true, min: 0, max: 5, default: 0 },
      wawancara: { type: Number, required: true, min: 0, max: 5, default: 0 },
    },
    catatan: {
      mengaji: { type: String, default: "" },
      akademik: { type: String, default: "" },
      wawancara: { type: String, default: "" },
    },
    namaPenguji: {
      mengaji: { type: String, default: "" },
      akademik: { type: String, default: "" },
      wawancara: { type: String, default: "" },
    },
    pesanMPK: {
      type: String,
      default: "",
    },
    linkWaGrup: {
      type: String,
      default: "",
    },
    totalPoin: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["LULUS", "TIDAK_LULUS"],
      required: true,
      default: "TIDAK_LULUS",
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

PesertaSchema.pre("save", function (next) {
  if (this.isModified("nilai") || this.isNew) {
    const hasil = hitungHasil(this.nilai);
    this.totalPoin = hasil.totalPoin;
    this.status = hasil.status;
  }
  next();
});

const Peserta: Model<IPeserta> =
  mongoose.models.Peserta || mongoose.model<IPeserta>("Peserta", PesertaSchema);

export default Peserta;
