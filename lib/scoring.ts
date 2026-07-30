export interface NilaiInput {
  mengaji: number;
  akademik: number;
  wawancara: number;
}

export type StatusSeleksi = "LULUS" | "TIDAK_LULUS";

export interface HasilSeleksi {
  totalPoin: number;
  status: StatusSeleksi;
  persentaseTotal: number;
  persentaseDetail: {
    mengaji: number;
    akademik: number;
    wawancara: number;
  };
}

export function hitungHasil(nilai: NilaiInput): HasilSeleksi {
  const mengaji = Math.min(5, Math.max(0, Number(nilai.mengaji) || 0));
  const akademik = Math.min(5, Math.max(0, Number(nilai.akademik) || 0));
  const wawancara = Math.min(5, Math.max(0, Number(nilai.wawancara) || 0));

  const totalRaw = mengaji + akademik + wawancara;
  const totalPoin = Math.round(totalRaw * 10) / 10;
  // Kriteria Kelulusan: Total Poin >= 10 -> LULUS
  const status: StatusSeleksi = totalPoin >= 10 ? "LULUS" : "TIDAK_LULUS";

  return {
    totalPoin,
    status,
    persentaseTotal: Math.round((totalPoin / 15) * 100),
    persentaseDetail: {
      mengaji: Math.round((mengaji / 5) * 100),
      akademik: Math.round((akademik / 5) * 100),
      wawancara: Math.round((wawancara / 5) * 100),
    },
  };
}
