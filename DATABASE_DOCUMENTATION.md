# Dokumentasi Database Design

## Overview
Database ini menggunakan PostgreSQL dengan Prisma ORM untuk mengelola data produk sepatu dalam aplikasi e-commerce. Database dirancang dengan struktur relasional yang mendukung manajemen produk, kategori, brand, warna, ukuran, dan gambar produk.

## Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Category   │       │   Product   │       │    Brand    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ id (PK)     │──────►│ id (PK)     │
│ code        │       │ code        │       │ code        │
│ name        │       │ name        │       │ name        │
└─────────────┘       │ description │       └─────────────┘
                      │ categoryId  │
                      │ brandId     │
                      │ price       │
                      │ isActive    │
                      │ createdAt   │
                      └─────────────┘
                             │
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ProductColor │    │ ProductSize │    │ProductImage │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ code        │    │ code        │    │ productId   │
│ productId   │    │ productId   │    │ colorId     │
│ colorName   │    │ sizeLabel   │    │ imageUrl    │
│ hexCode     │    │ cmValue     │    │ isPrimary   │
│ imageUrl    │    └─────────────┘    │ sortOrder   │
└─────────────┘                      └─────────────┘
       │                                     ▲
       └─────────────────────────────────────┘
```

## Struktur Tabel

### 1. Categories
**Tabel**: `categories`

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| code | STRING | UNIQUE | Kode kategori unik |
| name | STRING | NOT NULL | Nama kategori |

**Relasi**: One-to-Many dengan Product

### 2. Brands
**Tabel**: `brands`

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| code | STRING | UNIQUE | Kode brand unik |
| name | STRING | NOT NULL | Nama brand |

**Relasi**: One-to-Many dengan Product

### 3. Products
**Tabel**: `products`

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| code | STRING | UNIQUE | Kode produk unik |
| name | STRING | NOT NULL | Nama produk |
| description | STRING | NULLABLE | Deskripsi produk |
| categoryId | INT | FOREIGN KEY | Referensi ke categories.id |
| brandId | INT | FOREIGN KEY | Referensi ke brands.id |
| price | DECIMAL(10,2) | NOT NULL | Harga produk |
| isActive | BOOLEAN | DEFAULT true | Status aktif produk |
| createdAt | DATETIME | DEFAULT now() | Waktu pembuatan |

**Relasi**: 
- Many-to-One dengan Category
- Many-to-One dengan Brand
- One-to-Many dengan ProductColor
- One-to-Many dengan ProductSize
- One-to-Many dengan ProductImage

### 4. Product Colors
**Tabel**: `product_colors`

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| code | STRING | UNIQUE | Kode warna unik |
| productId | INT | FOREIGN KEY | Referensi ke products.id |
| colorName | STRING | NOT NULL | Nama warna |
| hexCode | STRING | NULLABLE | Kode hex warna |
| imageUrl | STRING | NULLABLE | URL gambar warna |

**Relasi**: 
- Many-to-One dengan Product
- One-to-Many dengan ProductImage

### 5. Product Sizes
**Tabel**: `product_sizes`

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| code | STRING | UNIQUE | Kode ukuran unik |
| productId | INT | FOREIGN KEY | Referensi ke products.id |
| sizeLabel | STRING | NOT NULL | Label ukuran (36, 37, dll) |
| cmValue | DECIMAL(4,1) | NULLABLE | Nilai dalam cm |

**Relasi**: Many-to-One dengan Product

### 6. Product Images
**Tabel**: `product_images`

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| productId | INT | FOREIGN KEY | Referensi ke products.id |
| colorId | INT | FOREIGN KEY, NULLABLE | Referensi ke product_colors.id |
| imageUrl | STRING | NOT NULL | URL gambar |
| isPrimary | BOOLEAN | DEFAULT false | Apakah gambar utama |
| sortOrder | INT | DEFAULT 0 | Urutan tampil gambar |

**Relasi**: 
- Many-to-One dengan Product
- Many-to-One dengan ProductColor (optional)

## Hirarki Data

```
E-Commerce Database
│
├── Master Data
│   ├── Categories
│   │   ├── Running Shoes
│   │   ├── Casual Shoes
│   │   ├── Formal Shoes
│   │   └── Sports Shoes
│   │
│   └── Brands
│       ├── Nike
│       ├── Adidas
│       ├── Puma
│       └── Vans
│
└── Product Data
    └── Products
        ├── Product A (Nike Air Max)
        │   ├── Basic Info
        │   │   ├── code: "NIKE-AM-001"
        │   │   ├── name: "Nike Air Max 270"
        │   │   ├── description: "Comfortable running shoes..."
        │   │   ├── price: 1299000
        │   │   └── isActive: true
        │   │
        │   ├── Colors
        │   │   ├── Color 1
        │   │   │   ├── colorName: "Blue/White"
        │   │   │   ├── hexCode: "#0066CC"
        │   │   │   └── imageUrl: "/images/blue-white.jpg"
        │   │   │
        │   │   └── Color 2
        │   │       ├── colorName: "Black/White"
        │   │       ├── hexCode: "#000000"
        │   │       └── imageUrl: "/images/black-white.jpg"
        │   │
        │   ├── Sizes
        │   │   ├── Size 1: { sizeLabel: "36", cmValue: 23.0 }
        │   │   ├── Size 2: { sizeLabel: "37", cmValue: 23.5 }
        │   │   ├── Size 3: { sizeLabel: "38", cmValue: 24.0 }
        │   │   └── ... (hingga size 44)
        │   │
        │   └── Images
        │       ├── Primary Image
        │       │   ├── imageUrl: "/images/nike-am-main.jpg"
        │       │   ├── isPrimary: true
        │       │   ├── sortOrder: 0
        │       │   └── colorId: null (general)
        │       │
        │       ├── Color-specific Images
        │       │   ├── Blue variant
        │       │   │   ├── imageUrl: "/images/nike-am-blue.jpg"
        │       │   │   ├── isPrimary: false
        │       │   │   ├── sortOrder: 1
        │       │   │   └── colorId: 1
        │       │   │
        │       │   └── Black variant
        │       │       ├── imageUrl: "/images/nike-am-black.jpg"
        │       │       ├── isPrimary: false
        │       │       ├── sortOrder: 2
        │       │       └── colorId: 2
        │       │
        │       └── Additional Images
        │           ├── Detail shot 1
        │           ├── Detail shot 2
        │           └── Side view
        │
        └── Product B (Adidas Ultraboost)
            └── ... (struktur serupa)
```

## Fitur Database

### 1. Cascade Delete
- Ketika Product dihapus, semua ProductColor, ProductSize, dan ProductImage terkait akan terhapus otomatis
- Ketika ProductColor dihapus, semua ProductImage yang terkait dengan warna tersebut akan terhapus

### 2. Indexing
- Primary keys pada semua tabel
- Unique constraints pada field `code` untuk memastikan tidak ada duplikasi
- Foreign key indexes untuk optimasi query relasional

### 3. Data Integrity
- Foreign key constraints memastikan referential integrity
- NOT NULL constraints pada field wajib
- Default values untuk field boolean dan timestamp

### 4. Flexibility
- ProductImage dapat dikaitkan dengan warna tertentu atau bersifat general (colorId nullable)
- Sistem sorting untuk mengatur urutan tampil gambar
- Support untuk multiple images per product dan per color

## Query Patterns

### Mengambil produk dengan semua relasi:
```sql
SELECT p.*, c.name as category_name, b.name as brand_name
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN brands b ON p.brand_id = b.id
WHERE p.is_active = true;
```

### Mengambil gambar produk berdasarkan warna:
```sql
SELECT pi.image_url, pi.is_primary, pi.sort_order
FROM product_images pi
LEFT JOIN product_colors pc ON pi.color_id = pc.id
WHERE pi.product_id = ? AND (pc.color_name = ? OR pi.color_id IS NULL)
ORDER BY pi.is_primary DESC, pi.sort_order ASC;
```

### Mengambil semua varian warna produk:
```sql
SELECT pc.color_name, pc.hex_code, pc.image_url
FROM product_colors pc
WHERE pc.product_id = ?
ORDER BY pc.color_name;
```

Database ini dirancang untuk mendukung aplikasi e-commerce sepatu dengan fleksibilitas tinggi dalam manajemen produk, warna, ukuran, dan gambar.