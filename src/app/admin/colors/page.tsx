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
import { Plus, Edit, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Color {
  id: number
  name: string
  hexCode: string
  code: string
  productCount: number
}

const AdminColors = () => {
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)
  const [formData, setFormData] = useState({ name: '', hexCode: '#000000', code: '' })

  const resetForm = () => {
    setFormData({
      name: '',
      hexCode: '#000000',
      code: ''
    })
    setEditingColor(null)
    setDialogOpen(false)
  }

  const fetchColors = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/colors')
      const data = await response.json()

      if (data.success) {
        setColors(data.data)
      }
    } catch (error) {
      console.error('Error fetching colors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingColor ? `/api/colors/${editingColor.id}` : '/api/colors'
      const method = editingColor ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colorName: formData.name,
          hexCode: formData.hexCode,
          code: formData.code,
        }),
      })

      if (response.ok) {
        console.log(`Color ${editingColor ? 'updated' : 'created'} successfully!`)
        resetForm()
        fetchColors()
      } else {
        const errorData = await response.json()
        console.error(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error saving color:', error)
    }
  }

  const openDialog = (color?: Color) => {
    if (color) {
      setEditingColor(color)
      setFormData({
        name: color.name,
        hexCode: color.hexCode,
        code: color.code
      })
    } else {
      setEditingColor(null)
      setFormData({ name: '', hexCode: '#000000', code: '' })
    }
    setDialogOpen(true)
  }

  const handleDelete = async (color: Color) => {
    if (confirm(`Are you sure you want to delete the color "${color.name}"?`)) {
      try {
        const response = await fetch(`/api/colors/${color.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          console.log('Color deleted successfully!')
          fetchColors()
        } else {
          const errorData = await response.json()
          console.error(`Error: ${errorData.error}`)
        }
      } catch (error) {
        console.error('Error deleting color:', error)
      }
    }
  }

  useEffect(() => {
    fetchColors()
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
                <h1 className="text-3xl font-bold text-gray-900">Colors</h1>
                <p className="text-gray-600 mt-1">Manage product colors</p>
              </div>
            </div>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Color
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Color List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading colors...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Color</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Hex Value</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colors.map((color) => (
                    <TableRow key={color.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hexCode }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{color.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{color.hexCode}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{color.code}</Badge>
                      </TableCell>
                      <TableCell>{color.productCount}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(color)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(color)}
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
              {editingColor ? 'Edit Color' : 'Add New Color'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Color Name</Label>
              <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
            </div>
            <div>
              <Label htmlFor="hexCode">Hex Color Value</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="hexCode"
                  type="color"
                  value={formData.hexCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, hexCode: e.target.value }))}
                  className="w-16 h-10 p-1 border rounded"
                  required
                />
                <Input
                  value={formData.hexCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, hexCode: e.target.value }))}
                  placeholder="#000000"
                  className="flex-1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="code">Color Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g., RED, BLUE, GREEN"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingColor ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminColors