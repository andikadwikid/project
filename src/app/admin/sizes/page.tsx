'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface Size {
  id: number
  sizeLabel: string
  code: string
  productCount: number
}

const AdminSizes = () => {
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSize, setEditingSize] = useState<Size | null>(null)
  const [formData, setFormData] = useState({ sizeLabel: '', code: '' })

  const resetForm = () => {
    setFormData({ sizeLabel: '', code: '' })
    setEditingSize(null)
    setDialogOpen(false)
  }

  const fetchSizes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sizes')
      const data = await response.json()
      
      if (data.success) {
        setSizes(data.data)
      }
    } catch (error) {
      console.error('Error fetching sizes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingSize ? `/api/sizes/${editingSize.id}` : '/api/sizes'
      const method = editingSize ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        console.log(`Size ${editingSize ? 'updated' : 'created'} successfully!`)
        resetForm()
        fetchSizes()
      } else {
        const errorData = await response.json()
        console.error(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error saving size:', error)
    }
  }

  const openDialog = (size?: Size) => {
    if (size) {
      setEditingSize(size)
      setFormData({ sizeLabel: size.sizeLabel, code: size.code })
    } else {
      setEditingSize(null)
      setFormData({ sizeLabel: '', code: '' })
    }
    setDialogOpen(true)
  }

  const handleDelete = async (size: Size) => {
    if (confirm(`Are you sure you want to delete the size "${size.sizeLabel}"?`)) {
      try {
        const response = await fetch(`/api/sizes/${size.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          console.log('Size deleted successfully!')
          fetchSizes()
        } else {
          const errorData = await response.json()
          console.error(`Error: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting size:', error)
      }
    }
  }

  useEffect(() => {
    fetchSizes()
  }, [])

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
                <h1 className="text-3xl font-bold text-gray-900">Sizes</h1>
                <p className="text-gray-600 mt-1">Manage product sizes</p>
              </div>
            </div>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Size
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Size List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading sizes...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size Label</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizes.map((size) => (
                    <TableRow key={size.id}>
                      <TableCell className="font-medium">{size.sizeLabel}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{size.code}</Badge>
                      </TableCell>
                      <TableCell>{size.productCount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(size)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(size)}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSize ? 'Edit Size' : 'Add New Size'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sizeLabel">Size Label</Label>
              <Input
                id="sizeLabel"
                value={formData.sizeLabel}
                onChange={(e) => setFormData(prev => ({ ...prev, sizeLabel: e.target.value }))}
                placeholder="e.g., Small, Medium, Large, XL, 42, 43"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Size Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g., S, M, L, XL, 42, 43"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSize ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminSizes