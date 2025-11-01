"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
// imports remain same...

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    topic: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Enquiry submitted successfully!");
      setFormData({ name: "", email: "", role: "", topic: "", message: "" });
    } else {
      toast.error("Failed to submit. Try again.");
    }
  };

  return (
    <section className="pt-10 flex justify-center items-center ">
      {/* ... */}
      <form
        onSubmit={handleSubmit}
        className="mt-12 space-y-6 *:space-y-3 w-md"
      >
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <Label>I am a</Label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="participant">Participant</SelectItem>
              <SelectItem value="bidder">Bidder</SelectItem>
              <SelectItem value="visitor">Visitor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Enquiry Type</Label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, topic: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bidding">Bidding Process</SelectItem>
              <SelectItem value="teams">Team/Player Details</SelectItem>
              <SelectItem value="rules">Rules & Guidelines</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="msg">Your Message</Label>
          <Textarea
            id="msg"
            rows={3}
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>

        <Button className="w-full">Submit Enquiry</Button>
      </form>
      {/* ... */}
    </section>
  );
}
