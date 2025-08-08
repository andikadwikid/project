import { useState, useEffect } from 'react'

interface Brand {
  id: number
  code: string
  name: string
  productCount: number
}

interface BrandsResponse {
  success: boolean
  data: Brand[]
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/brands')
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands')
        }

        const result: BrandsResponse = await response.json()
        
        if (result.success) {
          setBrands(result.data)
        } else {
          throw new Error('Failed to fetch brands')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setBrands([])
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return {
    brands,
    loading,
    error,
  }
}