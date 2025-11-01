"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const [selectedMember, setSelectedMember] = useState("");

  const teams = [
    {
      members: "Mr. Vishambhar Pathak & Mr. Shubhash",
      teamName: "Logic Luminaries",
      tagline: "Enlightening the Path of Innovation",
    },
    {
      members: "Mr. Puneet Sharma & Mr. Deepak Chaturvedi",
      teamName: "Code Commanders",
      tagline: "Silent, Swift, and Supreme",
    },
    {
      members: "Mr. B. Pathak",
      teamName: "Data Mavericks",
      tagline: "Defying Limits, Defining Data",
    },
    {
      members: "Dr. Gurminder Singh",
      teamName: "Code Trail",
      tagline: "Leading the Way in Innovation",
    },
    {
      members: "Mr. Pankaj Sharma",
      teamName: "Quantum Coders",
      tagline: "Breaking Limits, Building Futures",
    },
    {
      members: "Dr. Seema Gaur & Dr. Archana Bhatnagar",
      teamName: "Python Pioneers",
      tagline: "Innovate, Automate, Dominate",
    },
    {
      members: "Mr. Santosh Sharma",
      teamName: "Java Jesters",
      tagline: "Powerful Code, Limitless Impact",
    },
    {
      members: "Mr. Abhishek & Mr. Santosh Kumar Agarwal",
      teamName: "Ruby Renegades",
      tagline: "Rewriting the Rules of Code",
    },
    {
      members: "Dr. Vivek Gaur & Mr. Madan Mohan Agarwal",
      teamName: "Syntax Samurai",
      tagline: "Precision in Every Command",
    },
    {
      members: "Dr. Anju Sharma",
      teamName: "Byte Busters",
      tagline: "Smashing Errors, Delivering Perfection",
    },
  ];

  // Find selected team details
  const selectedTeam = teams.find((team) => team.members === selectedMember);

  return (
    <div className=" relative flex justify-center items-center h-screen w-full">
      <video
        src={"https://dqbr6kzn27lfn.cloudfront.net/loopbg.mp4"}
        autoPlay
        loop
        muted
        className=" absolute inset-0 mask-b-from-[60%]"
      />
      <Card className=" w-md z-50">
        <CardHeader>
          <CardTitle className="text-3xl">Start Bidding</CardTitle>
          <CardDescription>
            Start the bidding process for your item.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <label className=" text-sm">Select Who You are</label>
          <Select onValueChange={(value) => setSelectedMember(value)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a Team Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Teams</SelectLabel>
                {teams.map((team, index) => (
                  <SelectItem key={index} value={team.members}>
                    {team.members}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Show Team Details */}
          {selectedTeam && (
            <div className="mt-4 p-3 border rounded-md">
              <h2 className="font-semibold text-lg">{selectedTeam.teamName}</h2>
              <p className="text-sm ">{selectedTeam.tagline}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href={"/bidding-page"} className="w-full">
            <Button disabled={!selectedTeam} className="w-full">
              Proceed to Bidding
            </Button>
          </Link>
        </CardFooter>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Current Bidding</CardTitle>
          <CardDescription>See ongoing bids and their details.</CardDescription>
        </CardHeader>

        <CardContent>
          <div></div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card> */}
    </div>
  );
};

export default page;
