'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Package, Tag, Palette, BarChart3, Users, Percent, TrendingUp, Activity, Plus, ArrowRight, Store } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useBrands } from '@/hooks/useBrands'
import { useColors } from '@/hooks/useColors'
import { useSizes } from '@/hooks/useSizes'
import { useSizeTemplates } from '@/hooks/useSizeTemplates'
import { usePromotions } from '@/hooks/usePromotions'
import { usePromoBanners } from '@/hooks/usePromoBanners'

const AdminDashboardClient = () => {
  const { products, loading: productsLoading, error: productsError } = useProducts({ limit: 5 })
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { brands, loading: brandsLoading, error: brandsError } = useBrands()
  const { colors, loading: colorsLoading, error: colorsError } = useColors()
  const { sizes, loading: sizesLoading, error: sizesError } = useSizes()
  const { sizeTemplates, loading: sizeTemplatesLoading, error: sizeTemplatesError } = useSizeTemplates()
  const { promotions, loading: promotionsLoading, error: promotionsError } = usePromotions()
  const { promoBanners, loading: promoBannersLoading, error: promoBannersError } = usePromoBanners()

  // Loading states are available but not used in this component

  // Stats cards for overview
  const statsCards = [
    {
      title: 'Total Products',
      value: (products || []).length.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Categories',
      value: (categories || []).length.toString(),
      change: '+5%',
      changeType: 'positive',
      icon: Tag,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Active Promotions',
      value: (promotions || []).length.toString(),
      change: '+8%',
      changeType: 'positive',
      icon: Percent,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Brands',
      value: (brands || []).length.toString(),
      change: '+2%',
      changeType: 'positive',
      icon: Store,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  const managementCards = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: Package,
      href: '/admin/products',
      count: (products || []).length,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Add Products', 'Edit Details', 'Manage Images'],
    },
    {
      title: 'Categories',
      description: 'Organize product categories',
      icon: Tag,
      href: '/admin/categories',
      count: (categories || []).length,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Create Categories', 'Set Hierarchy', 'Manage Codes'],
    },
    {
      title: 'Brands',
      description: 'Manage brand information',
      icon: Store,
      href: '/admin/brands',
      count: (brands || []).length,
      gradient: 'from-purple-500 to-violet-500',
      features: ['Add Brands', 'Brand Codes', 'Brand Analytics'],
    },
    {
      title: 'Colors & Sizes',
      description: 'Manage product variants',
      icon: Palette,
      href: '/admin/colors',
      count: (colors || []).length + (sizes || []).length,
      gradient: 'from-pink-500 to-rose-500',
      features: ['Color Palette', 'Size Charts', 'Templates'],
    },
    {
      title: 'Promotions',
      description: 'Create and manage promotions',
      icon: Percent,
      href: '/admin/promotions',
      count: (promotions || []).length,
      gradient: 'from-yellow-500 to-amber-500',
      features: ['Discounts', 'Promo Codes', 'Banners'],
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      icon: Users,
      href: '/admin/users',
      count: 0,
      gradient: 'from-red-500 to-pink-500',
      features: ['User Roles', 'Permissions', 'Analytics'],
    },
  ]

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      href: '/admin/products/new',
      icon: Package,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Create Category',
      description: 'Add a new product category',
      href: '/admin/categories',
      icon: Tag,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'New Promotion',
      description: 'Set up a new promotion',
      href: '/admin/promotions',
      icon: Percent,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      href: '/admin/reports',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ]

  if (productsLoading || categoriesLoading || brandsLoading || colorsLoading || sizesLoading || sizeTemplatesLoading || promotionsLoading || promoBannersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (productsError || categoriesError || brandsError || colorsError || sizesError || sizeTemplatesError || promotionsError || promoBannersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Activity className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">There was an issue loading the dashboard data.</p>
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 max-w-md mx-auto">
              {productsError || categoriesError || brandsError || colorsError || sizesError || sizeTemplatesError || promotionsError || promoBannersError}
            </p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button asChild variant="outline">
                <Link href="/">Back to Store</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
           {statsCards.map((card, index) => {
             const IconComponent = card.icon
             return (
               <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:scale-105">
                 <CardContent className="p-6">
                   <div className="flex items-center justify-between mb-4">
                     <div className="text-sm font-medium text-gray-600">{card.title}</div>
                     <div className="p-2 bg-blue-50 rounded-lg">
                       <IconComponent className="h-5 w-5 text-blue-600" />
                     </div>
                   </div>
                   <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{card.value}</div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">{card.change}</span>
                     <span className="text-gray-500 ml-1 hidden sm:inline">from last month</span>
                   </div>
                 </CardContent>
               </Card>
             )
           })}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managementCards.map((card) => {
            const IconComponent = card.icon
            return (
              <Card key={card.title} className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-sm group hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 bg-gradient-to-r ${card.gradient} rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {card.count}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{card.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full group-hover:shadow-md transition-shadow">
                    <Link href={card.href} className="flex items-center justify-center">
                      Manage
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <p className="text-gray-600 text-sm">Frequently used actions to manage your store</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <Button
                      key={index}
                      asChild
                      className={`${action.color} text-white border-0 h-auto p-4 flex-col items-start text-left hover:scale-105 transition-all duration-300`}
                    >
                      <Link href={action.href} className="w-full">
                        <IconComponent className="h-5 w-5 mb-2" />
                        <div className="font-semibold text-sm">{action.title}</div>
                        <div className="text-xs opacity-90 mt-1">{action.description}</div>
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardClient