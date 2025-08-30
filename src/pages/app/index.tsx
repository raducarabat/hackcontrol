import { useState } from "react";
import Head from "next/head";
import { api } from "@/trpc/api";
import type { Hackathon } from "@prisma/client";
import { useSession } from "next-auth/react";

import { Input, Tip, Tooltip } from "@/ui";
import { ArrowDown } from "@/ui/icons";
import Up from "@/animations/up";
import Down from "@/animations/down";

import CreateNew from "@/components/createNew";
import EnterKey from "@/components/enterKey";
import HackathonCard from "@/components/hackathonCard";
import JudgesDashboard from "@/components/judgesDashboard";
import Loading from "@/components/loading";

const Dashboard = () => {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = api.hackathon.allHackathons.useQuery();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  const isAdmin = session?.user.role === "ADMIN";
  const isOrganizer = session?.user.role === "ORGANIZER";
  const canCreateHackathons = isAdmin || isOrganizer;

  return (
    <>
      <Head>
        <title>Dashboard - Project Hackathon</title>
      </Head>
      <div className="mt-16 flex w-full flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-6 py-4 sm:flex-nowrap sm:gap-0">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <EnterKey />
          {canCreateHackathons && <CreateNew />}
        </div>
      </div>
      <div className="mx-auto mb-16 mt-8 max-w-6xl px-6 md:px-0">
        <div className="border-b border-neutral-800 pb-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-medium">
              {canCreateHackathons ? "My Hackathons" : "Available Hackathons"}
            </h1>
            {canCreateHackathons && (
              <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                {isAdmin ? "ADMIN VIEW" : "ORGANIZER VIEW"}
              </span>
            )}
          </div>
          {data?.hackathon && data?.hackathon?.length > 0 ? (
            <>
              <Input
                value={search}
                placeholder="Search hackathons..."
                onChange={handleSearch}
              />
              <div className="container mx-auto mt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data?.hackathon
                    .sort(
                      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
                    )
                    .filter(
                      (hackathon: Hackathon) =>
                        hackathon.name
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        hackathon.description
                          ?.toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .map((hackathon: Hackathon) => (
                      <HackathonCard
                        key={hackathon.id}
                        name={hackathon.name}
                        description={hackathon.description || ""}
                        url={hackathon.url}
                      />
                    ))}
                </div>
              </div>
              {!isAdmin && (
                <div className="mt-6 rounded-lg border border-blue-800/30 bg-blue-900/10 p-4">
                  <p className="text-sm text-blue-300">
                    💡 Click on any hackathon to view details and submit your
                    project
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Up>
                <h1 className="mb-2 text-2xl font-medium">
                  {canCreateHackathons ? "Welcome" : "No Hackathons Available"}
                </h1>
              </Up>
              <Down delay={0.2}>
                <div className="flex flex-col items-center justify-center">
                  {canCreateHackathons ? (
                    <>
                      <p className="mb-2 text-center text-neutral-300">
                        You don&apos;t have any hackathons yet. Create one now!
                      </p>
                      <ArrowDown width={32} className="mb-2" />
                      <CreateNew />
                    </>
                  ) : (
                    <>
                      <p className="mb-4 text-center text-neutral-300">
                        No hackathons are currently available. Check back later
                        or participate using a hackathon key!
                      </p>
                      <ArrowDown width={32} className="mb-2" />
                      <EnterKey />
                    </>
                  )}
                </div>
              </Down>
            </div>
          )}
        </div>

        {/* Judge Assignments Section */}
        <JudgesDashboard />

        {/* Participations Section */}
        <h1 className="mb-4 mt-5 text-2xl font-medium">My Participations</h1>
        <div className="container mx-auto mt-4">
          {data?.participants && data?.participants?.length > 0 ? (
            <>
              <div className="container mx-auto mt-4">
                <div className="flex flex-col space-y-3">
                  {data?.participants
                    .sort(
                      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
                    )
                    .map((participant) => (
                      <div
                        key={participant.id}
                        className="flex w-full flex-col justify-between rounded-md bg-neutral-800/40 p-4 transition-all hover:bg-neutral-800/50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="mb-1 text-xl font-medium">
                              {participant.title}
                            </p>
                            {participant.is_winner && (
                              <span className="inline-block rounded-full bg-yellow-600 px-2 py-0.5 text-xs font-medium text-white">
                                🏆 WINNER
                              </span>
                            )}
                            {participant.team_members && typeof participant.team_members === 'object' && participant.team_members.members && Array.isArray(participant.team_members.members) && (
                              <div className="mt-2">
                                {participant.team_members.team_name && (
                                  <div className="text-sm font-medium text-blue-400 mb-1">
                                    👥 {participant.team_members.team_name}
                                  </div>
                                )}
                                <div className="text-xs text-gray-400">
                                  Team: {participant.team_members.members.map((member: any) => member.name).join(", ")}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {participant.team_members.members.length} member{participant.team_members.members.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                            )}
                          </div>
                          <Tooltip text="The hackathon administrators can mark each project as 'reviewed', here you will see if they have seen your project.">
                            <p className="mb-1 cursor-help text-sm">
                              {participant.is_reviewed ? (
                                <span className="text-green-500">
                                  ✓ Reviewed
                                </span>
                              ) : (
                                <span className="text-yellow-500">
                                  ⏳ Pending Review
                                </span>
                              )}
                            </p>
                          </Tooltip>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                          <span className="font-mono">
                            {participant.hackathon_name}
                          </span>
                          <span>•</span>
                          <span>
                            Submitted:{" "}
                            {new Date(
                              participant.updatedAt,
                            ).toLocaleDateString()}
                          </span>
                          {participant.description && (
                            <>
                              <span>•</span>
                              <span className="truncate">
                                {participant.description.substring(0, 100)}
                                {participant.description.length > 100 && "..."}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-green-800/30 bg-green-900/10 p-4">
                <p className="text-sm text-green-300">
                  💡 Your submissions are shown above. Check back regularly to
                  see if they&apos;ve been reviewed!
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-800 p-8">
              <Up>
                <h1 className="mb-2 text-xl font-medium">
                  No Participations Yet
                </h1>
              </Up>
              <Down delay={0.2}>
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-4 text-center text-neutral-300">
                    {canCreateHackathons
                      ? "You haven't participated in any hackathons yet."
                      : "Browse available hackathons above or enter a hackathon key to participate!"}
                  </p>
                  {!canCreateHackathons && (
                    <>
                      <ArrowDown width={32} className="mb-2" />
                      <EnterKey />
                    </>
                  )}
                </div>
              </Down>
            </div>
          )}
        </div>
        {error && (
          <Tip>
            <p className="text-red-500">
              Error: {error.data?.code} - {error.message}
            </p>
          </Tip>
        )}
      </div>
    </>
  );
};

export default Dashboard;
