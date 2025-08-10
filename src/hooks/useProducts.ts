import { useState, useEffect } from 'react';
import { UseProductsParams, ProductsResponse, HookProduct } from '@/types/hooks';

export function useProducts(params: UseProductsParams = {}) {
  const [products, setProducts] = useState<HookProduct[]>([])
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

        const url = `/api/products?${searchParams.toString()}`
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const result: ProductsResponse = await response.json()
        
        if (result.success) {
          setProducts(result.data.products)
          setPagination(result.data.pagination)
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

  const refetch = () => {
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

        const url = `/api/products?${searchParams.toString()}`
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const result: ProductsResponse = await response.json()
        
        if (result.success) {
          setProducts(result.data.products)
          setPagination(result.data.pagination)
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
  }

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  }
}