# Product CRUD Documentation

## Overview
Dokumentasi lengkap untuk fungsionalitas CRUD (Create, Read, Update, Delete) produk dalam sistem admin.

## Struktur Database

### Tabel Utama
- **Products**: Tabel utama produk
- **Categories**: Kategori produk
- **Brands**: Merek produk
- **ProductColors**: Warna produk
- **ProductSizes**: Ukuran produk
- **ProductImages**: Gambar produk

### Relasi
- Product → Category (Many-to-One)
- Product → Brand (Many-to-One)
- Product → ProductColors (One-to-Many)
- Product → ProductSizes (One-to-Many)
- Product → ProductImages (One-to-Many)

## API Endpoints

### Products
- `GET /api/products` - Mengambil daftar produk dengan filter dan paginasi
- `POST /api/products` - Membuat produk baru
- `GET /api/products/[id]` - Mengambil detail produk
- `PUT /api/products/[id]` - Memperbarui produk
- `DELETE /api/products/[id]` - Menghapus produk (soft delete)

### Master Data
- `GET /api/categories` - Mengambil daftar kategori
- `POST /api/categories` - Membuat kategori baru
- `GET /api/brands` - Mengambil daftar merek
- `POST /api/brands` - Membuat merek baru
- `GET /api/colors` - Mengambil daftar warna
- `POST /api/colors` - Membuat warna baru
- `GET /api/sizes` - Mengambil daftar ukuran
- `POST /api/sizes` - Membuat ukuran baru

## Halaman Admin

### 1. Daftar Produk (`/admin/products`)
**Fitur:**
- Menampilkan tabel produk dengan informasi lengkap
- Pencarian produk berdasarkan nama
- Paginasi untuk navigasi data
- Tombol Edit dan Delete untuk setiap produk
- Tombol "Add Product" untuk membuat produk baru

**Komponen:**
- Tabel responsif dengan kolom: Image, Name, Category, Brand, Price, Colors, Sizes, Actions
- Search input dengan debouncing
- Pagination controls
- Delete confirmation dialog

### 2. Tambah Produk (`/admin/products/new`)
**Fitur:**
- Form untuk membuat produk baru
- Dropdown untuk kategori dan merek
- Multi-select untuk warna dan ukuran
- Input untuk multiple gambar
- Validasi form lengkap

**Field Form:**
- Nama produk (required)
- Deskripsi produk
- Harga (required)
- Kategori (required)
- Merek (required)
- Warna (multiple selection)
- Ukuran (multiple selection)
- Gambar (multiple URLs)
- Status aktif (checkbox)

### 3. Edit Produk (`/admin/products/[id]/edit`)
**Fitur:**
- Form pre-filled dengan data produk existing
- Semua field dapat diubah
- Validasi form yang sama dengan create
- Tombol Save dan Cancel

**Fungsionalitas:**
- Mengambil data produk existing saat load
- Update semua relasi (colors, sizes, images)
- Menggunakan transaksi database untuk konsistensi

## Implementasi TypeScript

### Types dan Interfaces
```typescript
interface Product {
  id: string | number
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: ProductImage[]
  category: string
  brand: string
  description: string
  sizes?: ProductSize[]
  colors?: ProductColor[]
  isNew?: boolean
  isSale?: boolean
  rating?: number
  reviews?: number
}

interface ProductColor {
  id: number
  code: string
  colorName: string
  hexCode: string
  imageUrl?: string
}

interface ProductSize {
  id: number
  code: string
  sizeLabel: string
  cmValue?: number
}
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

## Fitur Keamanan

### Validasi Input
- Validasi required fields
- Validasi format data (email, URL, number)
- Sanitasi input untuk mencegah XSS
- Validasi foreign key constraints

### Error Handling
- Try-catch blocks di semua API endpoints
- Error messages yang informatif
- HTTP status codes yang sesuai
- Logging error untuk debugging

## Optimisasi Performance

### Database
- Menggunakan transaksi untuk operasi kompleks
- Indexing pada kolom yang sering di-query
- Lazy loading untuk relasi yang tidak selalu dibutuhkan
- Pagination untuk menghindari load data berlebihan

### Frontend
- Debouncing untuk search input
- Loading states untuk UX yang lebih baik
- Optimistic updates untuk responsivitas
- Caching data master (categories, brands, etc.)

## Testing

### Manual Testing Checklist
- [ ] Create product dengan semua field
- [ ] Create product dengan field minimal
- [ ] Update product existing
- [ ] Delete product
- [ ] Search dan filter produk
- [ ] Pagination navigation
- [ ] Form validation
- [ ] Error handling

### API Testing
- [ ] Test semua endpoints dengan Postman/curl
- [ ] Test dengan data valid dan invalid
- [ ] Test error scenarios
- [ ] Test pagination dan filtering

## Deployment Notes

### Environment Variables
- `DATABASE_URL` - Connection string untuk database
- `NEXTAUTH_SECRET` - Secret untuk authentication
- `NEXTAUTH_URL` - Base URL aplikasi

### Database Migration
- Pastikan semua migration sudah dijalankan
- Seed data untuk categories, brands, colors, sizes
- Backup database sebelum deployment

## Future Enhancements

### Planned Features
1. **Image Upload**: Implementasi upload gambar ke cloud storage
2. **Bulk Operations**: Import/export produk via CSV
3. **Product Variants**: Sistem variant yang lebih kompleks
4. **Inventory Management**: Tracking stock dan inventory
5. **Product Reviews**: Sistem review dan rating
6. **SEO Optimization**: Meta tags dan URL optimization

### Technical Improvements
1. **Caching**: Implementasi Redis untuk caching
2. **Search**: Full-text search dengan Elasticsearch
3. **Analytics**: Product performance tracking
4. **Audit Log**: Track semua perubahan data

## Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL dan network connectivity
2. **Foreign Key Errors**: Pastikan master data (categories, brands) sudah ada
3. **Image Loading**: Check image URLs dan CORS settings
4. **Performance**: Monitor query performance dan add indexing jika perlu

### Debug Tips
- Check browser console untuk client-side errors
- Check server logs untuk API errors
- Use Prisma Studio untuk inspect database
- Test API endpoints secara terpisah

## Conclusion

Sistem CRUD produk telah diimplementasikan dengan lengkap menggunakan:
- **Next.js 14** dengan App Router
- **TypeScript** untuk type safety
- **Prisma** sebagai ORM
- **Tailwind CSS** untuk styling
- **Shadcn/ui** untuk komponen UI

Semua fungsionalitas dasar CRUD telah berfungsi dengan baik dan siap untuk penggunaan production dengan beberapa enhancement yang direncanakan untuk masa depan.