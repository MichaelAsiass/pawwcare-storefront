"use client"

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; 
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CalendarIcon, Clock, DollarSign, Dog, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const bookingFormSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email({ message: "Invalid email address" }),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  petName: z.string().min(1, "Pet name is required"),
  petSpecies: z.enum(["dog", "cat"]),
  petBreed: z.string().optional(),
  petAge: z.string().optional(),
  petWeight: z.string().optional(),
  petGender: z.enum(["male", "female"]),
  appointmentDate: z.date({ message: "Please select a date" }),
  appointmentTime: z.string().min(1, "Please select a time"),
  specialInstructions: z.string().optional(),
});



function AppointmentBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const business = useQuery(api.businesses.getBySlug, {
    slug: process.env.NEXT_PUBLIC_BUSINESS_SLUG || "test-grooming-shop",
  });

  const services = useQuery(
    api.services.getByBusiness,
    business ? { businessId: business._id } : "skip"
  );

  const createCustomer = useMutation(api.customer.createCustomer);
  const createPet = useMutation(api.pets.createPet);
  const createAppointment = useMutation(api.appointments.createAppointment);
  const createCheckout = useAction(api.stripe.createAppointmentCheckout);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId: serviceId || "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      petName: "",
      petSpecies: "dog",
      petBreed: "",
      petAge: "",
      petWeight: "",
      petGender: "male",
      appointmentTime: "",
      specialInstructions: "",
    },
  });

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00",
  ];

  const formatPrice = (priceInCents: number) => `$${(priceInCents / 100).toFixed(2)}`;
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const selectedServiceId = form.watch("serviceId");
  const selectedService = services?.find((s: any) => s._id === selectedServiceId);

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  const onSubmit = async (values: BookingFormValues) => {
    if (!business || !selectedService) {
      toast.error("Business or service not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const customerId = await createCustomer({
        businessId: business._id,
        name: values.customerName,
        email: values.customerEmail,
        phone: values.customerPhone,
      });

      const petId = await createPet({
        customerId,
        name: values.petName,
        species: values.petSpecies,
        breed: values.petBreed || undefined,
        age: values.petAge ? parseInt(values.petAge) : undefined,
        weight: values.petWeight ? parseFloat(values.petWeight) : undefined,
        gender: values.petGender,
        createdAt: Date.now(),
      });

      const scheduledDate = values.appointmentDate.getTime();
      const endTime = calculateEndTime(values.appointmentTime, selectedService.duration);

      // Create appointment (pending payment)
      const appointmentId = await createAppointment({
        customerId,
        title: `${selectedService.name} for ${values.petName}`,
        businessId: business._id,
        petId,
        serviceIds: [values.serviceId as any],
        scheduledDate,
        startTime: values.appointmentTime,
        endTime,
        estimatedDuration: selectedService.duration,
        specialInstructions: values.specialInstructions || undefined,
        autoConfirm: false, // Only confirm after payment
      });

      // Create Stripe checkout session
      const checkoutUrl = await createCheckout({
        appointmentId,
        customerEmail: values.customerEmail,
        customerName: values.customerName,
        successUrl: `${window.location.origin}/confirmation/${appointmentId}`,
        cancelUrl: `${window.location.origin}/book?serviceId=${values.serviceId}`,
      });

      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!business) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="p-6 space-y-8">
                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Dog className="h-5 w-5" />
                    Select Service
                  </h3>
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Service *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services?.map((s: any) => (
                              <SelectItem key={s._id} value={s._id}>
                                {s.name} - {formatPrice(s.price)} ({formatDuration(s.duration)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedService && (
                    <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                      <p className="font-medium">{selectedService.name}</p>
                      <p className="text-sm text-gray-600">{selectedService.description}</p>
                      <div className="flex gap-4 text-sm">
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(selectedService.duration)}
                        </Badge>
                        <Badge variant="secondary">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatPrice(selectedService.price)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Information */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pet Information */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Dog className="h-5 w-5" />
                    Pet Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="petName"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Pet Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="petSpecies"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Species</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dog">Dog</SelectItem>
                              <SelectItem value="cat">Cat</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="petBreed"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="petGender"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="petAge"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Age (years)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="petWeight"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Weight (lbs)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Date & Time
                  </h3>
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }: { field: any }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Select Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Select Time *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Special Instructions */}
                <div className="space-y-4 pt-6 border-t">
                  <div>
                    <h3 className="text-lg font-semibold">Special Instructions</h3>
                    <p className="text-sm text-muted-foreground">Any specific requests or information we should know?</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., My pet is nervous around other animals..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Book Appointment"
                    )}
                  </Button>
                </div>
              </Card>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function AppointmentPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </>
    }>
      <AppointmentBookingForm />
    </Suspense>
  );
}
