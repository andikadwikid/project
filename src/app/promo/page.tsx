'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Tag, Clock, Percent } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'

import ProductCard from '@/components/sections/ProductCard'

interface PromoBanner {
  id: string
  title: string
  subtitle?: string
  description?: string
  imageUrl: string
  linkUrl?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const PromoPage = () => {
  const { products, loading, error } = useProducts()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Filter products that have active promotions
  const promoProducts = products?.filter(product => product.promotion && product.isSale) || []

  // Dynamic banner state
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([])
  const [bannersLoading, setBannersLoading] = useState(true)

  // Fetch dynamic banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/promo-banners')
        if (response.ok) {
          const data = await response.json()
          setPromoBanners(data.banners || [])
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
        // Fallback to static banners if API fails
        setPromoBanners([
          {
            id: "1",
            title: "Flash Sale 50% OFF",
            subtitle: "Diskon besar-besaran untuk semua kategori!",
            imageUrl: "/images/promo-banner-1.svg",
            linkUrl: "/catalog",
            isActive: true,
            sortOrder: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "2",
            title: "Weekend Special",
            subtitle: "Promo khusus akhir pekan hingga 70% OFF",
            imageUrl: "/images/promo-banner-2.svg",
            linkUrl: "/catalog",
            isActive: true,
            sortOrder: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "3",
            title: "New Collection",
            subtitle: "Koleksi terbaru dengan harga spesial",
            imageUrl: "/images/promo-banner-3.svg",
            linkUrl: "/catalog",
            isActive: true,
            sortOrder: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
      } finally {
        setBannersLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Auto-slide carousel
  useEffect(() => {
    if (promoBanners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % promoBanners.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [promoBanners.length])



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading promo products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error loading products: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Carousel - Only show if there are banners */}
      {!bannersLoading && promoBanners.length > 0 && (
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
              {promoBanners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                    index === currentSlide ? 'translate-x-0' : 
                    index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                  }`}
                >
                  {banner.linkUrl ? (
                    <a href={banner.linkUrl} className="block w-full h-full">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </a>
                  ) : (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  )}
                </div>
              ))}

              {promoBanners.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + promoBanners.length) % promoBanners.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % promoBanners.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                  <h3 className="text-lg font-bold">{promoBanners[currentSlide]?.title}</h3>
                  <p className="text-sm opacity-90">{promoBanners[currentSlide]?.subtitle || promoBanners[currentSlide]?.description}</p>
                </div>
              </div>
            </div>

            {promoBanners.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {promoBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Loading state for banners */}
      {bannersLoading && (
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
              <div className="flex items-center justify-center h-full bg-gray-200">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Promo Stats - Only show if there are promo products */}
      {promoProducts.length > 0 && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Percent className="h-8 w-8 text-red-500 mr-2" />
                  <span className="text-3xl font-bold text-red-500">{promoProducts.length}</span>
                </div>
                <p className="text-gray-600">Products on Sale</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-8 w-8 text-blue-500 mr-2" />
                  <span className="text-3xl font-bold text-blue-500">24</span>
                </div>
                <p className="text-gray-600">Hours Left</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Tag className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-3xl font-bold text-green-500">70%</span>
                </div>
                <p className="text-gray-600">Max Discount</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Promo Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {promoProducts.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">🔥 Hot Deals</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Jangan lewatkan kesempatan emas ini! Produk-produk pilihan dengan diskon fantastis menunggu Anda.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {promoProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-700">Tidak Ada Promosi Saat Ini</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Maaf, saat ini belum ada produk yang sedang dalam masa promosi. Silakan kembali lagi nanti untuk penawaran menarik!
              </p>
              <div className="space-y-4">
                <Link href="/catalog">
                  <Button size="lg" className="mr-4">
                    Lihat Semua Produk
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {promoProducts.length > 0 ? "Jangan Sampai Terlewat!" : "Dapatkan Notifikasi Promosi!"}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {promoProducts.length > 0
              ? "Berlangganan newsletter kami dan jadilah yang pertama tahu tentang penawaran eksklusif dan promosi menarik."
              : "Berlangganan newsletter kami agar tidak ketinggalan informasi promosi dan penawaran spesial di masa mendatang."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              Berlangganan
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PromoPage