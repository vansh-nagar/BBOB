"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { studentsData } from "@/data/students";

const Page = () => {
  const [highestBid, setHighestBid] = useState(0);
  const [userName, setUserName] = useState("");
  const [bidHistory, setBidHistory] = useState<
    { name: string; amount: number }[]
  >([]);
  const [currentStudent, setCurrentStudent] = useState(studentsData[0]);
  const [timeLeft, setTimeLeft] = useState(10); // Countdown timer (frontend only for now)

  // Place bid
  const handlePlaceBid = async (amount: number) => {
    if (!userName) {
      alert("Please enter your name before bidding!");
      return;
    }
    const newBid = highestBid + amount;
    const res = await fetch("/api/bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, amount: newBid }),
    });

    const data = await res.json();
    if (data.success) {
      setHighestBid(newBid);
      setBidHistory(data.bids);
    }
  };

  // Poll bids every 2 sec
  useEffect(() => {
    const fetchBids = async () => {
      const res = await fetch("/api/bid");
      const data = await res.json();
      setBidHistory(data.bids);
      if (data.bids.length > 0) setHighestBid(data.bids[0].amount);
    };
    fetchBids();
    const interval = setInterval(fetchBids, 2000);
    return () => clearInterval(interval);
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Random Student Change
  const nextStudent = () => {
    const random =
      studentsData[Math.floor(Math.random() * studentsData.length)];
    setCurrentStudent(random);
    setBidHistory([]);
    setHighestBid(0);
    setTimeLeft(10);
  };

  const sortedBidders = [...bidHistory].sort((a, b) => b.amount - a.amount);

  return (
    <div className="flex w-full h-screen">
      {/* ✅ Student Info Section */}
      <div className="flex-1 flex justify-center items-center bg-muted">
        {currentStudent && (
          <div className="p-6 shadow rounded-xl w-[80%]">
            <h2 className="text-xl font-bold text-center mb-4">
              🎓 Current Student for Auction
            </h2>
            <div className="flex justify-center mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Student"
                className="w-32 h-32 rounded-full border shadow"
              />
            </div>
            <p className="text-lg text-center font-semibold">
              {currentStudent.name}
            </p>
            <p className="text-center text-sm">{currentStudent.roll_no}</p>
            <p className="text-center text-sm mb-3">
              {currentStudent.category}
            </p>

            <div className="mt-4">
              <p className="font-semibold mb-2">⭐ Skills</p>
              {Object.entries(currentStudent.skills).map(
                ([skill, stars], i) => (
                  <p key={i} className="text-sm flex justify-between">
                    <span>{skill}</span>
                    <span>{stars || "☆ ☆ ☆ ☆ ☆"}</span>
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Auction Section */}
      <Card className="rounded-none w-md flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Auction Bidding</CardTitle>
          <p className="text-sm text-red-500 font-semibold">
            Time Left: {timeLeft}s
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm mb-2 font-medium">Enter Your Name</p>
            <Input
              placeholder="e.g. Vansh"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm mb-2">
              Current Highest Bid: <strong>₹{highestBid}</strong>
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handlePlaceBid(50)}
            >
              +50 Place Bid
            </Button>
          </div>

          <div>
            <p className="font-semibold text-lg mb-2">Bid History</p>
            <ul className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {bidHistory.length === 0 && <li>No bids yet.</li>}
              {bidHistory.map((bid, index) => (
                <li key={index}>
                  {bid.name} — <strong>₹{bid.amount}</strong>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col w-full gap-2 items-start">
          <h3 className="text-lg font-semibold mb-2">Current Bidders</h3>
          <div className="h-[200px] overflow-y-auto w-full flex flex-col gap-2">
            {sortedBidders.map((bidder, index) => (
              <div
                key={index}
                className="w-full flex justify-between items-center p-2 border border-dashed rounded-md"
              >
                <span>{bidder.name}</span>
                <span className="font-bold">₹{bidder.amount}</span>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={nextStudent}>
            🎯 Next Random Student
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
