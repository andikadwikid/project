'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, Tag, Palette, Ruler, BarChart3, Users, Layout } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useBrands } from '@/hooks/useBrands'
import { useColors } from '@/hooks/useColors'
import { useSizes } from '@/hooks/useSizes'

const AdminDashboardClient = () => {
  const { products, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { brands, loading: brandsLoading, error: brandsError } = useBrands()
  const { colors, loading: colorsLoading, error: colorsError } = useColors()
  const { sizes, loading: sizesLoading, error: sizesError } = useSizes()

  const adminCards = [
    {
      title: 'Products',
      description: 'Manage product catalog',
      icon: Package,
      href: '/admin/products',
      count: products.length.toString(),
      color: 'bg-blue-500',
    },
    {
      title: 'Categories',
      description: 'Organize product categories',
      icon: Tag,
      href: '/admin/categories',
      count: categories.length.toString(),
      color: 'bg-green-500',
    },
    {
      title: 'Brands',
      description: 'Manage brand information',
      icon: BarChart3,
      href: '/admin/brands',
      count: brands.length.toString(),
      color: 'bg-purple-500',
    },
    {
      title: 'Colors',
      description: 'Manage product colors',
      icon: Palette,
      href: '/admin/colors',
      count: colors.length.toString(),
      color: 'bg-pink-500',
    },
    {
      title: 'Sizes',
      description: 'Manage product sizes',
      icon: Ruler,
      href: '/admin/sizes',
      count: sizes.length.toString(),
      color: 'bg-orange-500',
    },
    {
      title: 'Size Templates',
      description: 'Manage size templates',
      icon: Layout,
      href: '/admin/size-templates',
      count: '0',
      color: 'bg-teal-500',
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      icon: Users,
      href: '/admin/users',
      count: '0',
      color: 'bg-red-500',
    },
  ]

  if (productsLoading || categoriesLoading || brandsLoading || colorsLoading || sizesLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (productsError || categoriesError || brandsError || colorsError || sizesError) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading dashboard data</p>
          <p className="text-sm text-gray-600 mt-2">
            {productsError || categoriesError || brandsError || colorsError || sizesError}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/">Back to Store</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => {
          const IconComponent = card.icon
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground mb-4">{card.description}</p>
                <Button asChild size="sm" className="w-full">
                  <Link href={card.href}>Manage</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild variant="outline">
                <Link href="/admin/products/new">Add New Product</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/categories/new">Add New Category</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/brands/new">Add New Brand</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/reports">View Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboardClient