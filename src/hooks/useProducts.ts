import { useState, useEffect } from 'react'
import { Product } from '@/types/product'

interface UseProductsParams {
  category?: string
  brand?: string
  search?: string
  page?: number
  limit?: number
}

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

export function useProducts(params: UseProductsParams = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const searchParams = new URLSearchParams()
        
        if (params.category) searchParams.set('category', params.category)
        if (params.brand) searchParams.set('brand', params.brand)
        if (params.search) searchParams.set('search', params.search)
        if (params.page) searchParams.set('page', params.page.toString())
        if (params.limit) searchParams.set('limit', params.limit.toString())

        const response = await fetch(`/api/products?${searchParams.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const result: ProductsResponse = await response.json()
        
        if (result.success) {
          setProducts(result.data)
          setPagination(result.pagination)
        } else {
          throw new Error('Failed to fetch products')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params.category, params.brand, params.search, params.page, params.limit])

  return {
    products,
    loading,
    error,
    pagination,
    refetch: () => {
      // Trigger re-fetch by updating a dependency
    },
  }
}