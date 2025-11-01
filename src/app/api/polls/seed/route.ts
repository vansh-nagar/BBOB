import { prisma } from "@/lib/db";

const TEAMS = [
  {
    id: "team1",
    text: "Logic Luminaries",
    members: "Mr. Vishambhar Pathak & Mr. Shubhash",
    teamName: "Logic Luminaries",
    tagline: "Enlightening the Path of Innovation",
  },
  {
    id: "team2",
    text: "Code Commanders",
    members: "Mr. Puneet Sharma & Mr. Deepak Chaturvedi",
    teamName: "Code Commanders",
    tagline: "Silent, Swift, and Supreme",
  },
  {
    id: "team3",
    text: "Data Mavericks",
    members: "Mr. B. Pathak",
    teamName: "Data Mavericks",
    tagline: "Defying Limits, Defining Data",
  },
  {
    id: "team4",
    text: "Code Trail",
    members: "Dr. Gurminder Singh",
    teamName: "Code Trail",
    tagline: "Leading the Way in Innovation",
  },
  {
    id: "team5",
    text: "Quantum Coders",
    members: "Mr. Pankaj Sharma",
    teamName: "Quantum Coders",
    tagline: "Breaking Limits, Building Futures",
  },
  {
    id: "team6",
    text: "Python Pioneers",
    members: "Dr. Seema Gaur & Dr. Archana Bhatnagar",
    teamName: "Python Pioneers",
    tagline: "Innovate, Automate, Dominate",
  },
  {
    id: "team7",
    text: "Java Jesters",
    members: "Mr. Santosh Sharma",
    teamName: "Java Jesters",
    tagline: "Powerful Code, Limitless Impact",
  },
  {
    id: "team8",
    text: "Ruby Renegades",
    members: "Mr. Abhishek & Mr. Santosh Kumar Agarwal",
    teamName: "Ruby Renegades",
    tagline: "Rewriting the Rules of Code",
  },
  {
    id: "team9",
    text: "Syntax Samurai",
    members: "Dr. Vivek Gaur & Mr. Madan Mohan Agarwal",
    teamName: "Syntax Samurai",
    tagline: "Precision in Every Command",
  },
  {
    id: "team10",
    text: "Byte Busters",
    members: "Dr. Anju Sharma",
    teamName: "Byte Busters",
    tagline: "Smashing Errors, Delivering Perfection",
  },
];

export async function POST() {
  try {
    const today = new Date();
    const resetDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    // create a new poll for today (optional: close existing)
    const poll = await prisma.poll.create({
      data: {
        question: "Which team will win?",
        options: TEAMS,
        reset_date: resetDate,
      },
    });
    return Response.json({ created: true, poll });
  } catch (e: any) {
    return Response.json({ error: { code: "SERVER_ERROR", message: e?.message ?? "seed failed" } }, { status: 500 });
  }
}

export async function GET() {
  try {
    const today = new Date();
    const resetDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const poll = await prisma.poll.findFirst({ where: { reset_date: resetDate }, orderBy: { created_at: "desc" } });
    return Response.json(poll ?? {});
  } catch (e: any) {
    return Response.json({ error: { code: "SERVER_ERROR", message: e?.message ?? "seed get failed" } }, { status: 500 });
  }
}
