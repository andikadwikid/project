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
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/ui/file-upload'

interface Category {
  id: number
  name: string
  code: string
}

interface Brand {
  id: number
  name: string
  code: string
}

interface Color {
  id: number
  name: string
  hexCode: string
  code: string
}

interface Size {
  id: number
  sizeLabel: string
  code: string
  cmValue?: number
}

interface SizeTemplateItem {
  id: number
  sizeId: number
  cmValue: number
  sortOrder: number
  size: {
    id: number
    sizeLabel: string
  }
}

interface SizeTemplate {
  id: number
  name: string
  description?: string
  templateSizes: SizeTemplateItem[]
}

const NewProduct = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [sizeTemplates, setSizeTemplates] = useState<SizeTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

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

  // Remove newImageUrl state as we'll use FileUpload component

  // Fetch categories, brands, colors, sizes, and templates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes, colorsRes, sizesRes, templatesRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
          fetch('/api/colors'),
          fetch('/api/sizes'),
          fetch('/api/size-templates')
        ])

        const [categoriesData, brandsData, colorsData, sizesData, templatesData] = await Promise.all([
          categoriesRes.json(),
          brandsRes.json(),
          colorsRes.json(),
          sizesRes.json(),
          templatesRes.json()
        ])

        if (categoriesData.success) setCategories(categoriesData.data)
        if (brandsData.success) setBrands(brandsData.data)
        if (colorsData.success) setColors(colorsData.data)
        if (sizesData.success) setSizes(sizesData.data)
        if (templatesData.success) setSizeTemplates(templatesData.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Apply size template
  const applyTemplate = (templateId: string) => {
    if (!templateId || templateId === 'none') {
      setSelectedTemplate('')
      return
    }

    const template = sizeTemplates.find(t => t.id.toString() === templateId)
    if (!template) return

    // Find matching sizes and set their cm values
    const newSelectedSizes: { id: number; cmValue?: number }[] = []
    
    template.templateSizes.forEach(templateSize => {
      const matchingSize = sizes.find(s => s.id === templateSize.sizeId)
      
      if (matchingSize) {
        newSelectedSizes.push({
          id: matchingSize.id,
          cmValue: templateSize.cmValue
        })
      }
    })

    setFormData(prev => ({
      ...prev,
      selectedSizes: newSelectedSizes
    }))
    
    setSelectedTemplate(templateId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
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

      const result = await response.json()

      if (response.ok && result.success) {
        alert('Product created successfully!')
        router.push('/admin/products')
      } else {
        alert(`Error creating product: ${result.error || 'Unknown error'}`)
        console.error('Error creating product:', result)
      }
    } catch (error) {
      alert('Network error occurred while creating product')
      console.error('Error creating product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: urls
    }))
  }

  const toggleColor = (colorId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorId)
        ? prev.selectedColors.filter(id => id !== colorId)
        : [...prev.selectedColors, colorId]
    }))
  }

  const toggleSize = (sizeId: number) => {
    const size = sizes.find(s => s.id === sizeId)
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
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-600 mt-1">Create a new product for your catalog</p>
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
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
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
                  <Select value={formData.brandId} onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value }))}>
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
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.selectedColors.includes(color.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => toggleColor(color.id)}
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
              {/* Size Template Selector */}
              <div className="mb-6 space-y-2">
                <Label>Size Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={applyTemplate}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a size template to auto-fill sizes and CM values" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template - Manual selection</SelectItem>
                    {sizeTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name} ({template.templateSizes.length} sizes)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-sm text-gray-600">
                    Template applied! You can still manually adjust sizes and CM values below.
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {sizes.map((size) => {
                  const isSelected = formData.selectedSizes.some(s => s.id === size.id)
                  return (
                    <div
                      key={size.id}
                      className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleSize(size.id)}
                    >
                      <span className="text-sm font-medium">{size.sizeLabel}</span>
                    </div>
                  )
                })}
              </div>
              
              {/* CM Value inputs for selected sizes */}
              {formData.selectedSizes.length > 0 && (
                <div className="mt-6 space-y-4">
                  <Label className="text-sm font-medium">Size CM Values (Optional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.selectedSizes.map((selectedSize) => {
                      const size = sizes.find(s => s.id === selectedSize.id)
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
            <CardContent>
              <FileUpload
                onUpload={handleImageUpload}
                existingImages={formData.images}
                maxFiles={10}
                folder="products"
              />
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewProduct