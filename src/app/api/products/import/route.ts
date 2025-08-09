import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

interface ExcelRow {
  name: string
  description?: string
  categoryCode: string
  brandCode: string
  price: string
  colorCodes?: string // comma-separated color codes
  sizeCodes?: string // comma-separated size codes
  imageUrls?: string // comma-separated image URLs
  isActive?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      )
    }

    // Check if file is Excel
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        {
          success: false,
          error: 'File must be an Excel file (.xlsx or .xls)',
        },
        { status: 400 }
      )
    }

    // Read file content
    const fileBuffer = await file.arrayBuffer()
    
    // Parse Excel
    let records: ExcelRow[]
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: ''
      }) as string[][]
      
      // Convert array format to object format
      if (rawData.length === 0) {
        throw new Error('Empty sheet')
      }
      
      const headers = rawData[0]
      const dataRows = rawData.slice(1)
      
      records = dataRows.map(row => {
        const obj: Partial<ExcelRow> = {}
        headers.forEach((header, index) => {
          (obj as Record<string, string>)[header] = (row[index] || '').toString()
        })
        return obj as ExcelRow
      })
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Excel format or empty file',
        },
        { status: 400 }
      )
    }

    if (records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSV file is empty',
        },
        { status: 400 }
      )
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each row
    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const rowNumber = i + 2 // +2 because CSV starts from row 1 and we skip header

      try {
        // Validate required fields
        if (!row.name || !row.categoryCode || !row.brandCode || !row.price) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Missing required fields (name, categoryCode, brandCode, price)`)
          continue
        }

        // Validate price
        const price = parseFloat(row.price)
        if (isNaN(price) || price <= 0) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Invalid price value`)
          continue
        }

        // Find category
        const category = await prisma.category.findUnique({
          where: { code: row.categoryCode }
        })
        if (!category) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Category with code '${row.categoryCode}' not found`)
          continue
        }

        // Find brand
        const brand = await prisma.brand.findUnique({
          where: { code: row.brandCode }
        })
        if (!brand) {
          results.failed++
          results.errors.push(`Row ${rowNumber}: Brand with code '${row.brandCode}' not found`)
          continue
        }

        // Generate product code
        const productCount = await prisma.product.count()
        const productCode = `PRD-${String(productCount + 1).padStart(3, '0')}`

        // Create product
        const product = await prisma.product.create({
          data: {
            code: productCode,
            name: row.name,
            description: row.description || null,
            categoryId: category.id,
            brandId: brand.id,
            price: price,
            isActive: row.isActive ? row.isActive.toLowerCase() === 'true' : true
          }
        })

        // Process colors if provided
        if (row.colorCodes && row.colorCodes.trim()) {
          const colorCodes = row.colorCodes.split(',').map(code => code.trim()).filter(code => code)
          
          for (const colorCode of colorCodes) {
            const color = await prisma.color.findUnique({
              where: { code: colorCode }
            })
            
            if (color) {
              await prisma.productColor.create({
                data: {
                  productId: product.id,
                  colorId: color.id
                }
              })
            } else {
              results.errors.push(`Row ${rowNumber}: Color with code '${colorCode}' not found`)
            }
          }
        }

        // Process sizes if provided
        if (row.sizeCodes && row.sizeCodes.trim()) {
          const sizeCodes = row.sizeCodes.split(',').map(code => code.trim()).filter(code => code)
          
          for (const sizeCode of sizeCodes) {
            const size = await prisma.size.findUnique({
              where: { code: sizeCode }
            })
            
            if (size) {
              await prisma.productSizePivot.create({
                data: {
                  productId: product.id,
                  sizeId: size.id
                }
              })
            } else {
              results.errors.push(`Row ${rowNumber}: Size with code '${sizeCode}' not found`)
            }
          }
        }

        // Process images if provided
        if (row.imageUrls && row.imageUrls.trim()) {
          const imageUrls = row.imageUrls.split(',').map(url => url.trim()).filter(url => url)
          
          for (let j = 0; j < imageUrls.length; j++) {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                imageUrl: imageUrls[j],
                isPrimary: j === 0,
                sortOrder: j + 1
              }
            })
          }
        }

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalRows: records.length,
        successCount: results.success,
        failedCount: results.failed,
        errors: results.errors
      }
    })
  } catch (error) {
    console.error('Error importing products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to import products',
      },
      { status: 500 }
    )
  }
}