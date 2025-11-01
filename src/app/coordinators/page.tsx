"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Person = {
  name: string;
  role?: string;
  phone?: string;
};

const faculty: Person[] = [
  { name: "Dr. Piyush Gupta" },
  { name: "Mr. Santosh Kumar Sharma" },
];

const seniors: Person[] = [
  { name: "Harpreet Singh", role: "Event Lead", phone: "8384900013" },
  { name: "Sanchi Malhotra", role: "Operation Lead", phone: "7300016373" },
];

const students: Person[] = [
  { name: "Ashank Agrawal", role: "Tech Co-Lead", phone: "8209789396" },
  { name: "Hiya Arya", role: "Promotion Lead", phone: "9664006534" },
  { name: "Manalika Agarwal", role: "Tech Co-Lead", phone: "9875101571" },
  { name: "Sarthak Sinha", role: "Design & Social Media Lead", phone: "6376353389" },
  { name: "Somya Upadhyay", role: "Promotion Lead", phone: "9358164038" },
];

function PeopleGrid({ title, people }: { title: string; people: Person[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((p) => (
            <div key={p.name} className=" rounded-md p-3">
              <div className="font-semibold">{p.name}</div>
              {p.role && <div className="text-sm text-muted-foreground">{p.role}</div>}
              {p.phone && (
                <a href={`tel:${p.phone}`} className="text-sm text-primary hover:underline">
                   {p.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CoordinatorsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Coordinators</h1>
      <PeopleGrid title="Faculty Coordinators" people={faculty} />
      <PeopleGrid title="Senior Coordinators" people={seniors} />
      <PeopleGrid title="Student Coordinators" people={students} />
      <div className="text-center text-sm text-muted-foreground pt-4">
        © 2025 Battle of Bytes 2.0 | Designed by Team BIT Mesra
      </div>
    </main>
  );
}
