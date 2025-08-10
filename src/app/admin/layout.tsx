'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Home,
  Package,
  Tag,
  Store,
  Palette,
  Ruler,
  Layout,
  Percent,
  Image as ImageIcon,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: pathname === '/admin'
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: pathname.startsWith('/admin/products')
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Tag,
      current: pathname.startsWith('/admin/categories')
    },
    {
      name: 'Brands',
      href: '/admin/brands',
      icon: Store,
      current: pathname.startsWith('/admin/brands')
    },
    {
      name: 'Colors',
      href: '/admin/colors',
      icon: Palette,
      current: pathname.startsWith('/admin/colors')
    },
    {
      name: 'Sizes',
      href: '/admin/sizes',
      icon: Ruler,
      current: pathname.startsWith('/admin/sizes')
    },
    {
      name: 'Size Templates',
      href: '/admin/size-templates',
      icon: Layout,
      current: pathname.startsWith('/admin/size-templates')
    },
    {
      name: 'Promotions',
      href: '/admin/promotions',
      icon: Percent,
      current: pathname.startsWith('/admin/promotions')
    },
    {
      name: 'Promo Banners',
      href: '/admin/promo-banners',
      icon: ImageIcon,
      current: pathname.startsWith('/admin/promo-banners')
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: pathname.startsWith('/admin/users')
    }
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Femme Steps</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const IconComponent = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    item.current
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
                {item.current && (
                  <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-0">
                    Active
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            <Link
              href="/admin/products/new"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Package className="mr-3 h-4 w-4" />
              Add Product
            </Link>
            <Link
              href="/admin/promotions"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <Percent className="mr-3 h-4 w-4" />
              New Promotion
            </Link>
            <Link
              href="/admin/reports"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              View Reports
            </Link>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="mr-3 h-4 w-4" />
            Back to Store
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              // Add logout logic here
              console.log('Logout clicked')
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>
        </div>

        {/* Page content */}
        <main className="">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout