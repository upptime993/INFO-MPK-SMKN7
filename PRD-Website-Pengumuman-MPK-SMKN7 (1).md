# PRD — Website Pengumuman Hasil Seleksi Anggota Baru MPK SMKN 7 Kota Serang

> **Instruksi untuk AI Coding Agent (Cursor / Codex / Claude Code):**
> Dokumen ini adalah spesifikasi lengkap untuk sebuah web app. Baca seluruh dokumen sebelum mulai coding. Ikuti struktur folder, tech stack, dan skema data yang sudah ditentukan kecuali ada alasan teknis kuat untuk berbeda (jelaskan alasannya jika menyimpang). Kerjakan bertahap sesuai **Bagian 12 (Rencana Implementasi)**. Jika ada instruksi yang ambigu, buat asumsi paling masuk akal, tuliskan asumsi tersebut sebagai komentar/README, dan lanjutkan — jangan berhenti total hanya karena satu detail kurang jelas.

---

## 1. Ringkasan Proyek

Website satu-arah untuk **pengumuman hasil seleksi Tes Tahap 1 penerimaan anggota baru MPK (Majelis Permusyawaratan Kelas) SMKN 7 Kota Serang**.

Alih-alih panitia mengumumkan hasil satu per satu lewat WhatsApp, peserta membuka website, memasukkan data diri mereka, lalu sistem menampilkan hasil seleksi mereka sendiri: status lulus/tidak lulus, nilai & persentase per jenis tes, catatan penguji, dan pesan dari panitia MPK.

Panitia (admin) memiliki halaman terpisah untuk menginput dan mengelola data seluruh peserta.

**Bukan bagian dari MVP ini:** pendaftaran online, tes tahap 2 (Tes Debat), sistem notifikasi WhatsApp/email otomatis. Cukup dicatat sebagai kemungkinan pengembangan lanjutan (lihat Bagian 14).

---

## 2. Konteks & Aturan Bisnis (Business Rules)

### 2.1 Struktur Tes Tahap 1
Ada 3 jenis tes, masing-masing dengan **nilai maksimal 5 poin**:

| Kode | Nama Tes | Maks Poin |
|---|---|---|
| `mengaji` | Tes Mengaji | 5 |
| `akademik` | Tes Akademik | 5 |
| `wawancara` | Tes Wawancara/Interview | 5 |

**Total maksimal = 15 poin.**

> Catatan konteks (dari formulir penilaian yang dilampirkan): di lapangan, nilai per tes ini sebenarnya diturunkan dari beberapa sub-aspek —
> - Tes Mengaji: Tajwid, Kelancaran, Makhorijul Huruf, bacaan QS.
> - Tes Wawancara: Adab, Wawasan, Percaya Diri.
>
> Untuk MVP ini, **website hanya menyimpan nilai akhir (0–5) per tes**, bukan rincian sub-aspeknya — perhitungan sub-aspek tetap dilakukan manual oleh penguji di kertas/form, lalu admin memasukkan hasil akhirnya ke website. (Lihat Bagian 14 jika suatu saat ingin menyimpan rincian sub-aspek juga.)

### 2.2 Kriteria Kelulusan
- **Total poin ≥ 11** → Status **LULUS**, peserta lanjut ke Tes Tahap 2 (Tes Debat).
- **Total poin < 11** → Status **TIDAK LULUS**.
- Nilai boleh desimal (misalnya 4.5), jadi field nilai sebaiknya `number` dengan step 0.1 atau 0.5, bukan integer saja.

### 2.3 Perhitungan Persentase (ditampilkan ke peserta)
- Persentase per tes = `(nilai_tes / 5) * 100`
- Persentase total (opsional, boleh ditampilkan) = `(total_poin / 15) * 100`

### 2.4 Status Publikasi (penting — tambahan dari saya, bukan disebut eksplisit oleh user)
Agar panitia bisa menginput data lebih dulu tanpa buru-buru dan baru menampilkannya ke publik saat waktunya diumumkan, tambahkan field **`published: boolean`** per peserta (default `false`).
- Peserta hanya bisa menemukan hasilnya di halaman publik jika `published: true`.
- Ini menghindari kejadian "hasil bocor" saat data baru setengah diinput.

---

## 3. Alur Pengguna (User Flow)

### 3.1 Peserta (Publik)
1. Buka halaman utama (`/`).
2. Isi form pencarian: **Nama Lengkap** + **Nomor Pendaftaran / Kelas & Jurusan** (lihat catatan privasi di Bagian 9).
3. Klik "Cek Hasil".
4. Sistem mencari data → tampilkan salah satu dari:
   - **Ditemukan & published** → tampilkan kartu hasil (lihat Bagian 4.1).
   - **Ditemukan tapi belum published** → pesan "Hasil belum diumumkan, silakan cek kembali nanti."
   - **Tidak ditemukan** → pesan "Data tidak ditemukan, pastikan nama & nomor pendaftaran sudah benar."

### 3.2 Admin (Panitia MPK)
1. Buka `/admin/login`, masuk dengan username & password.
2. Masuk ke `/admin/dashboard` → melihat tabel seluruh peserta (nama, status, total poin, status publish).
3. Bisa:
   - Tambah peserta baru (form input semua data).
   - Edit data peserta (nilai, catatan, pesan, status publish).
   - Hapus peserta.
   - Cari/filter peserta di tabel.
   - Toggle publish satu peserta, atau **"Publish Semua"** sekaligus (tombol massal — berguna saat waktu pengumuman tiba).
4. Logout.

---

## 4. Fitur & Requirement Fungsional

### 4.1 Halaman Publik — Hasil Seleksi
Tampilkan dalam satu kartu hasil, berisi:
- Nama peserta (+ kelas/jurusan jika ada).
- **Badge status besar**: `LULUS` (hijau) atau `TIDAK LULUS` (merah/abu).
- Jika LULUS: keterangan tambahan "Selamat! Anda lanjut ke Tes Tahap 2 (Tes Debat)."
- 3 kartu/baris skor kecil (mengaji, akademik, wawancara), masing-masing menampilkan:
  - Nama tes + ikon
  - Nilai (misal `4.5 / 5`)
  - Progress bar / persentase (misal `90%`)
  - Catatan/penilaian dari penguji untuk tes tersebut
- Total poin (misal `12 / 15`).
- **Pesan dari Kakak-Kakak MPK** — blok pesan personal/motivasi untuk peserta tsb.
- Tombol "Cari Nama Lain" untuk kembali ke form pencarian.

### 4.2 Halaman Admin
**Dashboard/List Peserta:**
- Tabel: No, Nama, Kelas/Jurusan, No. Pendaftaran, Total Poin, Status (Lulus/Tidak), Published (toggle), Aksi (Edit/Hapus).
- Search bar + filter status (Semua/Lulus/Tidak Lulus/Belum Publish).
- Tombol "+ Tambah Peserta".
- Tombol "Publish Semua yang Belum Publish" (dengan konfirmasi).

**Form Tambah/Edit Peserta:**
- Nama Lengkap *
- Kelas & Jurusan
- Nomor Pendaftaran *
- Nilai Mengaji (0–5) + Catatan Mengaji
- Nilai Akademik (0–5) + Catatan Akademik
- Nilai Wawancara (0–5) + Catatan Wawancara
- Pesan dari MPK untuk peserta (textarea)
- Total poin & status **dihitung otomatis** (read-only, live preview saat admin mengetik nilai) — jangan biarkan admin input status manual supaya tidak ada human error/inkonsistensi dengan aturan bisnis.
- Toggle "Published"
- Tombol Simpan / Batal

---

## 5. Tech Stack

| Layer | Pilihan |
|---|---|
| Framework | **Next.js 14+ (App Router)**, TypeScript |
| Styling | **Tailwind CSS** |
| Database | **MongoDB Atlas** (free tier M0) |
| ODM | **Mongoose** |
| Auth Admin | Custom sederhana (JWT di httpOnly cookie) — lihat Bagian 9 |
| Deployment | **Vercel** (free tier) |
| Icons | `lucide-react` |
| Validasi form | `zod` |

Alasan: kombinasi ini gratis penuh untuk skala sekolah, deployment ke Vercel tinggal connect repo GitHub, dan MongoDB Atlas free tier cukup untuk data peserta seleksi (puluhan–ratusan record).

---

## 6. Struktur Data (MongoDB Schema)

### 6.1 Collection `peserta`

```ts
// lib/models/Peserta.ts
interface IPeserta {
  _id: ObjectId;
  nama: string;                    // required
  kelasJurusan?: string;           // contoh: "XI RPL 2"
  nomorPendaftaran: string;        // required, unique
  nilai: {
    mengaji: number;               // 0 - 5
    akademik: number;              // 0 - 5
    wawancara: number;             // 0 - 5
  };
  catatan: {
    mengaji?: string;
    akademik?: string;
    wawancara?: string;
  };
  pesanMPK?: string;                // pesan personal dari panitia
  totalPoin: number;                // computed: sum nilai, disimpan untuk kemudahan query/sort
  status: "LULUS" | "TIDAK_LULUS";  // computed dari totalPoin >= 11
  published: boolean;               // default false
  createdAt: Date;
  updatedAt: Date;
}
```

> **Penting:** `totalPoin` dan `status` dihitung ulang di server (bukan dipercaya dari input client) setiap kali data disimpan — buat helper `lib/scoring.ts`:
> ```ts
> export function hitungHasil(nilai: { mengaji: number; akademik: number; wawancara: number }) {
>   const total = nilai.mengaji + nilai.akademik + nilai.wawancara;
>   const status = total >= 11 ? "LULUS" : "TIDAK_LULUS";
>   return { totalPoin: total, status };
> }
> ```

### 6.2 Collection `admins`
Untuk menyimpan akun panitia (lebih aman & fleksibel daripada hardcode 1 password di env var; boleh lebih dari satu admin).

```ts
interface IAdmin {
  _id: ObjectId;
  username: string;      // unique
  passwordHash: string;  // bcrypt
  nama?: string;
  createdAt: Date;
}
```
Akun admin awal dibuat lewat **seed script** (`scripts/seed-admin.ts`), dijalankan manual sekali via `npx tsx scripts/seed-admin.ts`, bukan lewat UI publik (tidak ada halaman "register" admin).

---

## 7. API Routes

| Method | Route | Auth? | Fungsi |
|---|---|---|---|
| `POST` | `/api/cek-hasil` | Publik | Body: `{ nama, nomorPendaftaran }` → cari peserta, hanya kembalikan data jika `published === true` |
| `GET` | `/api/peserta` | Admin | List semua peserta (support query `?search=&status=`) |
| `POST` | `/api/peserta` | Admin | Tambah peserta baru |
| `GET` | `/api/peserta/:id` | Admin | Detail satu peserta |
| `PUT` | `/api/peserta/:id` | Admin | Update peserta |
| `DELETE` | `/api/peserta/:id` | Admin | Hapus peserta |
| `PATCH` | `/api/peserta/publish-all` | Admin | Set `published: true` untuk semua yang masih `false` |
| `POST` | `/api/auth/login` | Publik | Body: `{ username, password }` → set cookie sesi jika valid |
| `POST` | `/api/auth/logout` | Admin | Hapus cookie sesi |

**Catatan keamanan endpoint `/api/cek-hasil`:** jangan pernah mengembalikan list semua peserta atau membocorkan apakah "nama ditemukan tapi nomor salah" vs "nama tidak ada sama sekali" — pesan error harus generik ("data tidak ditemukan") di kedua kasus, supaya endpoint ini tidak bisa dipakai untuk enumerasi nama peserta lain.

---

## 8. Desain UI/UX — Arah Spesifik (Anti Generik/"AI Slop")

> **Peringatan eksplisit untuk AI Agent:** JANGAN default ke pola umum berikut, walau familiar dan "aman":
> - Palet `blue-500`/`indigo-600` bawaan Tailwind + `shadow-lg rounded-xl` di semua kartu.
> - Font `Inter` untuk semua elemen tanpa pertimbangan.
> - Pola "3 kartu: ikon bulat di atas → judul tebal → deskripsi abu-abu" tanpa modifikasi (ini pola SaaS generik — dua dari tiga screenshot referensi yang diberikan user sendiri termasuk pola ini, jadi jangan ditiru mentah-mentah).
> - Badge status berupa pil polos hijau/merah (`bg-green-100 text-green-800 rounded-full px-3 py-1`) — ini paling gampang terasa generik/template.
> - Klise "AI-generated look" lain yang juga harus dihindari: (a) background krem + serif kontras tinggi + aksen terracotta; (b) background gelap/hitam + aksen neon hijau/oranye tunggal. Kedua pola ini sering muncul default dari AI meskipun tidak relevan dengan brief.
>
> Sebagai gantinya, ikuti **sistem desain spesifik** di bawah ini — sudah diturunkan dari identitas visual asli logo MPK & SMKN 7 Kota Serang, bukan template generik. Sebelum mulai coding, tulis dulu rencana desain singkat (token warna, tipografi, layout, elemen ciri khas) di README/komentar, cek ulang apakah ada bagian yang masih terasa seperti jawaban default untuk brief apa pun, lalu revisi sebelum menulis kode.

### 8.1 Konsep Arahan
Ini adalah **pengumuman resmi organisasi kesiswaan** (MPK = semacam majelis legislatif/musyawarah kelas — logonya sendiri berisi palu sidang, timbangan keadilan, padi & kapas ala lambang instansi). Jadi arah desainnya bukan "dashboard SaaS ceria", tapi **nuansa surat/pengumuman resmi yang modern** — dignified, rapi, sedikit formal, tapi tetap ringan dan enak dibaca di HP. Elemen ciri khasnya: **stempel/cap bundar** untuk status kelulusan — meniru kebiasaan dokumen resmi Indonesia (rapor, ijazah, SK) yang selalu distempel bulat warna merah — bukan badge pil warna datar.

### 8.2 Token Warna (diturunkan dari logo MPK & SMKN 7)
| Token | Hex | Sumber | Pemakaian |
|---|---|---|---|
| `navy` (primary) | `#1B3A5C` | Biru lambang MPK & globe SMKN 7 | Header, heading utama, teks penting |
| `gold` (accent) | `#D9A441` | Padi pada logo MPK & aksen kuning SMKN 7 | Aksen garis, hover, elemen dekoratif kecil |
| `stamp-red` (khusus stempel) | `#B23A2E` | Merah pada logo MPK | HANYA untuk elemen "cap/stempel" hasil — bukan untuk tombol/link umum |
| `pass-green` | `#2F6E4F` | — | Aksen sekunder di sekitar cap untuk status LULUS (garis tipis/ikon centang, bukan fill besar) |
| `paper` (background) | `#FAF8F3` | — | Background halaman — putih gading hangat, bukan putih flat `#FFFFFF` atau krem AI-cliché `#F4F1EA` |
| `ink` (teks) | `#232323` | — | Body text |

> Catatan: `paper` sengaja putih gading (bukan putih pure, bukan juga krem tebal ala klise AI) — kesan kertas surat resmi, halus tapi bukan pattern yang sudah terlalu sering dipakai AI.

### 8.3 Tipografi
- **Display/heading** — `Source Serif 4` (Google Fonts, gratis). Dipakai untuk judul halaman, angka status besar, dan teks di dalam elemen "cap/stempel". Serif dipilih karena kesan dokumen resmi/surat keputusan, bukan estetika editorial umum.
- **Body & data/tabel** — `Plus Jakarta Sans`. Dipakai untuk paragraf, tabel admin, form — grotesk modern yang jelas dibaca di ukuran kecil, sengaja bukan `Inter`.
- Heading besar boleh agak besar & tegas (mis. 40–56px di desktop untuk judul halaman utama), tapi hindari efek gradient-text.

### 8.4 Elemen Ciri Khas (Signature Element) — Cap/Stempel Status
Alih-alih badge pil datar, buat komponen `StampBadge`:
- Bentuk lingkaran (echo bentuk logo MPK & SMKN 7 yang sama-sama bulat/geometris), border ganda tipis (meniru cincin teks pada logo asli), sedikit rotasi (±-6° sampai -10°) seperti stempel asli yang dicap agak miring.
- Isi teks: `LULUS` atau `TIDAK LULUS`, font `Source Serif 4`, huruf kapital, tracking lebar.
- Warna ring/teks: gunakan `stamp-red` sebagai warna dasar cap (karena secara budaya cap resmi selalu merah, terlepas isinya lulus/tidak) — lalu bedakan lulus/tidak lulus lewat **ikon kecil** di dalam cap (✓ untuk lulus warna `pass-green`, ✕ untuk tidak lulus abu-abu) supaya tetap jelas sekilas pandang, tidak mengandalkan warna cap saja.
- Opsional: beri sedikit efek tekstur "grain"/noise tipis di atas cap (CSS blend atau SVG filter ringan) supaya terasa seperti benar-benar dicap, bukan elemen flat vektor.
- Elemen ini yang dipakai berulang di halaman hasil (besar, sebagai fokus utama) dan di tabel admin (versi kecil, sebagai indikator status).

### 8.5 Layout
**Halaman publik (`/`):**
```
┌─────────────────────────────────────────────┐
│ [logo MPK] [logo SMKN7]   Pengumuman Hasil   │  ← header tipis, garis bawah 1px gold
│                            Seleksi MPK        │
├─────────────────────────────────────────────┤
│         Eyebrow: "PENGUMUMAN RESMI"           │
│         Cek Hasil Seleksi Tahap 1             │  ← heading serif besar, bukan "Welcome to X"
│         (form: Nama + No. Pendaftaran)        │
│                [ Cek Hasil ]                  │
├─────────────────────────────────────────────┤
│  (setelah submit — muncul di bawah form)      │
│   [ Cap Status besar: LULUS/TIDAK LULUS ]     │
│   ┌───────────┬───────────┬───────────┐       │
│   │ Mengaji   │ Akademik  │ Wawancara │       │
│   │ 4.5/5 90% │ 4/5  80%  │ 4/5  80%  │       │
│   │ catatan.. │ catatan.. │ catatan.. │       │
│   └───────────┴───────────┴───────────┘       │
│   Total: 12.5 / 15                            │
│   "Pesan dari Kakak-Kakak MPK": ...           │
└─────────────────────────────────────────────┘
```
Watermark: logo MPK (`logo_mpk.png`), sangat besar (melebihi lebar viewport), opacity ±4–6%, posisi fixed di background, grayscale agar tidak bentrok dengan warna cap.

**Kartu skor per tes:** bukan kartu "ikon-bulat-di-atas" generik — gunakan layout list horizontal dengan garis pemisah tipis (bukan card terpisah dengan shadow tebal), progress bar tipis 2–3px warna `gold` untuk persentase, nama tes pakai body font tapi bold, angka nilai pakai serif kecil. Ini menghindari kesan "3 SaaS feature card" dari referensi.

**Halaman admin:** sidebar `navy` solid (bukan putih polos), teks putih/gold untuk item aktif — beda kontras dengan halaman publik yang terang, supaya admin & publik terasa sebagai "dua zona" yang jelas berbeda tapi tetap satu keluarga warna.

### 8.6 Aset Logo
Gunakan file yang sudah disediakan user — simpan sebagai `public/logo-mpk.png` dan `public/logo-smkn7.png`.

### 8.7 Checklist Self-Critique Sebelum Coding
Agent wajib mengecek rencana desainnya sendiri terhadap daftar ini sebelum lanjut menulis kode:
- [ ] Apakah warna yang dipakai benar-benar dari token di atas, bukan `blue-500`/`indigo-600` default?
- [ ] Apakah status ditampilkan sebagai cap/stempel, bukan badge pil datar?
- [ ] Apakah heading pakai `Source Serif 4`, bukan `Inter` di semua tempat?
- [ ] Apakah kartu skor tes berupa list bergaris (bukan 3 kartu ikon-judul-deskripsi generik)?
- [ ] Apakah halaman terasa seperti "pengumuman resmi organisasi", bukan "landing page SaaS"?

Jika ada satu saja jawaban "tidak", revisi dulu sebelum lanjut ke tahap implementasi di Bagian 12.

---

## 9. Keamanan & Privasi

1. **Auth admin:** hash password dengan `bcrypt`, session pakai JWT disimpan di **httpOnly, secure cookie** (bukan localStorage). Middleware Next.js (`middleware.ts`) memblokir akses ke `/admin/*` (kecuali `/admin/login`) dan ke semua `/api/peserta*`, `/api/auth/logout` jika cookie tidak valid.
2. **Pencarian hasil oleh peserta — rekomendasi default:** gunakan kombinasi **Nama + Nomor Pendaftaran** (bukan nama saja), supaya orang lain tidak bisa asal mengetik nama teman untuk melihat nilai & catatan pribadinya. Nomor pendaftaran ini kamu yang tentukan formatnya (bisa nomor urut sederhana yang dibagikan saat pendaftaran tes).
   - Jika kamu tetap ingin sesimpel mungkin (hanya nama), minimal tambahkan **kelas/jurusan** sebagai kombinasi kedua. Tapi ini kurang aman dibanding nomor pendaftaran karena kelas mudah ditebak.
3. Rate limiting sederhana (opsional tapi disarankan) pada `/api/cek-hasil` untuk mencegah brute-force nomor pendaftaran (misalnya batasi ~20 request/menit per IP menggunakan middleware ringan).
4. Jangan expose `_id` MongoDB mentah atau field internal lain ke response publik — buat DTO/mapping response yang eksplisit hanya berisi field yang memang boleh dilihat peserta.

---

## 10. Struktur Folder Project

```
mpk-smkn7-pengumuman/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # halaman pencarian + hasil publik (client component)
│   ├── globals.css
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── layout.tsx                # proteksi + sidebar admin
│   │   └── dashboard/
│   │       ├── page.tsx              # list & search peserta
│   │       └── peserta/
│   │           ├── baru/page.tsx     # form tambah
│   │           └── [id]/page.tsx     # form edit
│   └── api/
│       ├── cek-hasil/route.ts
│       ├── peserta/route.ts
│       ├── peserta/[id]/route.ts
│       ├── peserta/publish-all/route.ts
│       └── auth/
│           ├── login/route.ts
│           └── logout/route.ts
├── components/
│   ├── ui/                           # Button, Card, Badge, Input, Table, Toast
│   ├── SearchForm.tsx
│   ├── ResultCard.tsx
│   ├── ScoreCard.tsx
│   ├── StatusBadge.tsx
│   ├── AdminSidebar.tsx
│   ├── PesertaTable.tsx
│   ├── PesertaForm.tsx
│   └── LogoWatermark.tsx
├── lib/
│   ├── mongodb.ts                    # koneksi cached (hindari reconnect tiap request)
│   ├── models/
│   │   ├── Peserta.ts
│   │   └── Admin.ts
│   ├── auth.ts                       # sign/verify JWT, helper getSession()
│   └── scoring.ts                    # hitungHasil()
├── scripts/
│   └── seed-admin.ts
├── middleware.ts
├── public/
│   ├── logo-mpk.png
│   └── logo-smkn7.png
├── .env.local.example
├── package.json
└── README.md
```

---

## 11. Environment Variables

```env
# .env.local
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/mpk-smkn7?retryWrites=true&w=majority
JWT_SECRET=<random-string-panjang>
NODE_ENV=development
```

Set variabel yang sama di **Vercel Project Settings → Environment Variables** untuk production.

---

## 12. Rencana Implementasi Bertahap (untuk AI Agent)

Kerjakan urut, jangan lompat-lompat, dan pastikan tiap tahap bisa dijalankan (`npm run dev`) sebelum lanjut:

1. **Setup project**: `create-next-app` (TypeScript, Tailwind, App Router, ESLint). Install `mongoose`, `bcryptjs`, `jsonwebtoken`, `zod`, `lucide-react`.
2. **Koneksi database**: buat `lib/mongodb.ts` dengan pola cached connection (wajib untuk serverless/Vercel — hindari membuat koneksi baru tiap invocation).
3. **Schema & model**: `Peserta.ts`, `Admin.ts`, plus `lib/scoring.ts`.
4. **Seed admin**: `scripts/seed-admin.ts` untuk membuat 1 akun admin awal dari input CLI/env.
5. **Auth**: endpoint login/logout, `lib/auth.ts`, `middleware.ts` untuk proteksi route admin.
6. **Design system dasar**: komponen `ui/` (Button, Card, Badge, Input) sesuai arahan Bagian 8, plus set warna & font di `tailwind.config`.
7. **Halaman publik**: `SearchForm`, endpoint `/api/cek-hasil`, `ResultCard` + `ScoreCard`, `LogoWatermark`.
8. **Admin — list & CRUD**: tabel peserta, form tambah/edit dengan live preview total poin & status, endpoint CRUD lengkap.
9. **Fitur publish**: toggle per-peserta + tombol "Publish Semua".
10. **Polish & responsive check**: cek tampilan di ukuran mobile, tambahkan empty states & loading states.
11. **README**: cara setup lokal, cara isi `.env.local`, cara seed admin, cara deploy.
12. **Deploy**: push ke GitHub → import project ke Vercel → set env vars → deploy → buat cluster MongoDB Atlas (free M0), whitelist IP `0.0.0.0/0` (khusus untuk kemudahan Vercel, karena IP Vercel dinamis) → uji alur end-to-end di production.

---

## 13. Kriteria "Selesai" (Definition of Done)

- [ ] Peserta bisa cari hasil dengan nama + nomor pendaftaran dan melihat status, nilai per tes (+ persentase), catatan, dan pesan MPK.
- [ ] Data yang belum di-publish tidak bisa ditemukan peserta.
- [ ] Admin bisa login, tambah/edit/hapus peserta, dan status/total poin selalu dihitung otomatis (tidak bisa diinput manual sembarangan).
- [ ] Tombol "Publish Semua" berfungsi.
- [ ] Tampilan rapi & responsif di HP maupun desktop, logo MPK & SMKN 7 tampil di header dan sebagai watermark.
- [ ] Berhasil deploy di Vercel dengan MongoDB Atlas, dan bisa diakses lewat URL publik.

---

## 14. Kemungkinan Pengembangan Lanjutan (di luar MVP ini)

- Menyimpan rincian sub-aspek penilaian (Tajwid/Kelancaran/Makhorijul/QS untuk Mengaji; Adab/Wawasan/Percaya Diri untuk Wawancara) sebagai data terstruktur, bukan cuma nilai akhir.
- Modul Tes Tahap 2 (Tes Debat) dengan alur serupa.
- Import data massal dari Excel/CSV oleh admin.
- Notifikasi otomatis (WhatsApp API/email) saat hasil di-publish.
- Log aktivitas admin (siapa mengubah data apa, kapan).
