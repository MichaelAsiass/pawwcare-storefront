"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Calendar,
  CheckCircle,
  Mail,
  Phone,
  User,
  Dog,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ConfirmationPage() {
  const params = useParams();
  const appointmentId = params.appointmentId as string;

  // Get appointment details
  // Note: You'll need to create this query in your Convex
  // const appointment = useQuery(api.appointments.getById, { id: appointmentId });

  // For now, using mock data structure
  const formatPrice = (priceInCents: number) =>
    `$${(priceInCents / 100).toFixed(2)}`;

  const formatDate = (timestamp: number) =>
    format(new Date(timestamp), "EEEE, MMMM d, yyyy");

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Mock data - replace with real query
  const appointment = {
    _id: appointmentId,
    title: "Full Grooming for Buddy",
    scheduledDate: Date.now() + 86400000, // Tomorrow
    startTime: "10:00",
    endTime: "11:30",
    status: "confirmed",
    totalAmount: 8500, // $85
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
    },
    pet: {
      name: "Buddy",
      species: "dog",
      breed: "Golden Retriever",
      weight: 65,
    },
    services: [{ name: "Full Grooming", price: 8500 }],
    specialInstructions: "Buddy is nervous around loud noises",
  };

  const handleAddToCalendar = () => {
    // Create iCal format
    const startDate = new Date(appointment.scheduledDate);
    const [hours, minutes] = appointment.startTime.split(":");
    startDate.setHours(parseInt(hours), parseInt(minutes));

    const endDate = new Date(appointment.scheduledDate);
    const [endHours, endMinutes] = appointment.endTime.split(":");
    endDate.setHours(parseInt(endHours), parseInt(endMinutes));

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${appointment.title}
DTSTART:${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DESCRIPTION:Pet grooming appointment
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "appointment.ics";
    link.click();
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600">
              Your appointment has been successfully scheduled
            </p>
            <Badge variant="outline" className="mt-4">
              Confirmation #{appointmentId.slice(0, 8).toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-6">
            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {formatDate(appointment.scheduledDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {formatTime(appointment.startTime)} -{" "}
                      {formatTime(appointment.endTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {appointment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="font-medium text-lg">
                      {formatPrice(appointment.totalAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {appointment.services.map((service: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <span className="font-medium">{service.name}</span>
                      <span className="text-muted-foreground">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer & Pet Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{appointment.customer.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{appointment.customer.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{appointment.customer.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dog className="h-5 w-5" />
                    Pet Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{appointment.pet.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Breed</p>
                    <p className="text-sm">{appointment.pet.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-sm">{appointment.pet.weight} lbs</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Special Instructions */}
            {appointment.specialInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {appointment.specialInstructions}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCalendar}
                variant="outline"
                className="flex-1"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <Link href="/" className="flex-1">
                <Button className="w-full">Back to Home</Button>
              </Link>
            </div>

            {/* Confirmation Email Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Confirmation email sent
                    </p>
                    <p className="text-sm text-blue-700">
                      We've sent a confirmation email to{" "}
                      {appointment.customer.email} with all the appointment
                      details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
