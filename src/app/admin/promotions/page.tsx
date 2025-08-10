'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Edit, EyeOff, Search, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Promotion {
    id: number
    title: string
    description?: string
    discountType: string
    discountValue: number
    startDate: string
    endDate: string
    isActive: boolean
    createdAt: string
    _count: {
        promoProducts: number
    }
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [activateDialogOpen, setActivateDialogOpen] = useState(false)
    const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null)
    const [promotionToActivate, setPromotionToActivate] = useState<Promotion | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isActivating, setIsActivating] = useState(false)

    useEffect(() => {
        fetchPromotions()
    }, [])

    const fetchPromotions = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/admin/promotions')
            if (response.ok) {
                const result = await response.json()
                // Handle both direct array and wrapped response
                const data = result.data || result
                setPromotions(Array.isArray(data) ? data : [])
            } else {
                setPromotions([])
            }
        } catch (error) {
            console.error('Error fetching promotions:', error)
            setPromotions([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (promotion: Promotion) => {
        try {
            setIsDeleting(true)
            const response = await fetch(`/api/admin/promotions/${promotion.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setPromotions(promotions.filter(p => p.id !== promotion.id))
                setDeleteDialogOpen(false)
                setPromotionToDelete(null)
            }
        } catch (error) {
            console.error('Error deleting promotion:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleActivate = async (promotion: Promotion) => {
        try {
            setIsActivating(true)
            const response = await fetch(`/api/admin/promotions/${promotion.id}/activate`, {
                method: 'PATCH',
            })

            if (response.ok) {
                setPromotions(promotions.map(p => 
                    p.id === promotion.id ? { ...p, isActive: true } : p
                ))
                setActivateDialogOpen(false)
                setPromotionToActivate(null)
            }
        } catch (error) {
            console.error('Error activating promotion:', error)
        } finally {
            setIsActivating(false)
        }
    }

    const filteredPromotions = Array.isArray(promotions) ? promotions.filter(promotion =>
        promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID')
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount)
    }

    const getDiscountDisplay = (type: string, value: number) => {
        return type === 'percentage' ? `${value}%` : formatCurrency(value)
    }

    const isPromotionActive = (startDate: string, endDate: string, isActive: boolean) => {
        const now = new Date()
        const start = new Date(startDate)
        const end = new Date(endDate)
        return isActive && now >= start && now <= end
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Admin
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Promotion Management</h1>
                </div>
                <Link href="/admin/promotions/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Promotion
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Promotions</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search promotions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <p>Loading promotions...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPromotions.map((promotion) => (
                                    <TableRow key={promotion.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{promotion.title}</div>
                                                {promotion.description && (
                                                    <div className="text-sm text-gray-500">
                                                        {promotion.description}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getDiscountDisplay(promotion.discountType, promotion.discountValue)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{formatDate(promotion.startDate)} -</div>
                                                <div>{formatDate(promotion.endDate)}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {promotion._count.promoProducts} products
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {isPromotionActive(promotion.startDate, promotion.endDate, promotion.isActive) ? (
                                                <Badge variant="default">Active</Badge>
                                            ) : promotion.isActive ? (
                                                <Badge variant="secondary">Scheduled</Badge>
                                            ) : (
                                                <Badge variant="destructive">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/promotions/${promotion.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {!promotion.isActive && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setPromotionToActivate(promotion)
                                                            setActivateDialogOpen(true)
                                                        }}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setPromotionToDelete(promotion)
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                    className="text-orange-600 hover:text-orange-700"
                                                >
                                                    <EyeOff className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deactivate Promotion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to deactivate &ldquo;{promotionToDelete?.title}&rdquo;? This action will deactivate the promotion and it can be reactivated later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => promotionToDelete && handleDelete(promotionToDelete)}
                            disabled={isDeleting}
                        >
                            <EyeOff className="h-4 w-4 mr-2" />
                            {isDeleting ? 'Deactivating...' : 'Deactivate Promotion'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Activate Dialog */}
            <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Activate Promotion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to activate &ldquo;{promotionToActivate?.title}&rdquo;?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActivateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => promotionToActivate && handleActivate(promotionToActivate)}
                            disabled={isActivating}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {isActivating ? 'Activating...' : 'Activate Promotion'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}