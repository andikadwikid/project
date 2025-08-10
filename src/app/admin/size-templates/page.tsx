'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, Edit, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface Size {
  id: number
  code: string
  sizeLabel: string
  cmValue?: string
}

interface SizeTemplateItem {
  id?: number
  sizeId: number
  cmValue: number
  sortOrder: number
  size?: Size
}

interface SizeTemplate {
  id: number
  name: string
  description?: string
  templateSizes: SizeTemplateItem[]
}

const AdminSizeTemplates = () => {
  const [templates, setTemplates] = useState<SizeTemplate[]>([])
  const [availableSizes, setAvailableSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<SizeTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    templateSizes: [{ sizeId: 0, cmValue: 0, sortOrder: 1 }] as SizeTemplateItem[]
  })

  const fetchData = async () => {
    try {
      const [templatesRes, sizesRes] = await Promise.all([
        fetch('/api/size-templates'),
        fetch('/api/sizes')
      ])
      
      const [templatesData, sizesData] = await Promise.all([
        templatesRes.json(),
        sizesRes.json()
      ])
      
      if (templatesData.success) {
        setTemplates(templatesData.data)
      } else {
        toast.error('Failed to fetch size templates')
      }
      
      if (sizesData.success) {
        setAvailableSizes(sizesData.data)
      } else {
        toast.error('Failed to fetch sizes')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/size-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Size template created successfully')
        fetchData()
        resetForm()
      } else {
        toast.error(data.error || 'Failed to create size template')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create size template')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      templateSizes: [{ sizeId: 0, cmValue: 0, sortOrder: 1 }]
    })
    setEditingTemplate(null)
    setDialogOpen(false)
  }

  const openDialog = (template?: SizeTemplate) => {
    if (template) {
      setEditingTemplate(template)
      setFormData({
        name: template.name,
        description: template.description || '',
        templateSizes: template.templateSizes
      })
    } else {
      resetForm()
    }
    setDialogOpen(true)
  }

  const addSizeItem = () => {
    setFormData(prev => ({
      ...prev,
      templateSizes: [
        ...prev.templateSizes,
        { sizeId: 0, cmValue: 0, sortOrder: prev.templateSizes.length + 1 }
      ]
    }))
  }

  const removeSizeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      templateSizes: prev.templateSizes.filter((_, i) => i !== index)
    }))
  }

  const updateSizeItem = (index: number, field: keyof SizeTemplateItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      templateSizes: prev.templateSizes.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  useEffect(() => {
    fetchData()
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
                <h1 className="text-3xl font-bold text-gray-900">Size Templates</h1>
                <p className="text-gray-600 mt-1">Manage predefined size templates</p>
              </div>
            </div>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Template List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading templates...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sizes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.description || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {template.templateSizes.slice(0, 3).map((size, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {size.size?.sizeLabel}: {size.cmValue}cm
                            </Badge>
                          ))}
                          {template.templateSizes.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.templateSizes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(template)}
                          >
                            <Edit className="h-4 w-4" />
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Size Template' : 'Create Size Template'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Shoes EU, Clothing Standard, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this template"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Size Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSizeItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Size
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.templateSizes.map((size, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                    <div className="flex-1">
                      <Select
                        value={size.sizeId.toString()}
                        onValueChange={(value) => updateSizeItem(index, 'sizeId', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSizes.map((availableSize) => (
                            <SelectItem key={availableSize.id} value={availableSize.id.toString()}>
                              {availableSize.sizeLabel} ({availableSize.cmValue} cm)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="CM Value"
                        value={size.cmValue || ''}
                        onChange={(e) => updateSizeItem(index, 'cmValue', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSizeItem(index)}
                      disabled={formData.templateSizes.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingTemplate ? 'Update' : 'Create'} Template
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminSizeTemplates