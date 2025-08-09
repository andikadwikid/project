# Panduan Import Produk dengan Dual File (Excel + ZIP)

## Overview
Sistem ini memungkinkan import data produk menggunakan 2 file:
1. **File Excel (.xlsx)** - berisi data produk
2. **File ZIP (.zip)** - berisi gambar produk (opsional)

## Format File Excel

### Kolom yang Diperlukan:
| Kolom | Tipe | Wajib | Deskripsi |
|-------|------|-------|----------|
| name | String | Ya | Nama produk |
| code | String | Ya | Kode unik produk (harus unik) |
| description | String | Tidak | Deskripsi produk |
| price | Number | Ya | Harga produk |
| category | String | Ya | Kategori produk |
| stock | Number | Ya | Stok produk |
| image_url | String | Tidak | Nama file gambar (tanpa path) |
| status | String | Tidak | Status produk (active/inactive) |

### Contoh Data Excel:
```
name                    | code                | description           | price | category    | stock | image_url        | status
Laptop Gaming ASUS      | LAPTOP-ASUS-ROG-001 | Laptop untuk gaming   | 15000 | Electronics | 10    | laptop-asus.jpg  | active
Mouse Wireless Logitech | MOUSE-LOGITECH-001  | Mouse nirkabel        | 250   | Electronics | 25    | mouse-logitech.png | active
Keyboard Mechanical     | KEYBOARD-MECH-001   | Keyboard gaming       | 800   | Electronics | 15    | keyboard-mech.jpg | active
```

## Format File ZIP

### Struktur ZIP:
```
product-images.zip
├── laptop-asus.jpg
├── mouse-logitech.png
├── keyboard-mech.jpg
└── other-product.png
```

### Aturan Penamaan File:
- Nama file gambar di ZIP harus **persis sama** dengan nilai di kolom `image_url` di Excel
- Format gambar yang didukung: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Ukuran maksimal per gambar: 5MB
- Nama file case-sensitive (huruf besar/kecil harus sama)

## Cara Kerja Sistem

1. **Upload Files**: User mengupload file Excel (wajib) dan ZIP (opsional)
2. **Parse Excel**: Sistem membaca data produk dari Excel menggunakan library `xlsx`
3. **Extract ZIP**: Jika ada file ZIP, sistem mengekstrak gambar menggunakan `adm-zip`
4. **Match Images**: Sistem mencocokkan nilai `image_url` di Excel dengan nama file di ZIP
5. **Save Images**: Gambar disimpan ke folder `/public/uploads/` dengan nama unik
6. **Save Products**: Data produk disimpan ke database dengan URL gambar yang benar

## Contoh Penggunaan

### 1. Persiapan File Excel
Buat file Excel dengan data seperti contoh di atas. Pastikan kolom `image_url` berisi nama file gambar yang sesuai.

### 2. Persiapan File ZIP
Buat file ZIP yang berisi gambar-gambar produk dengan nama file yang sesuai dengan kolom `image_url`.

### 3. Upload di Admin Panel
1. Buka halaman Admin Products
2. Klik tombol "Import Products"
3. Upload file Excel (wajib)
4. Upload file ZIP (opsional)
5. Klik "Import Products"

### 4. Hasil Import
Sistem akan menampilkan hasil import:
- Jumlah produk berhasil diimport
- Jumlah produk gagal diimport
- Detail error jika ada

## Error Handling

### Error Umum:
- **File Excel tidak valid**: Format file bukan .xlsx atau .xls
- **File ZIP tidak valid**: Format file bukan .zip
- **Kolom wajib kosong**: name, price, category, atau stock kosong
- **Gambar tidak ditemukan**: File gambar di kolom image_url tidak ada di ZIP
- **Format gambar tidak didukung**: File bukan format gambar yang valid
- **Ukuran gambar terlalu besar**: File gambar lebih dari 5MB

### Tips Menghindari Error:
1. Pastikan semua kolom wajib terisi
2. Gunakan format angka yang benar untuk price dan stock
3. Nama file gambar di ZIP harus persis sama dengan di Excel
4. Kompres gambar jika ukurannya terlalu besar
5. Gunakan format gambar yang umum (jpg, png)

## API Endpoint

**POST** `/api/products/import`

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `excelFile`: File Excel (.xlsx/.xls)
  - `zipFile`: File ZIP (.zip) - opsional

**Response:**
```json
{
  "success": true,
  "message": "Import completed successfully",
  "results": {
    "success": 3,
    "failed": 0,
    "errors": []
  }
}
```

## Keamanan

- File upload dibatasi hanya untuk format yang diizinkan
- Ukuran file dibatasi untuk mencegah abuse
- Nama file gambar di-sanitize untuk mencegah path traversal
- Validasi tipe MIME untuk memastikan file adalah gambar