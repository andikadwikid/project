import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types/product'

interface UseProductResult {
  product: Product | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useProduct = (id: string | number): UseProductResult => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product')
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch product')
      }
      
      setProduct(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id, fetchProduct])

  const refetch = () => {
    if (id) {
      fetchProduct()
    }
  }

  return {
    product,
    loading,
    error,
    refetch,
  }
}

export default useProduct