'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { FileUpload } from '@/components/ui/file-upload'

import { AdminCategory, AdminBrand, AdminColor, AdminSize, SizeTemplate, AdminProductImage, AdminProductData } from '@/types/admin';

type Category = AdminCategory;
type Brand = AdminBrand;
type Color = AdminColor;
type Size = AdminSize;
type ProductImage = AdminProductImage;
type ProductData = AdminProductData;

const EditProduct = () => {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [availableColors, setAvailableColors] = useState<Color[]>([])
  const [availableSizes, setAvailableSizes] = useState<Size[]>([])
  const [sizeTemplates, setSizeTemplates] = useState<SizeTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [product, setProduct] = useState<ProductData | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    brandId: '',
    selectedColors: [] as number[],
    selectedSizes: [] as { id: number; cmValue?: number }[],
    images: [] as string[],
    isActive: true
  })



  // Fetch product data and master data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes, brandsRes, colorsRes, sizesRes, templatesRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch('/api/categories'),
          fetch('/api/brands'),
          fetch('/api/colors'),
          fetch('/api/sizes'),
          fetch('/api/size-templates')
        ])

        const [productData, categoriesData, brandsData, colorsData, sizesData, templatesData] = await Promise.all([
          productRes.json(),
          categoriesRes.json(),
          brandsRes.json(),
          colorsRes.json(),
          sizesRes.json(),
          templatesRes.json()
        ])

        if (productData.success) {
          const prod = productData.data
          setProduct(prod)
          setFormData({
            name: prod.name,
            description: prod.description || '',
            price: prod.price.toString(),
            categoryId: prod.categoryId.toString(),
            brandId: prod.brandId.toString(),
            selectedColors: prod.colors.map((c: Color) => c.id),
            selectedSizes: prod.sizes.map((s: Size) => ({ id: s.id, cmValue: s.cmValue })),
            images: prod.images.map((img: ProductImage) => img.imageUrl),
            isActive: prod.isActive
          })
        }
        
        if (categoriesData.success) setCategories(categoriesData.data)
        if (brandsData.success) setBrands(brandsData.data)
        if (colorsData.success) setAvailableColors(colorsData.data)
        if (sizesData.success) setAvailableSizes(sizesData.data)
        if (templatesData.success) setSizeTemplates(templatesData.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          categoryId: parseInt(formData.categoryId),
          brandId: parseInt(formData.brandId),
          colorIds: formData.selectedColors,
          sizes: formData.selectedSizes,
          images: formData.images,
          isActive: formData.isActive
        })
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const errorData = await response.json()
        console.error('Error updating product:', errorData.error)
        alert(`Error updating product: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert(`Error updating product: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleColorToggle = (colorId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorId)
        ? prev.selectedColors.filter(id => id !== colorId)
        : [...prev.selectedColors, colorId]
    }))
  }

  const handleSizeToggle = (sizeId: number) => {
    const size = availableSizes.find(s => s.id === sizeId)
    setFormData(prev => {
      const isSelected = prev.selectedSizes.some(s => s.id === sizeId)
      if (isSelected) {
        return {
          ...prev,
          selectedSizes: prev.selectedSizes.filter(s => s.id !== sizeId)
        }
      } else {
        return {
          ...prev,
          selectedSizes: [...prev.selectedSizes, { id: sizeId, cmValue: size?.cmValue }]
        }
      }
    })
  }

  const handleSizeCmValueChange = (sizeId: number, cmValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.map(s => 
        s.id === sizeId ? { ...s, cmValue: cmValue ? parseFloat(cmValue) : undefined } : s
      )
    }))
  }

  const applyTemplate = (templateId: string) => {
    if (!templateId || templateId === 'none') return
    
    const template = sizeTemplates.find(t => t.id.toString() === templateId)
    if (!template) return

    // Update selected sizes with template values
    const updatedSizes = formData.selectedSizes.map(selectedSize => {
      const templateItem = template.templateSizes.find(item => item.sizeId === selectedSize.id)
      if (templateItem) {
        return { ...selectedSize, cmValue: templateItem.cmValue }
      }
      return selectedSize
    })

    setFormData(prev => ({
      ...prev,
      selectedSizes: updatedSizes
    }))
  }

  const handleImageUpload = (uploadedUrls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Link href="/admin/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-1">Update product information</p>
                <Badge variant="outline" className="mt-2">{product.code}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select
                    value={formData.brandId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                />
                <Label htmlFor="isActive">Active Product</Label>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableColors.map((color) => (
                  <div
                    key={color.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.selectedColors.includes(color.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleColorToggle(color.id)}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="text-sm font-medium">{color.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Available Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {availableSizes.map((size) => {
                  const isSelected = formData.selectedSizes.some(s => s.id === size.id)
                  return (
                    <div
                      key={size.id}
                      className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSizeToggle(size.id)}
                    >
                      <span className="text-sm font-medium">{size.sizeLabel}</span>
                    </div>
                  )
                })}
              </div>
              
              {/* Size Template Dropdown */}
              {formData.selectedSizes.length > 0 && sizeTemplates.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Apply Size Template (Optional)</Label>
                    <Select
                      value={selectedTemplate}
                      onValueChange={(value) => {
                        setSelectedTemplate(value)
                        applyTemplate(value)
                      }}
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue placeholder="Select a size template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No template</SelectItem>
                        {sizeTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedTemplate && (
                      <p className="text-xs text-gray-500">
                        Template applied! CM values have been updated for matching sizes.
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* CM Value inputs for selected sizes */}
              {formData.selectedSizes.length > 0 && (
                <div className="mt-6 space-y-4">
                  <Label className="text-sm font-medium">Size CM Values (Optional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.selectedSizes.map((selectedSize) => {
                      const size = availableSizes.find(s => s.id === selectedSize.id)
                      return (
                        <div key={selectedSize.id} className="space-y-2">
                          <Label className="text-xs text-gray-600">{size?.sizeLabel}</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder={`Default: ${size?.cmValue || 'N/A'}`}
                            value={selectedSize.cmValue || ''}
                            onChange={(e) => handleSizeCmValueChange(selectedSize.id, e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                onUpload={handleImageUpload}
                maxFiles={10}
                folder="products"
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
              />
              
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Images:</Label>
                  <div className="space-y-2">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <Image
                          src={imageUrl || '/images/placeholder.svg'}
                          alt={`Product image ${index + 1}`}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder.svg'
                          }}
                        />
                        <span className="flex-1 text-sm text-gray-600 truncate">{imageUrl}</span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct