import { useState, useEffect } from 'react';

interface SizeTemplate {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
}

interface SizeTemplatesResponse {
  success: boolean;
  data: SizeTemplate[];
}

export function useSizeTemplates() {
  const [sizeTemplates, setSizeTemplates] = useState<SizeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSizeTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/size-templates');
        
        if (!response.ok) {
          throw new Error('Failed to fetch size templates');
        }

        const result: SizeTemplatesResponse = await response.json();
        
        if (result.success) {
          setSizeTemplates(result.data);
        } else {
          throw new Error('Failed to fetch size templates');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setSizeTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSizeTemplates();
  }, []);

  return {
    sizeTemplates,
    loading,
    error,
    refetch: () => {
      const fetchSizeTemplates = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch('/api/size-templates');
          
          if (!response.ok) {
            throw new Error('Failed to fetch size templates');
          }

          const result: SizeTemplatesResponse = await response.json();
          
          if (result.success) {
            setSizeTemplates(result.data);
          } else {
            throw new Error('Failed to fetch size templates');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setSizeTemplates([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSizeTemplates();
    }
  };
}