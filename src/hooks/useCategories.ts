import { useState, useEffect } from 'react'

interface Category {
  id: number
  code: string
  name: string
  productCount: number
}

interface CategoriesResponse {
  success: boolean
  data: Category[]
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/categories')
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const result: CategoriesResponse = await response.json()
        
        if (result.success) {
          setCategories(result.data)
        } else {
          throw new Error('Failed to fetch categories')
        }
      } catch (err) {
        console.error('useCategories: Error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
  }
}