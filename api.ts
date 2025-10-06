import { type FunctionReference, anyApi } from "convex/server";
import { type GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  businesses: {
    getForUser: FunctionReference<
      "query",
      "public",
      { userId: Id<"users"> },
      any
    >;
    create: FunctionReference<
      "mutation",
      "public",
      { email: string; name: string; ownerId: Id<"users">; slug: string },
      any
    >;
    getForCurrentUser: FunctionReference<
      "query",
      "public",
      Record<string, never>,
      any
    >;
    getBySlug: FunctionReference<"query", "public", { slug: string }, any>;
  };
  memberships: {
    getBusinessMemberships: FunctionReference<
      "query",
      "public",
      { businessId: Id<"businesses"> },
      any
    >;
    getActiveBusinessMemberships: FunctionReference<
      "query",
      "public",
      { businessId: Id<"businesses"> },
      any
    >;
    getByBusiness: FunctionReference<
    "query",
    "public",
    { businessId: Id<"businesses"> },
    any
  >;
    getMembershipPlan: FunctionReference<
      "query",
      "public",
      { id: Id<"memberships"> },
      any
    >;
    createMembershipPlan: FunctionReference<
      "mutation",
      "public",
      {
        businessId: Id<"businesses">;
        name: string;
        type: "grooming" | "daycare";
        price: number;
        interval: "month" | "year";
        sessionsIncluded: number;
        description: string;
        features: Array<string>;
      },
      any
    >;
    updateMembershipPlan: FunctionReference<
      "mutation",
      "public",
      {
        id: Id<"memberships">;
        name?: string;
        type?: "grooming" | "daycare";
        price?: number;
        interval?: "month" | "year";
        sessionsIncluded?: number;
        description?: string;
        features?: Array<string>;
        order?: number;
        isActive?: boolean;
      },
      any
    >;
    deleteMembershipPlan: FunctionReference<
      "mutation",
      "public",
      { id: Id<"memberships"> },
      any
    >;
    reorderMembershipPlans: FunctionReference<
      "mutation",
      "public",
      { planIds: Array<Id<"memberships">> },
      any
    >;
    createMembershipCheckout: FunctionReference<
      "mutation",
      "public",
      {
        membershipPlanId: Id<"memberships">;
        customerEmail?: string;
        customerName?: string;
      },
      any
    >;
    getMembershipByStripePriceId: FunctionReference<
      "query",
      "public",
      { stripePriceId: string },
      any
    >;
  };
  appointments: {
    getForBusinessInRange: FunctionReference<
      "query",
      "public",
      {
        businessId: Id<"businesses">;
        endMs: number;
        petId?: Id<"pets">;
        startMs: number;
        status?:
          | "pending"
          | "confirmed"
          | "in_progress"
          | "completed"
          | "cancelled"
          | "no_show"
          | "rescheduled";
      },
      any
    >;
    createAppointment: FunctionReference<
      "mutation",
      "public",
      {
        autoConfirm?: boolean;
        businessId: Id<"businesses">;
        endTime: string;
        estimatedDuration: number;
        internalNotes?: string;
        petId: Id<"pets">;
        scheduledDate: number;
        serviceIds: Array<Id<"services">>;
        specialInstructions?: string;
        startTime: string;
        title: string;
        userId: Id<"users">;
      },
      any
    >;
    rescheduleAppointment: FunctionReference<
      "mutation",
      "public",
      {
        endTime: string;
        id: Id<"appointments">;
        scheduledDate: number;
        startTime: string;
      },
      any
    >;
    updateAppointment: FunctionReference<
      "mutation",
      "public",
      {
        id: Id<"appointments">;
        internalNotes?: string;
        petId?: Id<"pets">;
        serviceIds?: Array<Id<"services">>;
        specialInstructions?: string;
        status?:
          | "pending"
          | "confirmed"
          | "in_progress"
          | "completed"
          | "cancelled"
          | "no_show"
          | "rescheduled";
      },
      any
    >;
    setAppointmentStatus: FunctionReference<
      "mutation",
      "public",
      {
        id: Id<"appointments">;
        status:
          | "pending"
          | "confirmed"
          | "in_progress"
          | "completed"
          | "cancelled"
          | "no_show"
          | "rescheduled";
      },
      any
    >;
    deleteAppointment: FunctionReference<
      "mutation",
      "public",
      { id: Id<"appointments"> },
      any
    >;
    getAppointmentDetails: FunctionReference<
      "query",
      "public",
      { id: Id<"appointments"> },
      any
    >;
  };
  customer: {
    getForBusiness: FunctionReference<
      "query",
      "public",
      { businessId: Id<"businesses"> },
      any
    >;
    createCustomer: FunctionReference<
      "mutation",
      "public",
      {
        businessId: Id<"businesses">;
        email: string;
        name: string;
        phone: string;
      },
      any
    >;
    updateCustomer: FunctionReference<
      "mutation",
      "public",
      { email?: string; id: Id<"customers">; name?: string; phone?: string },
      any
    >;
    deleteCustomer: FunctionReference<
      "mutation",
      "public",
      { id: Id<"customers"> },
      any
    >;
    getForBusinessWithPets: FunctionReference<
      "query",
      "public",
      { businessId: Id<"businesses"> },
      any
    >;
  };
  pets: {
    getForUser: FunctionReference<
      "query",
      "public",
      { customerId: Id<"customers"> },
      any
    >;
    createPet: FunctionReference<
      "mutation",
      "public",
      {
        age?: number;
        breed?: string;
        color?: string;
        createdAt: number;
        customerId: Id<"customers">;
        gender: "male" | "female";
        lastVisit?: number;
        name: string;
        nextAppointment?: number;
        notes?: string;
        photos?: Array<string>;
        species: string;
        totalVisits?: number;
        weight?: number;
      },
      any
    >;
    updatePet: FunctionReference<
      "mutation",
      "public",
      {
        age?: number;
        breed?: string;
        color?: string;
        gender?: "male" | "female";
        id: Id<"pets">;
        isActive?: boolean;
        lastVisit?: number;
        name?: string;
        nextAppointment?: number;
        photos?: Array<string>;
        species?: string;
        weight?: number;
      },
      any
    >;
    deletePet: FunctionReference<"mutation", "public", { id: Id<"pets"> }, any>;
    getForUserWithCustomer: FunctionReference<
      "query",
      "public",
      { customerId: Id<"customers"> },
      any
    >;
    getAllPetsForBusiness: FunctionReference<
      "query",
      "public",
      { businessId: Id<"businesses"> },
      any
    >;
  };
  services: {
    getByBusiness: FunctionReference<
      "query",
      "public",
      { businessId: Id<"businesses"> },
      any
    >;
  };
  stripe: {
    createCheckoutSession: FunctionReference<
      "action",
      "public",
      {
        businessId: Id<"businesses">;
        cancelUrl: string;
        email: string;
        successUrl: string;
      },
      any
    >;
    createPortalSession: FunctionReference<
      "action",
      "public",
      { stripeCustomerId: string },
      any
    >;
  };
  users: { getCurrent: FunctionReference<"query", "public", any, any> };
  
};
export type InternalApiType = {};