"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Users, Zap, Calendar, Loader2, Home } from "lucide-react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../api"
import { useState } from "react"
import { SkeletonCard } from "@/components/skeleton/card";
import { SkeletonText } from "@/components/skeleton/text";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"

type DaycarePricingProps =   {
  businessSlug: string
}

export default function DaycarePricing({ businessSlug }: DaycarePricingProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  
  // Get business data
  const business = useQuery(api.businesses.getBySlug, { slug: businessSlug })
  
  // Get active daycare memberships
  const memberships = useQuery(
    api.memberships.getActiveBusinessMemberships, 
    business ? { businessId: business._id } : "skip"
  )
  
  // Checkout mutation
  const checkout = useMutation(api.memberships.createMembershipCheckout)

  // Filter daycare memberships only
  const daycareMemberships = memberships?.filter((membership: any) => membership.type === 'daycare') || []

  const handleSubscribe = async (membershipPlanId: string, membershipName: string) => {
    if (!business) return
    
    setLoadingPlan(membershipPlanId)
    try {
      const checkoutUrl = await checkout({
        membershipPlanId: membershipPlanId as any,
        // You can pass customer email/name if available
        // customerEmail: user?.email,
        // customerName: user?.fullName,
      })
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout error:', error as any)
    } finally {
      setLoadingPlan(null)
    }
  }

  const getIcon = (index: number) => {
    const icons = [Clock, Users, Zap]
    return icons[index % icons.length]
  }

  const getColorClasses = (index: number) => {
    const colors = [
      { gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-100", text: "text-blue-600" },
      { gradient: "from-purple-500 to-pink-500", bg: "bg-purple-100", text: "text-purple-600" },
      { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-100", text: "text-amber-600" }
    ]
    return colors[index % colors.length]
  }


  if (!business) {
    return (
      <section id="daycare" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <SkeletonText lines={2} />
          </div>
  
          {/* Cards Skeleton */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="daycare" className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-amber-300 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
            <Home className="w-3 h-3 mr-1" />
            Monthly Daycare
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Daycare Memberships
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Give your pet a second home with our flexible monthly daycare memberships. 
            Consistent routine, familiar friends, and trusted caregivers.
          </p>
        </div>

        {daycareMemberships.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Daycare Memberships Available</h3>
            <p className="text-gray-600">Check back later for daycare membership options.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {daycareMemberships.map((membership: any, index: number) => {
              const Icon = getIcon(index)
              const colors = getColorClasses(index)
              const isPopular = membership.popular
              const price = membership.price
              
              return (
                <div key={membership._id} className="relative">
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 shadow-lg">
                        <Users className="w-3 h-3 mr-1" />
                        Best Value
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isPopular ? 'scale-105 ring-2 ring-purple-200' : ''
                  }`}>
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                    
                    <CardHeader className="text-center pb-4 pt-8">
                      <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${colors.text}`} />
                        </div>
                      </div>
                      <CardTitle className="text-2xl">{membership.name}</CardTitle>
                      <div className="flex items-baseline justify-center space-x-2 mt-2">
                        <span className="text-4xl font-bold text-gray-900">${price}</span>
                        <span className="text-gray-500">/{membership.interval}</span>
                      </div>
                      <div className="flex items-center justify-center mt-2 text-sm text-blue-600 font-semibold">
                        <Calendar className="w-4 h-4 mr-1" />
                        {membership.sessionsIncluded} days per month
                      </div>
                      <p className="text-gray-600 mt-2">{membership.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-4">
                        {membership.features.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        onClick={() => handleSubscribe(membership._id, membership.name)}
                        disabled={loadingPlan === membership._id}
                        className={`w-full ${
                          isPopular 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                            : 'bg-gray-900 hover:bg-gray-800'
                        } text-white`}
                        size="lg"
                      >
                        {loadingPlan === membership._id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          `Start ${membership.name}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        )}

        {/* Membership Benefits */}
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">All Memberships Include</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Certified pet first-aid trained staff
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  24/7 facility monitoring & security
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Individualized care plans
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Emergency veterinary coordination
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}