import { useState, useEffect } from 'react';
import { HookSize, SizesResponse } from '@/types/hooks';

export function useSizes() {
  const [sizes, setSizes] = useState<HookSize[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/sizes')
        
        if (!response.ok) {
          throw new Error('Failed to fetch sizes')
        }

        const result: SizesResponse = await response.json()
        
        if (result.success) {
          setSizes(result.data)
        } else {
          throw new Error('Failed to fetch sizes')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setSizes([])
      } finally {
        setLoading(false)
      }
    }

    fetchSizes()
  }, [])

  return {
    sizes,
    loading,
    error,
    refetch: () => {
      const fetchSizes = async () => {
        try {
          setLoading(true)
          setError(null)

          const response = await fetch('/api/sizes')
          
          if (!response.ok) {
            throw new Error('Failed to fetch sizes')
          }

          const result: SizesResponse = await response.json()
          
          if (result.success) {
            setSizes(result.data)
          } else {
            throw new Error('Failed to fetch sizes')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
          setSizes([])
        } finally {
          setLoading(false)
        }
      }
      fetchSizes()
    }
  }
}