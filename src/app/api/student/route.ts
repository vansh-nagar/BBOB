import { NextResponse } from "next/server";
import { studentsData } from "@/data/students";

let currentStudent =
  studentsData[Math.floor(Math.random() * studentsData.length)];
let timer = 10; // seconds

export async function GET() {
  return NextResponse.json({ student: currentStudent, timer });
}
