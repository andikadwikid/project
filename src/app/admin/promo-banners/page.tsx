'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { FileUpload } from '@/components/ui/file-upload'
import { toast } from 'sonner'

interface PromoBanner {
  id: number
  title: string
  subtitle?: string
  description?: string
  imageUrl: string
  linkUrl?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const AdminPromoBanners = () => {
  const [banners, setBanners] = useState<PromoBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    sortOrder: 0
  })


  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/promo-banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data.banners || [])
      } else {
        toast.error('Failed to fetch promo banners')
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      toast.error('Error fetching promo banners')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!formData.imageUrl.trim()) {
      toast.error('Image is required')
      return
    }

    try {
      const url = editingBanner 
        ? `/api/admin/promo-banners/${editingBanner.id}`
        : '/api/admin/promo-banners'
      
      const method = editingBanner ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(`Banner ${editingBanner ? 'updated' : 'created'} successfully`)
        setDialogOpen(false)
        resetForm()
        fetchBanners()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to save banner')
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      toast.error('Error saving banner')
    }
  }

  const handleEdit = (banner: PromoBanner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      isActive: banner.isActive,
      sortOrder: banner.sortOrder
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/promo-banners/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Banner deleted successfully')
        fetchBanners()
      } else {
        toast.error('Failed to delete banner')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast.error('Error deleting banner')
    }
  }

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/promo-banners/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        toast.success(`Banner ${!isActive ? 'activated' : 'deactivated'} successfully`)
        fetchBanners()
      } else {
        toast.error('Failed to update banner status')
      }
    } catch (error) {
      console.error('Error updating banner status:', error)
      toast.error('Error updating banner status')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      isActive: true,
      sortOrder: 0
    })
    setEditingBanner(null)
  }

  const handleFileUpload = (files: string[]) => {
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, imageUrl: files[0] }))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading promo banners...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Promo Banners</h1>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Promo Banners</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No promo banners found</p>
              <Button 
                onClick={() => setDialogOpen(true)} 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Banner
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="w-16 h-10 relative rounded overflow-hidden">
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>{banner.subtitle || '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={banner.isActive ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{banner.sortOrder}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter banner title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Enter banner subtitle"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter banner description"
                rows={3}
              />
            </div>

            <div>
              <Label>Banner Image *</Label>
              <FileUpload
                onUpload={handleFileUpload}
                accept="image/*"
                maxFiles={1}
                className="mt-2"
              />
              {formData.imageUrl && (
                <div className="mt-4">
                  <div className="w-full h-32 relative rounded border overflow-hidden">
                    <Image
                      src={formData.imageUrl}
                      alt="Banner preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkUrl">Link URL</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingBanner ? 'Update' : 'Create'} Banner
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPromoBanners