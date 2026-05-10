import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ServiceListing from "@/models/ServiceListing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";
  
  try {
    await dbConnect();
    
    let query = { status: "verified" } as any;
    
    if (showAll) {
      const session = await getServerSession(authOptions);
      console.log("Admin check for GET all. Session:", session?.user?.email, "Role:", session?.user?.role);
      if (session?.user?.email && session.user.role === "monasteryAdmin") {
        query = {} as any;
      }
    }

    console.log("Fetching services with query:", JSON.stringify(query));
    const services = await ServiceListing.find(query).sort({ createdAt: -1 });
    console.log(`Found ${services.length} services.`);
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceType, startDate, endDate, phone, location, description, price } = body;

    if (!serviceType || !startDate || !endDate || !phone) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const newService = await ServiceListing.create({
      providerEmail: session.user.email,
      providerName: session.user.name || session.user.email.split('@')[0],
      serviceType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      phone,
      location,
      description,
      price,
      status: "pending" // Explicitly setting default
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "monasteryAdmin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { serviceId, status } = body;

    console.log(`Updating service ${serviceId} to status: ${status}`);

    if (!serviceId || !status) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await dbConnect();
    const updatedService = await ServiceListing.findByIdAndUpdate(
      serviceId,
      { status },
      { new: true }
    );

    if (!updatedService) {
      console.log("Service not found for update.");
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 });
    }

    console.log("Service updated successfully:", updatedService.status);
    return NextResponse.json({ success: true, service: updatedService });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
