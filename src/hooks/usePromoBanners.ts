import { useState, useEffect } from 'react';

interface PromoBanner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface PromoBannersResponse {
  success: boolean;
  banners: PromoBanner[];
}

export function usePromoBanners() {
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/promo-banners');
        
        if (!response.ok) {
          throw new Error('Failed to fetch promo banners');
        }

        const result: PromoBannersResponse = await response.json();
        
        if (result.success) {
          setPromoBanners(result.banners || []);
        } else {
          throw new Error('Failed to fetch promo banners');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPromoBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoBanners();
  }, []);

  return {
    promoBanners,
    loading,
    error,
    refetch: () => {
      const fetchPromoBanners = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch('/api/admin/promo-banners');
          
          if (!response.ok) {
            throw new Error('Failed to fetch promo banners');
          }

          const result: PromoBannersResponse = await response.json();
          
          if (result.success) {
            setPromoBanners(result.banners || []);
          } else {
            throw new Error('Failed to fetch promo banners');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setPromoBanners([]);
        } finally {
          setLoading(false);
        }
      };
      fetchPromoBanners();
    }
  };
}