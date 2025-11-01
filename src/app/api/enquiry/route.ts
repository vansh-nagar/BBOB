import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, topic, message } = body;

    // ✅ Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // ✅ You can store this in a database or send an email here
    console.log("📩 New Enquiry Received:", body);

    return NextResponse.json(
      { message: "Enquiry submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling enquiry:", error);
    return NextResponse.json(
      { error: "Something went wrong. Try again!" },
      { status: 500 }
    );
  }
}
