'use client';

import Image from 'next/image';
import { Heart, Award, Users, Sparkles, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutPage = () => {

  const values = [
    {
      icon: Heart,
      title: 'Passion for Fashion',
      description: 'We believe every woman deserves to feel beautiful and confident in her shoes.'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only the finest materials and craftsmanship make it into our collection.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction and comfort are our top priorities in everything we do.'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'We constantly seek new designs and technologies to enhance your experience.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Founded',
      description: 'Femme Steps was born from a passion for elegant women\'s footwear.'
    },
    {
      year: '2021',
      title: 'First Collection',
      description: 'Launched our debut collection featuring 50 unique designs.'
    },
    {
      year: '2022',
      title: '1000+ Customers',
      description: 'Reached our first milestone of serving over 1000 happy customers.'
    },
    {
      year: '2023',
      title: 'Premium Partnerships',
      description: 'Established partnerships with renowned Italian craftsmen.'
    },
    {
      year: '2024',
      title: 'Expansion',
      description: 'Expanded our collection to over 500 styles across multiple categories.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & Creative Director',
      image: '/images/team/sarah.jpg',
      description: 'Former fashion designer with 10+ years experience in luxury footwear.'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Head of Design',
      image: '/images/team/maria.jpg',
      description: 'Passionate about creating shoes that blend comfort with style.'
    },
    {
      name: 'Lisa Wang',
      role: 'Quality Assurance Manager',
      image: '/images/team/lisa.jpg',
      description: 'Ensures every pair meets our high standards of quality and comfort.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-rose-200 rounded-full opacity-30 animate-pulse delay-1000" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
              About Femme Steps
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Crafting <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Elegance</span>
              <br />One Step at a Time
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are passionate about creating beautiful, comfortable, and stylish shoes
              that empower women to walk confidently through life.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Story</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Femme Steps dimulai dari mimpi sederhana: menciptakan sepatu yang tidak hanya indah dipandang,
                  tetapi juga nyaman digunakan sepanjang hari. Kami percaya bahwa setiap wanita berhak merasa
                  percaya diri dan cantik dalam setiap langkahnya.
                </p>
                <p>
                  Dengan pengalaman bertahun-tahun di industri fashion dan komitmen terhadap kualitas,
                  kami menghadirkan koleksi sepatu wanita yang menggabungkan desain feminin dengan
                  kenyamanan maksimal.
                </p>
                <p>
                  Setiap pasang sepatu di Femme Steps dibuat dengan perhatian detail yang tinggi,
                  menggunakan bahan-bahan premium dan teknik pembuatan yang telah teruji waktu.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about/our-story.jpg"
                  alt="Our Story"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Femme Steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="value-card text-center border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key milestones in our journey to becoming a trusted name in women&apos;s footwear.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-200 to-rose-200 hidden md:block" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`milestone-card flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                            {milestone.year}
                          </Badge>
                          <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden md:flex w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full border-4 border-white shadow-lg z-10" />

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Meet Our <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Femme Steps who make it all possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="team-card text-center border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-pink-600 font-medium">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Femme Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Materials',
                description: 'We use only the finest leather and materials sourced from trusted suppliers.'
              },
              {
                title: 'Comfort Technology',
                description: 'Advanced cushioning and ergonomic design for all-day comfort.'
              },
              {
                title: 'Timeless Design',
                description: 'Classic styles with modern touches that never go out of fashion.'
              },
              {
                title: 'Perfect Fit',
                description: 'Wide range of sizes and widths to ensure the perfect fit for every foot.'
              },
              {
                title: 'Sustainable Practices',
                description: 'Committed to environmentally responsible manufacturing processes.'
              },
              {
                title: 'Customer Service',
                description: 'Dedicated support team to help you find your perfect pair.'
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;