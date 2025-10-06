"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-balance mb-6">
              Premium Care
              <span className="text-cinnamon"> For Your</span>
              <br />
              Furry Family
              <br />
              Members
            </h1>

            <p className="text-xl text-muted-foreground text-pretty mb-8 leading-relaxed">
              Professional grooming and loving daycare services that keep your
              pets happy, healthy, and looking their best. Your pets deserve the
              absolute best care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="hover:glow-cinnamon">
                Book Grooming
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer">
                Tour Our Daycare
              </Button>
            </div>

            <div className="flex items-center space-x-4 mt-8">
              <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm border">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">4.9/5</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-xs text-gray-600">Google Reviews</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-600">300+ happy pets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero.jpg"
                alt="Happy dogs at our pet care facility"
                fill
                className="object-cover"
                priority
              />
              
              {/* Optional: Overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
            
            {/* Optional: Floating elements for visual interest */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}