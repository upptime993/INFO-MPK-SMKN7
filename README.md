# Website Pengumuman Hasil Seleksi MPK SMKN 7 Kota Serang

Website pengumuman resmi satu-arah untuk hasil seleksi **Tes Tahap 1 penerimaan anggota baru MPK (Majelis Permusyawaratan Kelas) SMKN 7 Kota Serang** periode 2026/2027.

---

## 📌 Fitur Utama

- **Halaman Publik (`/`)**:
  - Pencarian hasil seleksi berdasarkan **Nama Lengkap** + **Nomor Pendaftaran**.
  - Tampilan **StampBadge** khas dokumen resmi Indonesia (stempel bulat merah `-6°` miring dengan indikator LULUS `✓` / TIDAK LULUS `✕`).
  - Breakdown 3 jenis tes (**Mengaji**, **Akademik**, **Wawancara**) dengan nilai (`0 - 5.0`), progress bar tipis gold, dan catatan khusus penguji.
  - Akumulasi total poin (`0 - 15`) dan persentase akhir.
  - Pesan personal motivasi dari Panitia MPK.
  - Pengamanan data: Data yang belum dipublish tidak dapat dicari di halaman publik.

- **Portal Admin Panitia (`/admin/dashboard`)**:
  - Login khusus panitia dengan autentikasi **JWT di httpOnly Secure Cookie**.
  - Tabel kelola seluruh peserta (Search, Filter status, Quick toggle publish/draft).
  - Tambah & Edit Peserta dengan **Live Preview Skor & Status Otomatis**.
  - Tombol massal **"Publish Semua"** untuk pengumuman serentak.
  - Proteksi Middleware pada semua rute admin & API endpoints.

---

## 🎨 Token Desain & Arahan Visual (Anti "AI Slop")

Sesuai arahan spesifik di PRD & skill `design-taste-frontend`:
- **Navy (`#1B3A5C`)**: Header, heading utama, sidebar admin solid.
- **Gold (`#D9A441`)**: Aksen garis 1px, progress bar 2-3px, border dekoratif.
- **Stamp Red (`#B23A2E`)**: Cincin stempel bulat hasil seleksi.
- **Pass Green (`#2F6E4F`)**: Ikon centang indikator kelulusan.
- **Paper (`#FAF8F3`)**: Background kertas gading hangat.
- **Tipografi**: `Source Serif 4` (Headings & Stempel) + `Plus Jakarta Sans` (Body & Form & Tabel).
- **Watermark**: Logo MPK ukuran besar dengan opacity 4% fixed di background.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas / Mongoose (dengan fallback otomatis *In-Memory MongoDB* jika lokal tanpa server daemon)
- **Auth**: JWT di `httpOnly` cookie (`bcryptjs` + `jsonwebtoken`)
- **Icons**: `lucide-react`
- **Deployment**: Vercel Ready

---

## 🚀 Cara Menjalankan di Lokal (Local Setup)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Salin `.env.local.example` menjadi `.env.local`:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/mpk-smkn7
JWT_SECRET=super-secret-jwt-key-mpk-smkn7-serang-2026-secure
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

> **Catatan**: Jika server MongoDB lokal (`mongod`) tidak aktif di komputer Anda, aplikasi akan **otomatis beralih ke In-Memory MongoDB Server** sehingga aplikasi tetap berjalan 100% tanpa error!

### 3. Seed Akun Admin & Data Contoh
Jalankan perintah berikut untuk membuat 1 akun admin awal dan 4 sampel data peserta:
```bash
npm run seed:admin
```
* **Username Admin**: `admin`
* **Password Admin**: `admin123`

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

- **Halaman Publik**: `http://localhost:3000` (Coba cari peserta `Ahmad Fauzi` / `MPK-2026-001`)
- **Portal Admin**: `http://localhost:3000/admin/login`

---

## 📋 Catatan Asumsi Teknis & Bisnis

1. **Format Nomor Pendaftaran**: Ditentukan berformat `MPK-2026-XXX` (misal `MPK-2026-001`) dan bersifat unik untuk tiap peserta.
2. **Kriteria Kelulusan**: Di-calculate otomatis di server side: `totalPoin >= 11` -> `LULUS`, `totalPoin < 11` -> `TIDAK_LULUS`. Admin tidak diizinkan mengubah status lulus secara manual tanpa mengubah nilai.
3. **Pesan Keamanan Pencarian Publik**: Endpoint `/api/cek-hasil` mengembalikan pesan generik *"Data tidak ditemukan..."* baik jika nomor pendaftaran salah maupun jika status data masih `draft` (belum dipublish), mencegah teknik enumerasi nama peserta lain.
4. **Fallback In-Memory Database**: Ditambahkan `mongodb-memory-server` agar aplikasi dapat dijalankan secara instan di komputer manapun tanpa syarat penginstalan daemon MongoDB terlebih dahulu.

---

## 🌐 Cara Deploy ke Vercel

1. Push repository ini ke GitHub.
2. Buat database gratis di **MongoDB Atlas** (cluster free tier M0) dan catat `Connection String`-nya.
3. Di dashboard MongoDB Atlas: buka **Network Access** -> Tambahkan IP `0.0.0.0/0` (Allow Access from Anywhere agar Vercel Serverless Function dapat terhubung).
4. Import repository ke **Vercel**.
5. Masukkan **Environment Variables** di Vercel Settings:
   - `MONGODB_URI` = `<connection-string-mongodb-atlas>`
   - `JWT_SECRET` = `<random-secret-key>`
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = `<password-admin-anda>`
6. Deploy! Setelah selesai, jalankan seed admin ke MongoDB Atlas dari komputer lokal dengan mengarahkan `MONGODB_URI` di `.env.local` ke URI Atlas Anda, lalu jalankan `npm run seed:admin`.
