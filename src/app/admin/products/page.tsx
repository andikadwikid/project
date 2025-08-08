'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types/product'

interface ProductsResponse {
    success: boolean
    data: Product[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)

    const fetchProducts = async (page = 1, search = '') => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(search && { search })
            })

            const response = await fetch(`/api/products?${params}`)
            const data: ProductsResponse = await response.json()

            if (data.success) {
                setProducts(data.data)
                setTotalPages(data.pagination.totalPages)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (product: Product) => {
        try {
            const response = await fetch(`/api/products/${product.id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                await fetchProducts(currentPage, searchTerm)
                setDeleteDialogOpen(false)
                setProductToDelete(null)
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchProducts(1, searchTerm)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        fetchProducts(currentPage, searchTerm)
    }, [currentPage])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                                <p className="text-gray-600 mt-1">Manage your product catalog</p>
                            </div>
                        </div>
                        <Link href="/admin/products/new">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Product List</CardTitle>
                            <form onSubmit={handleSearch} className="flex space-x-2">
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64"
                                />
                                <Button type="submit" variant="outline">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading products...</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Brand</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Colors</TableHead>
                                            <TableHead>Sizes</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement
                                                            target.src = '/images/placeholder.svg'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{product.category}</Badge>
                                                </TableCell>
                                                <TableCell>{product.brand}</TableCell>
                                                <TableCell>${product.price}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        {product.colors?.slice(0, 3).map((color, index) => (
                                                            <div
                                                                key={color.id || index}
                                                                className="w-4 h-4 rounded-full border border-gray-200"
                                                                style={{ backgroundColor: color.hexCode }}
                                                                title={color.colorName}
                                                            />
                                                        ))}
                                                        {product.colors && product.colors.length > 3 && (
                                                            <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {product.sizes?.slice(0, 3).map((size, index) => (
                                                            <Badge key={size.id || index} variant="outline" className="text-xs">
                                                                {size.sizeLabel}
                                                            </Badge>
                                                        ))}
                                                        {product.sizes && product.sizes.length > 3 && (
                                                            <span className="text-xs text-gray-500">+{product.sizes.length - 3}</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setProductToDelete(product)
                                                                setDeleteDialogOpen(true)
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center space-x-2 mt-6">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <span className="flex items-center px-4 py-2 text-sm">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete &ldquo;{productToDelete?.name}&rdquo;? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => productToDelete && handleDelete(productToDelete)}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminProducts