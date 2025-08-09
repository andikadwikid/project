# Product Import Excel Documentation

## Overview
Fitur import Excel memungkinkan admin untuk mengimpor data produk secara massal menggunakan file Excel (.xlsx atau .xls). Fitur ini tersedia di halaman admin products dengan tombol "Import Excel".

## Format Excel

### Header Columns (Required)
File Excel harus memiliki header dengan kolom-kolom berikut:

| Column | Required | Description | Example |
|--------|----------|-------------|----------|
| `name` | ✅ | Nama produk | "Nike Air Max 270" |
| `description` | ❌ | Deskripsi produk | "Comfortable running shoes" |
| `categoryCode` | ✅ | Kode kategori yang sudah ada | "SNEAKERS" |
| `brandCode` | ✅ | Kode brand yang sudah ada | "NIKE" |
| `price` | ✅ | Harga produk (angka) | "150.00" |
| `colorCodes` | ❌ | Kode warna (dipisah koma) | "BLACK,WHITE,RED" |
| `sizeCodes` | ❌ | Kode ukuran (dipisah koma) | "SIZE-38,SIZE-39,SIZE-40" |
| `imageUrls` | ❌ | URL gambar (dipisah koma) atau embedded images | "https://example.com/img1.jpg,https://example.com/img2.jpg" |
| `isActive` | ❌ | Status aktif produk | "true" atau "false" (default: true) |

### Available Codes

#### Category Codes
- `SNEAKERS` - Sneakers
- `FORMAL` - Formal Shoes
- `CASUAL` - Casual Shoes
- `SPORTS` - Sports Shoes
- `BOOTS` - Boots

#### Brand Codes
- `NIKE` - Nike
- `ADIDAS` - Adidas
- `CONVERSE` - Converse
- `VANS` - Vans
- `PUMA` - Puma
- `NEWBALANCE` - New Balance

#### Color Codes
- `BLACK` - Black (#000000)
- `WHITE` - White (#FFFFFF)
- `RED` - Red (#FF0000)
- `BLUE` - Blue (#0000FF)
- `GREEN` - Green (#008000)
- `NAVY` - Navy (#000080)

#### Size Codes
- `SIZE-36` sampai `SIZE-44` (ukuran 36-44)

## Example Excel Content

The Excel file should have the following structure:

| name | description | categoryCode | brandCode | price | colorCodes | sizeCodes | imageUrls | isActive |
|------|-------------|--------------|-----------|-------|------------|-----------|-----------|----------|
| Nike Air Zoom Pegasus 39 | A responsive running shoe with Zoom Air cushioning for a smooth ride. | SPORTS | NIKE | 130.00 | BLACK,WHITE | SIZE-38,SIZE-39,SIZE-40,SIZE-41,SIZE-42 | https://example.com/nike-pegasus-1.jpg,https://example.com/nike-pegasus-2.jpg | true |
| Adidas Stan Smith | The iconic tennis shoe with a clean white leather upper and green accents. | CASUAL | ADIDAS | 80.00 | WHITE,GREEN | SIZE-37,SIZE-38,SIZE-39,SIZE-40,SIZE-41,SIZE-42,SIZE-43 | https://example.com/adidas-stansmith-1.jpg | true |

## How to Use

1. **Akses Halaman Admin Products**
   - Buka `/admin/products`
   - Klik tombol "Import Excel"

2. **Download Template**
   - Klik "Download Template" untuk mendapatkan file Excel template
   - Template sudah berisi contoh data yang valid

3. **Prepare Your Excel File**
   - Gunakan template atau buat file Excel sendiri
   - Pastikan format sesuai dengan dokumentasi
   - Gunakan kode yang valid untuk category, brand, color, dan size

4. **Upload and Import**
   - Pilih file Excel (.xlsx atau .xls) yang sudah disiapkan
   - Klik "Import" untuk memulai proses
   - Tunggu hingga proses selesai

5. **Review Results**
   - Lihat hasil import yang menampilkan:
     - Total rows processed
     - Success count
     - Failed count
     - Error details (jika ada)

## Validation Rules

### Required Fields
- `name`: Tidak boleh kosong
- `categoryCode`: Harus ada di database
- `brandCode`: Harus ada di database
- `price`: Harus berupa angka positif

### Optional Fields
- `colorCodes`: Jika diisi, semua kode harus valid
- `sizeCodes`: Jika diisi, semua kode harus valid
- `imageUrls`: Jika diisi, akan diset sebagai gambar produk
- `isActive`: Default true jika tidak diisi

### Embedded Images Support
- **NEW FEATURE**: Sistem sekarang mendukung gambar yang di-embed langsung di Excel
- Gambar yang di-embed akan otomatis di-extract dan di-upload ke server
- Gambar embedded memiliki prioritas lebih tinggi daripada `imageUrls`
- Gambar akan disimpan di `/public/images/products/` dengan nama unik
- Format yang didukung: PNG, JPG, JPEG, GIF
- Ukuran maksimal per gambar: 5MB

### Error Handling
- Jika ada error pada satu baris, baris tersebut akan di-skip
- Baris lain tetap akan diproses
- Semua error akan ditampilkan di hasil import

## API Endpoints

### POST `/api/products/import`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field containing the Excel file (.xlsx or .xls)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRows": 10,
    "successCount": 8,
    "failedCount": 2,
    "errors": [
      {
        "row": 3,
        "error": "Invalid category code: INVALID_CAT"
      }
    ]
  }
}
```

### GET `/api/products/template`

**Request:**
- Method: GET

**Response:**
- Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Returns an Excel template file for download

## Notes

- **File Size Limit**: Maximum file size is typically 10MB
- **File Format**: Supports .xlsx and .xls formats
- **Batch Processing**: Large files are processed in batches to prevent timeouts
- **Data Validation**: All data is validated before insertion
- **Rollback**: If any critical error occurs, the entire import is rolled back
- **Duplicate Handling**: Products with duplicate names will be skipped
- **Image URLs**: Must be valid HTTP/HTTPS URLs
- **Price Format**: Must be a valid number (decimal allowed)
- **Boolean Values**: Use 'true'/'false' or '1'/'0' for isActive field
- **Sheet Selection**: Only the first sheet in the Excel file will be processed

## Troubleshooting

### Common Issues

1. **"Invalid Excel format or empty file"**
   - Check if file is a valid Excel format (.xlsx or .xls)
   - Ensure the file is not corrupted
   - Make sure the first sheet contains data
   - Ensure headers are in the first row

2. **"Category/Brand/Color/Size not found"**
   - Verify codes exist in the database
   - Check for typos in codes
   - Ensure codes are in correct format

3. **"Invalid price format"**
   - Use numeric values only
   - Use decimal point (.) not comma (,)
   - Remove currency symbols

4. **"File too large"**
   - Split large files into smaller batches
   - Remove unnecessary columns
   - Compress images and use external hosting

### Best Practices

- Always download and use the provided template
- Test with a small batch first
- Keep backup of your original data
- Validate all codes before importing
- Use consistent formatting throughout the file
- Save Excel file in .xlsx format for best compatibility