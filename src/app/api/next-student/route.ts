import { studentsData } from "@/data/students";
import { NextResponse } from "next/server";

export async function POST() {
  const currentStudent =
    studentsData[Math.floor(Math.random() * studentsData.length)];
  const bids = [];
  const timer = 10;
  return NextResponse.json({ success: true, student: currentStudent });
}
