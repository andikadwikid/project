import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
import AdmZip from 'adm-zip'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Using @types/adm-zip for type definitions

interface ExcelRow {
  name: string
  code: string
  description?: string
  categoryCode: string
  brandCode: string
  price: string
  colorCodes?: string // comma-separated color codes
  sizeCodes?: string // comma-separated size codes
  imageUrls?: string // comma-separated image filenames from ZIP
  isActive?: string
}

interface ProcessedImage {
  filename: string
  url: string
  buffer: Buffer
}

// Function to extract and process images from ZIP file
async function extractImagesFromZip(
  zipBuffer: Buffer
): Promise<{ images: ProcessedImage[], imageMap: Map<string, string> }> {
  const images: ProcessedImage[] = []
  const imageMap = new Map<string, string>() // filename -> public URL
  
  // Create upload directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
  
  try {
    const zip = new AdmZip(zipBuffer)
    const zipEntries = zip.getEntries()
    
    for (const entry of zipEntries) {
      // Skip directories and non-image files
      if (entry.isDirectory) continue
      
      const filename = entry.entryName
      const extension = filename.toLowerCase().split('.').pop()
      
      // Check if file is an image
      if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        continue
      }
      
      // Generate unique filename for storage
      const timestamp = Date.now()
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      const storedFilename = `${timestamp}-${randomSuffix}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = join(uploadDir, storedFilename)
      const publicUrl = `/uploads/products/${storedFilename}`
      
      // Extract and save image
      const imageBuffer = entry.getData()
      await writeFile(filePath, imageBuffer)
      
      const processedImage: ProcessedImage = {
        filename: storedFilename,
        url: publicUrl,
        buffer: imageBuffer
      }
      
      images.push(processedImage)
      
      // Map original filename to public URL
      imageMap.set(filename, publicUrl)
      
      // Also map filename without path (in case Excel references just the filename)
      const baseFilename = filename.split('/').pop() || filename
      imageMap.set(baseFilename, publicUrl)
    }
  } catch (error) {
    console.error('Error extracting ZIP file:', error)
    throw new Error('Failed to extract ZIP file')
  }
  
  return { images, imageMap }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const excelFile = formData.get('excelFile') as File
    const zipFile = formData.get('zipFile') as File

    // Validate Excel file
    if (!excelFile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Excel file is required',
        },
        { status: 400 }
      )
    }

    if (!excelFile.name.endsWith('.xlsx') && !excelFile.name.endsWith('.xls')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Excel file must be .xlsx or .xls format',
        },
        { status: 400 }
      )
    }

    // Validate ZIP file (optional)
    let imageMap = new Map<string, string>()
    if (zipFile) {
      if (!zipFile.name.endsWith('.zip')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Image file must be .zip format',
          },
          { status: 400 }
        )
      }

      // Extract images from ZIP
      const zipBuffer = Buffer.from(await zipFile.arrayBuffer())
      const { images, imageMap: extractedImageMap } = await extractImagesFromZip(zipBuffer)
      imageMap = extractedImageMap
      
      console.log(`Extracted ${images.length} images from ZIP file`)
    }

    // Read and parse Excel file
    const excelBuffer = await excelFile.arrayBuffer()
    const workbook = XLSX.read(excelBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    if (!worksheet) {
      return NextResponse.json(
        {
          success: false,
          error: 'No worksheet found in Excel file',
        },
        { status: 400 }
      )
    }

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    if (rawData.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Excel file must contain at least a header row and one data row',
        },
        { status: 400 }
      )
    }

    // Get headers and convert to objects
    const headers = rawData[0] as string[]
    const records: ExcelRow[] = []
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i] as (string | number | boolean)[]
      const record: Partial<ExcelRow> = {}
      
      headers.forEach((header, index) => {
        const value = String(row[index] || '')
        switch (header) {
          case 'name':
            record.name = value
            break
          case 'code':
            record.code = value
            break
          case 'description':
            record.description = value
            break
          case 'categoryCode':
            record.categoryCode = value
            break
          case 'brandCode':
            record.brandCode = value
            break
          case 'price':
            record.price = value
            break
          case 'colorCodes':
            record.colorCodes = value
            break
          case 'sizeCodes':
            record.sizeCodes = value
            break
          case 'imageUrls':
            record.imageUrls = value
            break
          case 'isActive':
            record.isActive = value
            break
        }
      })
      
      // Only push if required fields are present
      if (record.name && record.code && record.categoryCode && record.brandCode && record.price) {
        records.push(record as ExcelRow)
      }
    }

    // Process each product
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const rowNumber = i + 2 // Excel row number (1-indexed + header)
      
      try {
        // Validate required fields
        if (!row.name || !row.code || !row.categoryCode || !row.brandCode || !row.price) {
          throw new Error(`Row ${rowNumber}: Missing required fields (name, code, categoryCode, brandCode, price)`)
        }

        // Validate product code is unique
        const existingProduct = await prisma.product.findUnique({
          where: { code: row.code }
        })
        if (existingProduct) {
          throw new Error(`Row ${rowNumber}: Product code '${row.code}' already exists`)
        }

        // Validate category exists
        const category = await prisma.category.findUnique({
          where: { code: row.categoryCode }
        })
        if (!category) {
          throw new Error(`Row ${rowNumber}: Category '${row.categoryCode}' not found`)
        }

        // Validate brand exists
        const brand = await prisma.brand.findUnique({
          where: { code: row.brandCode }
        })
        if (!brand) {
          throw new Error(`Row ${rowNumber}: Brand '${row.brandCode}' not found`)
        }

        // Validate and parse price
        const price = parseFloat(row.price)
        if (isNaN(price) || price < 0) {
          throw new Error(`Row ${rowNumber}: Invalid price '${row.price}'`)
        }

        // Validate colors if provided
        const validColors: { id: number; code: string; name: string; hexCode: string | null }[] = []
        if (row.colorCodes && row.colorCodes.trim()) {
          const colorCodes = row.colorCodes.split(',').map(code => code.trim()).filter(code => code)
          
          for (const colorCode of colorCodes) {
            const color = await prisma.color.findUnique({
              where: { code: colorCode }
            })
            if (!color) {
              throw new Error(`Row ${rowNumber}: Color '${colorCode}' not found`)
            }
            validColors.push(color)
          }
        }

        // Validate sizes if provided
        const validSizes: { id: number; code: string; sizeLabel: string }[] = []
        if (row.sizeCodes && row.sizeCodes.trim()) {
          const sizeCodes = row.sizeCodes.split(',').map(code => code.trim()).filter(code => code)
          
          for (const sizeCode of sizeCodes) {
            const size = await prisma.size.findUnique({
              where: { code: sizeCode }
            })
            if (!size) {
              throw new Error(`Row ${rowNumber}: Size '${sizeCode}' not found`)
            }
            validSizes.push(size)
          }
        }

        // Parse isActive
        const isActive = row.isActive ? row.isActive.toLowerCase() === 'true' : true

        // Create product
        const product = await prisma.product.create({
          data: {
            name: row.name,
            code: row.code,
            description: row.description || '',
            price: price,
            categoryId: category.id,
            brandId: brand.id,
            isActive: isActive
          }
        })

        // Create product colors
        if (validColors.length > 0) {
          for (const color of validColors) {
            await prisma.productColor.create({
              data: {
                productId: product.id,
                colorId: color.id
              }
            })
          }
        }

        // Create product sizes
        if (validSizes.length > 0) {
          for (const size of validSizes) {
            await prisma.productSizePivot.create({
              data: {
                productId: product.id,
                sizeId: size.id
              }
            })
          }
        }

        // Process images - prioritize ZIP images, fallback to URLs
        const allImageUrls: string[] = []
        
        // First, try to match images from ZIP
        if (row.imageUrls && row.imageUrls.trim()) {
          const imageFilenames = row.imageUrls.split(',').map(filename => filename.trim()).filter(filename => filename)
          
          for (const filename of imageFilenames) {
            const mappedUrl = imageMap.get(filename)
            if (mappedUrl) {
              allImageUrls.push(mappedUrl)
            } else {
              // If not found in ZIP, treat as external URL
              if (filename.startsWith('http://') || filename.startsWith('https://')) {
                allImageUrls.push(filename)
              } else {
                console.warn(`Row ${rowNumber}: Image '${filename}' not found in ZIP file`)
              }
            }
          }
        }
        
        // Create product images
        if (allImageUrls.length > 0) {
          for (let j = 0; j < allImageUrls.length; j++) {
            await prisma.productImage.create({
              data: {
                productId: product.id,
                imageUrl: allImageUrls[j],
                isPrimary: j === 0,
                sortOrder: j + 1
              }
            })
          }
        }

        results.success++
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : `Row ${rowNumber}: Unknown error`
        results.errors.push(errorMessage)
        console.error(`Import error for row ${rowNumber}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.success} products imported successfully, ${results.failed} failed.`,
      results: results
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}