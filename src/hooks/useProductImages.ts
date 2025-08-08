import { useState, useEffect } from 'react'
import { ProductImage } from '@/types/product'

export function useProductImages(productId: string | number) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      if (!productId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products/${productId}/images`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product images')
        }
        
        const data = await response.json()
        setImages(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [productId])

  return { images, loading, error }
}