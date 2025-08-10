'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Product {
    id: number
    name: string
    price: number
    category: {
        name: string
    }
    brand: {
        name: string
    }
}

interface FormData {
    title: string
    description: string
    discountType: string
    discountValue: string
    startDate: string
    endDate: string
    isActive: boolean
    productIds: number[]
}

export default function NewPromotionPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: '',
        endDate: '',
        isActive: true,
        productIds: []
    })
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setIsLoadingProducts(true)
            const response = await fetch('/api/admin/products?limit=1000')
            if (response.ok) {
                const result = await response.json()
                if (result.success && result.data && result.data.products) {
                    setProducts(result.data.products)
                } else {
                    setProducts([])
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            setProducts([])
        } finally {
            setIsLoadingProducts(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/admin/promotions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push('/admin/promotions')
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to create promotion')
            }
        } catch (error) {
            console.error('Error creating promotion:', error)
            alert('Failed to create promotion')
        } finally {
            setIsLoading(false)
        }
    }

    const handleProductToggle = (productId: number) => {
        setFormData(prev => ({
            ...prev,
            productIds: prev.productIds.includes(productId)
                ? prev.productIds.filter(id => id !== productId)
                : [...prev.productIds, productId]
        }))
    }

    const filteredProducts = (products || []).filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/promotions">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Promotions
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Add New Promotion</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter promotion title"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter promotion description"
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => 
                                        setFormData({ ...formData, isActive: checked as boolean })
                                    }
                                />
                                <Label htmlFor="isActive">Active Promotion</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Discount Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Discount Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="discountType">Discount Type *</Label>
                                <Select
                                    value={formData.discountType}
                                    onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount (IDR)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="discountValue">
                                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(IDR)'}
                                </Label>
                                <Input
                                    id="discountValue"
                                    type="number"
                                    step={formData.discountType === 'percentage' ? '0.01' : '1'}
                                    min="0"
                                    max={formData.discountType === 'percentage' ? '100' : undefined}
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    placeholder={formData.discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="startDate">Start Date *</Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="endDate">End Date *</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Product Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Select Products 
                            {formData.productIds.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {formData.productIds.length} selected
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {isLoadingProducts ? (
                                <div className="text-center py-8">
                                    <p>Loading products...</p>
                                </div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <Checkbox
                                                id={`product-${product.id}`}
                                                checked={formData.productIds.includes(product.id)}
                                                onCheckedChange={() => handleProductToggle(product.id)}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {product.category.name} • {product.brand.name} • {formatCurrency(product.price)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Creating...' : 'Create Promotion'}
                    </Button>
                </div>
            </form>
        </div>
    )
}