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
import { AdminProductsResponse, AdminProductData } from '@/types/admin'
import { HookProduct, ProductsResponse as HookProductsResponse } from '@/types/hooks'

type ProductsResponse = HookProductsResponse

const AdminProducts = () => {
    const [products, setProducts] = useState<HookProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<HookProduct | null>(null)
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [zipFile, setZipFile] = useState<File | null>(null)
    const [importing, setImporting] = useState(false)
    const [importResult, setImportResult] = useState<{
        success: boolean;
        message?: string;
        results?: {
            success: number;
            failed: number;
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
                setProducts(data.data.products)
                setTotalPages(data.data.pagination.totalPages)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (product: HookProduct) => {
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
        if (!excelFile) return

        try {
            setImporting(true)
            const formData = new FormData()
            formData.append('excelFile', excelFile)
            
            // Add ZIP file if provided
            if (zipFile) {
                formData.append('zipFile', zipFile)
            }

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
        setExcelFile(null)
        setZipFile(null)
        setImporting(false)
        setImportResult(null)
    }

    const downloadTemplate = () => {
        // Download the pre-made CSV template
        const a = document.createElement('a')
        a.href = '/templates/product-import-template.csv'
        a.download = 'product-import-template.csv'
        a.click()
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
                                            <TableHead>Code</TableHead>
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
                                                        src={product.image || product.images?.[0]?.imageUrl || '/images/placeholder.svg'}
                                                        alt={product.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono text-xs">{product.code}</Badge>
                                                </TableCell>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{product.category.name}</Badge>
                                                </TableCell>
                                                <TableCell>{product.brand.name}</TableCell>
                                                <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {(product.colors || []).slice(0, 3).map((color) => (
                                                            <Badge key={color.id} variant="outline" className="text-xs" style={{backgroundColor: color.hexCode, color: color.hexCode === '#FFFFFF' || color.hexCode === '#ffffff' ? '#000' : '#fff'}}>
                                                                {color.colorName}
                                                            </Badge>
                                                        ))}
                                                        {(product.colors || []).length > 3 && (
                                                            <Badge variant="outline" className="text-xs">+{(product.colors || []).length - 3}</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {(product.sizes || []).slice(0, 3).map((size) => (
                                                            <Badge key={size.id} variant="outline" className="text-xs">
                                                                {size.sizeLabel}
                                                            </Badge>
                                                        ))}
                                                        {(product.sizes || []).length > 3 && (
                                                            <Badge variant="outline" className="text-xs">+{(product.sizes || []).length - 3}</Badge>
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
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Import Products with Images</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {!importResult ? (
                            <>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        Upload an Excel file with product data and optionally a ZIP file containing product images.
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={downloadTemplate}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Excel Template
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const a = document.createElement('a')
                                                a.href = '/templates/product-images-sample.zip'
                                                a.download = 'product-images-sample.zip'
                                                a.click()
                                            }}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Sample ZIP
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-red-600">Excel File (Required) *</label>
                                        <Input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Excel file containing product data with columns: name, description, price, category, etc.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-blue-600">ZIP File (Optional)</label>
                                        <Input
                                            type="file"
                                            accept=".zip"
                                            onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                                        />
                                        <p className="text-xs text-gray-500">
                                            ZIP file containing product images. Image filenames should match the image_url column in Excel.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                    <h4 className="text-sm font-medium text-blue-800 mb-1">How it works:</h4>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>• Excel file contains product data with image_url column</li>
                                        <li>• ZIP file contains actual image files</li>
                                        <li>• System matches image_url values with filenames in ZIP</li>
                                        <li>• Images are automatically uploaded and linked to products</li>
                                    </ul>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={resetImportDialog}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleImport}
                                        disabled={!excelFile || importing}
                                    >
                                        {importing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Importing...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Import Products
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
                                                    {importResult.message || 'Import completed successfully!'}
                                                </p>
                                            </div>

                                            {importResult.results && (
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium">Success:</span>
                                                        <span className="ml-2 text-green-600">{importResult.results.success}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Failed:</span>
                                                        <span className="ml-2 text-red-600">{importResult.results.failed}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {importResult.results?.errors && importResult.results.errors.length > 0 && (
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-sm">Errors:</h4>
                                                    <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                                                        <ul className="text-red-800 text-xs space-y-1">
                                                            {importResult.results.errors.map((error, index) => (
                                                                <li key={index}>• {error}</li>
                                                            ))}
                                                        </ul>
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

                                    <div className="flex justify-end">
                                        <Button onClick={resetImportDialog}>
                                            Close
                                        </Button>
                                    </div>
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