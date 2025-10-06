"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { ArrowRight, BadgeCheck, Scissors, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../api";
import { Tab } from "@/components/ui/tab";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonText } from "@/components/skeleton/text";
import { SkeletonCard } from "@/components/skeleton/card";

type GroomingPricingProps = {
  businessSlug: string;
};

export default function GroomingPricing({ businessSlug }: GroomingPricingProps) {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Get business data
  const business = useQuery(api.businesses.getBySlug, { slug: businessSlug });

  // Get active grooming memberships
  const memberships = useQuery(
    api.memberships.getActiveBusinessMemberships, 
    business ? { businessId: business._id } : "skip"
  );

  // Checkout mutation
  const checkout = useMutation(api.memberships.createMembershipCheckout);

  // Filter grooming memberships only
  const groomingMemberships = memberships?.filter((membership) => membership.type === "grooming") || [];

  const handleSubscribe = async (membershipPlanId: string, membershipName: string) => {
    if (!business) return;

    setLoadingPlan(membershipPlanId);
    try {
      const checkoutUrl = await checkout({
        membershipPlanId,
      });

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  // Transform grooming memberships to match the TIERS structure
  const groomingTiers = groomingMemberships.map((membership, index) => {
    const monthlyPrice = membership.price / 100;
    const yearlyPrice = monthlyPrice * 12 * 0.8;

    return {
      id: membership._id,
      price: {
        monthly: monthlyPrice,
        yearly: yearlyPrice,
      },
      description: membership.description,
      features: membership.features,
      cta: `Get Started`,
      highlighted: membership.popular,
      popular: membership.popular,
      interval: membership.interval,
      sessionsIncluded: membership.sessionsIncluded,
      name: membership.name,
    };
  });

  if (!business) {
    return (
      <section className="flex flex-col items-center gap-10 py-20">
        <div className="space-y-7 text-center">
          <div className="space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <SkeletonText lines={2} />
          </div>
          <div className="mx-auto flex w-fit rounded-full bg-gray-200 p-1">
            <Skeleton className="w-20 h-8 rounded-full mx-2" />
            <Skeleton className="w-20 h-8 rounded-full mx-2" />
          </div>
        </div>
        <div className="flex w-full max-w-6xl justify-center">
          <div className="w-full max-w-sm">
            <SkeletonCard />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="grooming" className="flex flex-col items-center gap-10 py-20">
      {/* Section Header */}
      <PricingHeader
        title="Grooming Memberships"
        subtitle="Keep your pet looking their best with our affordable grooming memberships. Save up to 20% with yearly billing."
        frequencies={["monthly", "yearly"]}
        selectedFrequency={selectedPaymentFreq}
        onFrequencyChange={setSelectedPaymentFreq}
      />

      {/* Pricing Cards */}
      <div className="flex w-full max-w-6xl justify-center">
        <div className="w-full max-w-sm">
          {groomingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              paymentFrequency={selectedPaymentFreq}
              onSubscribe={() => handleSubscribe(tier.id, tier.name)}
              isLoading={loadingPlan === tier.id}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {groomingTiers.length === 0 && (
        <div className="text-center py-12">
          <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Grooming Memberships Available
          </h3>
          <p className="text-gray-600">
            Check back later for grooming membership options.
          </p>
        </div>
      )}
    </section>
  );
}


const PricingCard = ({
  tier,
  paymentFrequency,
  onSubscribe,
  isLoading,
}: {
  tier: any;
  paymentFrequency: string;
  onSubscribe: () => void;
  isLoading: boolean;
}) => {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow",
        isHighlighted 
          ? "bg-white text-foreground border-2 border-gray-200" 
          : "bg-white text-foreground",
        isPopular && "outline"
      )}
    >
      {/* Remove HighlightedBackground since we don't want dark overlay */}
      
      {/* Rest of the component remains the same */}
      <div className="relative h-12">
        {typeof price === "number" ? (
          <NumberFlow
            format={{
              style: "currency",
              currency: "CAD",
              trailingZeroDisplay: "stripIfInteger",
            }}
            value={price}
            className="text-4xl font-medium"
          />
        ) : (
          <h1 className="text-4xl font-medium">{price}</h1>
        )}
        <div className={cn(
          "text-sm font-medium mt-1",
          isHighlighted ? "text-blue-600" : "text-blue-600"
        )}>
          {tier.sessionsIncluded} grooming session{tier.sessionsIncluded !== 1 ? "s" : ""} included
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature: string, index: number) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm font-medium text-foreground/60"
            >
              <BadgeCheck
                strokeWidth={1}
                size={16}
                className="text-green-500"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Call to Action Button */}
      <Button
        onClick={onSubscribe}
        disabled={isLoading}
        variant="expandIcon"
        Icon={isLoading ? Loader2 : ArrowRight}
        iconPlacement="right"
        className={cn(
          "h-fit w-full rounded-lg hover:glow-cinnamon",
          isLoading && "animate-pulse"
        )}
      >
        {isLoading ? "Processing..." : tier.cta}
      </Button>
    </div>
  );
};

// Pricing Header
const PricingHeader = ({
  title,
  subtitle,
  frequencies,
  selectedFrequency,
  onFrequencyChange,
}: {
  title: string;
  subtitle: string;
  frequencies: string[];
  selectedFrequency: string;
  onFrequencyChange: (frequency: string) => void;
}) => (
  <div className="space-y-7 text-center">
    <div className="space-y-4">
      <h1 className="text-4xl font-medium md:text-5xl">{title}</h1>
      <p className="text-xl text-gray-600">{subtitle}</p>
    </div>
    <div className="mx-auto flex w-fit rounded-full bg-[#F3F4F6] p-1">
      {frequencies.map((freq) => (
        <Tab
          key={freq}
          text={freq}
          selected={selectedFrequency === freq}
          setSelected={onFrequencyChange}
          discount={freq === "yearly"}
        />
      ))}
    </div>
  </div>
);

