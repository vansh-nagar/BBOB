import {
  Clock,
  ClockIcon,
  Cpu,
  Fingerprint,
  Lightbulb,
  Pencil,
  Settings2,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Event Highlights{" "}
          </h2>
          <p>
            A fast-paced English auction where teams bid using virtual coins,
            form their squads, and compete to build the best solution in just 24
            hours.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-5xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="size-4" />
              <h3 className="text-sm font-medium">English Auction</h3>
            </div>
            <p className="text-sm">
              Teams bid virtually on participants to build their dream tech
              teams.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-4" />
              <h3 className="text-sm font-medium">24-hour Challenge</h3>
            </div>
            <p className="text-sm">
              You have just 24 hours to design and build the auction website.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <h3 className="text-sm font-medium">Organized by</h3>
            </div>
            <p className="text-sm">
              Computer Science Dept. • Battle of Bytes Committee
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4" />
              <h3 className="text-sm font-medium">Creativity Allowed</h3>
            </div>
            <p className="text-sm">
              No design or tech stack limitations – innovation is rewarded.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
