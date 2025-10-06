import Header from "@/components/layout/header";
import { fetchQuery } from "convex/nextjs";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import GroomingPricing from "@/components/home/groomingpricing";
import DaycarePricing from "@/components/home/daycarepricing";
import ServicesPricing from "@/components/home/services";
import { api } from "../../api";

export default async function Home() {

  const business = await fetchQuery(api.businesses.getBySlug, {
    slug: process.env.NEXT_PUBLIC_BUSINESS_SLUG || "test-grooming-shop"
  });

  if (!business) {
    return <div>Business not found</div>;
  }


  return (
    <>
      <Header />
      <Hero />
      <ServicesPricing businessSlug={business.slug} />
      <GroomingPricing businessSlug={business.slug} />
      <DaycarePricing businessSlug={business.slug} />
      <Footer />
    </>
  );
}
