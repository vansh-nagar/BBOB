// app/api/bid/route.ts

let highestBid = 0;
let bidHistory: { name: string; amount: number }[] = [];
let currentStudentIndex = 0;
let auctionTime = 10; // seconds
let students = require("@/data/students").studentsData;

export async function GET() {
  return Response.json({
    success: true,
    highestBid,
    bidHistory,
    currentStudent: students[currentStudentIndex],
    timer: auctionTime,
  });
}

export async function POST(request: Request) {
  const { name, amount } = await request.json();

  highestBid = amount;
  bidHistory.unshift({ name, amount }); // Adds newest bid at top
  auctionTime = 10; // Reset timer after every bid

  return Response.json({
    success: true,
    highestBid,
    bidHistory,
    currentStudent: students[currentStudentIndex],
    timer: auctionTime,
  });
}

// Auto decrease timer every second and change student
setInterval(() => {
  if (auctionTime > 0) {
    auctionTime--;
  } else {
    currentStudentIndex = (currentStudentIndex + 1) % students.length;
    highestBid = 0;
    bidHistory = [];
    auctionTime = 10;
  }
}, 1000);
