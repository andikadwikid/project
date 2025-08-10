import { useState, useEffect } from 'react';

interface Promotion {
  id: number;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface PromotionsResponse {
  success: boolean;
  data: Promotion[];
}

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/promotions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch promotions');
        }

        const result: PromotionsResponse = await response.json();
        
        if (result.success) {
          setPromotions(result.data);
        } else {
          throw new Error('Failed to fetch promotions');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return {
    promotions,
    loading,
    error,
    refetch: () => {
      const fetchPromotions = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch('/api/admin/promotions');
          
          if (!response.ok) {
            throw new Error('Failed to fetch promotions');
          }

          const result: PromotionsResponse = await response.json();
          
          if (result.success) {
            setPromotions(result.data);
          } else {
            throw new Error('Failed to fetch promotions');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setPromotions([]);
        } finally {
          setLoading(false);
        }
      };
      fetchPromotions();
    }
  };
}