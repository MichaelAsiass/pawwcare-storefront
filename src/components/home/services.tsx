"use client";

import React, { useState } from "react";
import { Scissors, Clock, DollarSign, Dog, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/api";
import { useRouter } from "next/navigation";

const CATEGORY_ICONS: Record<string, React.JSX.Element> = {
  grooming: <Scissors className="w-4 h-4" />,
  bath: <Sparkles className="w-4 h-4" />,
  addon: <Dog className="w-4 h-4" />,
  daycare: <Dog className="w-4 h-4" />,
};

type ServicesPricingProps = {
  businessSlug: string;
};

export default function ServicesPricing({ businessSlug }: ServicesPricingProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();

  // Get business
  const business = useQuery(api.businesses.getBySlug, {
    slug: businessSlug,
  });

  // Get services - skip until business loads
  const services = useQuery(
    api.services.getByBusiness,
    business ? { businessId: business._id } : "skip"
  );

  const filteredServices =
    services?.filter(
      (service: any) =>
        selectedCategory === "all" || service.category === selectedCategory
    ) || [];

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || <Scissors className="w-4 h-4" />;
  };

  const handleBookService = (serviceId: string) => {
    router.push(`/appointment?serviceId=${serviceId}`);
  };

  // Loading state
  if (!business || !services) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional pet care services tailored to your pet's needs
          </p>
        </div>

        {/* Category Filter */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto mx-auto">
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="grooming">Full Grooming</TabsTrigger>
            <TabsTrigger value="bath">Bath & Tidy</TabsTrigger>
            <TabsTrigger value="addon">Add-Ons</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => (
            <Card
              key={service._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {getCategoryIcon(service.category)}
                  </div>
                  {service.dogSize && (
                    <Badge variant="secondary">{service.dogSize}</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(service.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-2xl font-bold">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleBookService(service._id)}
                  className="w-full"
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <Dog className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No services found</CardTitle>
              <CardDescription>
                Try selecting a different category
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

