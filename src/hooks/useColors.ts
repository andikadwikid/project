import { useState, useEffect } from 'react';
import { HookColor, ColorsResponse } from '@/types/hooks';

export function useColors() {
  const [colors, setColors] = useState<HookColor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchColors = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/colors')
        
        if (!response.ok) {
          throw new Error('Failed to fetch colors')
        }

        const result: ColorsResponse = await response.json()
        
        if (result.success) {
          setColors(result.data)
        } else {
          throw new Error('Failed to fetch colors')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setColors([])
      } finally {
        setLoading(false)
      }
    }

    fetchColors()
  }, [])

  return {
    colors,
    loading,
    error,
    refetch: () => {
      const fetchColors = async () => {
        try {
          setLoading(true)
          setError(null)

          const response = await fetch('/api/colors')
          
          if (!response.ok) {
            throw new Error('Failed to fetch colors')
          }

          const result: ColorsResponse = await response.json()
          
          if (result.success) {
            setColors(result.data)
          } else {
            throw new Error('Failed to fetch colors')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
          setColors([])
        } finally {
          setLoading(false)
        }
      }
      fetchColors()
    }
  }
}