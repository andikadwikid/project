# Panduan Ukuran Gambar Banner Promosi

## Rekomendasi Ukuran Banner Promosi

### Ukuran Optimal
- **Lebar**: 1200px - 1920px
- **Tinggi**: 400px - 600px
- **Aspect Ratio**: 16:9 atau 3:2
- **Format**: JPG atau PNG
- **Ukuran File**: Maksimal 500KB untuk performa optimal

### Detail Teknis Implementasi

Banner promosi ditampilkan dalam carousel dengan tinggi responsif:
- **Mobile**: 256px (h-64)
- **Tablet**: 320px (h-80) 
- **Desktop**: 384px (h-96)

Container menggunakan `object-cover` yang akan memotong gambar secara proporsional untuk mengisi area yang tersedia.

### Ukuran yang Disarankan

#### Standar (Recommended)
- **1200 x 600px** (2:1 ratio)
- Cocok untuk sebagian besar banner promosi
- Balance antara kualitas dan ukuran file

#### High Resolution
- **1920 x 960px** (2:1 ratio)
- Untuk banner dengan detail tinggi
- Pastikan optimasi file untuk web

#### Alternative
- **1200 x 400px** (3:1 ratio)
- Untuk banner dengan fokus horizontal
- Cocok untuk banner dengan teks panjang

### Panduan Desain

#### Area Aman (Safe Zone)
- Pastikan elemen penting (teks, logo, CTA) berada di tengah gambar
- Hindari menempatkan konten penting di tepi karena akan terpotong pada device tertentu
- Gunakan margin 10% dari setiap sisi sebagai safe zone

#### Kontras dan Keterbacaan
- Gunakan kontras yang baik antara teks dan background
- Pastikan teks tetap terbaca di semua ukuran device
- Gunakan shadow atau overlay jika diperlukan

#### Resolusi dan Kualitas
- Gunakan gambar beresolusi tinggi untuk tampilan crisp
- Minimum 72 DPI untuk web
- Hindari gambar pixelated atau blur

### Optimasi File

#### Kompresi
- **JPG**: Untuk foto dengan banyak warna (quality 80-90%)
- **PNG**: Untuk gambar dengan transparansi atau sedikit warna
- **WebP**: Format modern dengan kompresi lebih baik (jika didukung)

#### Tools Optimasi
- TinyPNG/TinyJPG untuk kompresi online
- ImageOptim untuk Mac
- Squoosh.app untuk kompresi advanced

#### Target Ukuran File
- **Optimal**: < 200KB
- **Maksimal**: < 500KB
- **Critical**: Jangan melebihi 1MB

### Checklist Sebelum Upload

- [ ] Ukuran gambar sesuai rekomendasi (1200x600px atau 1920x960px)
- [ ] Aspect ratio 2:1 atau 3:2
- [ ] Ukuran file < 500KB
- [ ] Konten penting berada di safe zone
- [ ] Kontras teks cukup baik
- [ ] Gambar tidak pixelated
- [ ] Format file JPG atau PNG
- [ ] Nama file deskriptif (contoh: promo-summer-sale-2024.jpg)

### Contoh Implementasi

```tsx
// Banner ditampilkan dengan struktur berikut:
<div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
  <Image
    src={banner.imageUrl}
    alt={banner.title}
    fill
    className="object-cover"
    priority={index === 0}
  />
</div>
```

### Tips Tambahan

1. **Konsistensi Brand**: Gunakan palet warna dan font yang konsisten dengan brand
2. **Mobile First**: Pastikan banner tetap efektif di mobile device
3. **Loading Speed**: Prioritaskan kecepatan loading dengan optimasi gambar
4. **A/B Testing**: Test berbagai desain untuk performa terbaik
5. **Accessibility**: Gunakan alt text yang deskriptif

### Troubleshooting

#### Gambar Terpotong
- Periksa aspect ratio gambar
- Pastikan konten penting di tengah
- Gunakan safe zone guidelines

#### Loading Lambat
- Kompres gambar lebih agresif
- Gunakan format WebP jika memungkinkan
- Implementasikan lazy loading

#### Kualitas Buruk
- Gunakan gambar sumber beresolusi lebih tinggi
- Kurangi kompresi
- Periksa format file yang digunakan

---

**Catatan**: Panduan ini dibuat berdasarkan implementasi carousel banner di `/src/app/promo/page.tsx`. Update panduan ini jika ada perubahan pada implementasi UI.