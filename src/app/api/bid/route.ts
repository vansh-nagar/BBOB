// app/api/bid/route.ts

let highestBid = 0;
let bidHistory: { name: string; amount: number }[] = [];
let currentStudentIndex = 0;
let auctionTime = 10; // seconds
let students = require("@/data/students").studentsData;
// in-memory purchases: user name -> list of purchased students with amount
const purchases = new Map<string, { student: any; amount: number }[]>();

export async function GET(request: Request) {
  // Allow filtering purchases by user name via query param (?user=Name)
  const { searchParams } = new URL(request.url);
  const userParam = searchParams.get("user") ?? undefined;
  const userPurchases = userParam ? purchases.get(userParam) ?? [] : [];
  return Response.json({
    success: true,
    highestBid,
    bids: bidHistory,
    currentStudent: students[currentStudentIndex],
    timer: auctionTime,
    purchases: userPurchases,
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
    bids: bidHistory,
    currentStudent: students[currentStudentIndex],
    timer: auctionTime,
  });
}

// Auto decrease timer every second and change student
setInterval(() => {
  if (auctionTime > 0) {
    auctionTime--;
  } else {
    // auction round ended: record winner if any before rotating
    if (bidHistory.length > 0) {
      const winner = bidHistory[0];
      const student = students[currentStudentIndex];
      const list = purchases.get(winner.name) ?? [];
      list.push({ student, amount: winner.amount });
      purchases.set(winner.name, list);
    }
    currentStudentIndex = (currentStudentIndex + 1) % students.length;
    highestBid = 0;
    bidHistory = [];
    auctionTime = 10;
  }
}, 1000);
