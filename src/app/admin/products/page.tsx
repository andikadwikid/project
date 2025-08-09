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
import { Plus, Edit, Trash2, Search, ArrowLeft, Upload, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)
    const [importing, setImporting] = useState(false)
    const [importResult, setImportResult] = useState<{
        success: boolean;
        data?: {
            totalRows: number;
            successCount: number;
            failedCount: number;
            errors: string[];
        };
        error?: string;
    } | null>(null)

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

    const handleImport = async () => {
        if (!importFile) return

        try {
            setImporting(true)
            const formData = new FormData()
            formData.append('file', importFile)

            const response = await fetch('/api/products/import', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()
            setImportResult(result)

            if (result.success) {
                await fetchProducts(currentPage, searchTerm)
            }
        } catch (error) {
            console.error('Error importing products:', error)
            setImportResult({
                success: false,
                error: 'Failed to import products'
            })
        } finally {
            setImporting(false)
        }
    }

    const resetImportDialog = () => {
        setImportDialogOpen(false)
        setImportFile(null)
        setImportResult(null)
        setImporting(false)
    }

    const downloadTemplate = async () => {
        try {
            const response = await fetch('/api/products/template')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'product_import_template.xlsx'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading template:', error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        fetchProducts(currentPage, searchTerm)
    }, [currentPage, searchTerm])

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
                        <div className="flex space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setImportDialogOpen(true)}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Import Excel
                            </Button>
                            <Link href="/admin/products/new">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </Button>
                            </Link>
                        </div>
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
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 object-cover rounded"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement
                                                            target.src = '/images/placeholder.svg'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{product.category.name}</Badge>
                                                </TableCell>
                                                <TableCell>{product.brand.name}</TableCell>
                                                <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
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

            {/* Import Dialog */}
            <Dialog open={importDialogOpen} onOpenChange={resetImportDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Import Products from Excel</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {!importResult ? (
                            <>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        Upload an Excel file to import products. Make sure your Excel file follows the required format.
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={downloadTemplate}
                                        className="w-full"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Template
                                    </Button>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Excel File</label>
                                    <Input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={resetImportDialog}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleImport} 
                                        disabled={!importFile || importing}
                                    >
                                        {importing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Importing...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Import
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <h3 className="font-medium">Import Results</h3>
                                    
                                    {importResult.success ? (
                                        <div className="space-y-2">
                                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                                <p className="text-green-800 text-sm">
                                                    Import completed successfully!
                                                </p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Total Rows:</span>
                                                    <span className="ml-2">{importResult.data?.totalRows || 0}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Success:</span>
                                                    <span className="ml-2 text-green-600">{importResult.data?.successCount || 0}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Failed:</span>
                                                    <span className="ml-2 text-red-600">{importResult.data?.failedCount || 0}</span>
                                                </div>
                                            </div>
                                            
                                            {importResult.data?.errors && importResult.data.errors.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="font-medium text-sm">Errors:</p>
                                                    <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                                                        {importResult.data.errors.map((error: string, index: number) => (
                                                            <p key={index} className="text-red-800 text-xs">{error}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                            <p className="text-red-800 text-sm">
                                                {importResult.error || 'Import failed'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex justify-end">
                                    <Button onClick={resetImportDialog}>
                                        Close
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminProducts