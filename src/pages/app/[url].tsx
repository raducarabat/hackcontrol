import { api } from "@/trpc/api";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { Link, Button } from "@/ui";
import { ArrowLeft, Send } from "@/ui/icons";
import EditHackathon from "@/components/editHackathon";
import Loading from "@/components/loading";
import Prepare from "@/components/prepare";
import ParticipationCard from "@/components/participationCard";
import CopyKey from "@/components/copyKey";
import HackathonInfo from "@/components/hackathonInfo";
import AnnouncementManager from "@/components/announcementManager";
import AnnouncementDisplay from "@/components/announcementDisplay";

const DashUrl = () => {
  const router = useRouter();
  const { url } = router.query;
  const { data: session } = useSession();

  // Get public hackathon data first
  const { data: publicData, isLoading: publicLoading } =
    api.hackathon.getHackathonPublic.useQuery({
      url: url as string,
    });

  // Get management data only if user is owner
  const { data: managementData, isLoading: managementLoading } =
    api.hackathon.getHackathonManagement.useQuery(
      {
        url: url as string,
      },
      {
        enabled: !!publicData?.isOwner && session?.user?.role === "ADMIN",
      },
    );

  const isLoading = publicLoading || (publicData?.isOwner && managementLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!publicData || !publicData.hackathon) {
    router.push("/app");
    return null;
  }

  const isOwner = publicData.isOwner;
  const hackathon = publicData.hackathon;
  const userParticipation = publicData.userParticipation;

  // Admin/Owner View
  if (isOwner && managementData) {
    return (
      <>
        <Head>
          <title>{hackathon.name} - Project Hackathon (Management)</title>
        </Head>
        <div className="mt-16 flex w-full flex-col justify-between space-y-3 border-b border-neutral-800 px-6 py-4 md:flex-row md:items-center md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link href="/app">
              <ArrowLeft
                width={24}
                className="cursor-pointer transition-all hover:-translate-x-0.5"
              />
            </Link>
            <h1 className="text-xl font-medium md:text-2xl">
              {hackathon.name}
            </h1>
            <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
              OWNER
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <CopyKey url={hackathon.url} />
            <EditHackathon
              id={hackathon.id}
              key={hackathon.url}
              name={hackathon.name}
              description={hackathon.description || ""}
              url={hackathon.url}
              rules={hackathon.rules || undefined}
              criteria={hackathon.criteria || undefined}
              is_finished={hackathon.is_finished}
            />
          </div>
        </div>
        <div className="container mx-auto mt-8 space-y-8 px-6">
          {/* Announcements Section */}
          <div className="rounded-lg border border-neutral-800 p-6">
            <AnnouncementManager
              hackathonId={hackathon.id}
              hackathonUrl={hackathon.url}
            />
          </div>

          {/* Participants Section */}
          {managementData.participants &&
          managementData.participants.length > 0 ? (
            <div>
              <p className="mb-3">
                {managementData.participants.length} participants
              </p>
              <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mb-16">
                {managementData.participants
                  .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                  .map((participant) => (
                    <ParticipationCard key={participant.id} {...participant} />
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Prepare url={hackathon.url} />
            </div>
          )}
        </div>
      </>
    );
  }

  // Regular User View
  return (
    <>
      <Head>
        <title>{hackathon.name} - Project Hackathon</title>
      </Head>
      <div className="mt-16 flex w-full flex-col justify-between space-y-3 border-b border-neutral-800 px-6 py-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <Link href="/app">
            <ArrowLeft
              width={24}
              className="cursor-pointer transition-all hover:-translate-x-0.5"
            />
          </Link>
          <h1 className="text-xl font-medium md:text-2xl">{hackathon.name}</h1>
          {hackathon.is_finished && (
            <span className="rounded-full bg-yellow-600 px-2 py-1 text-xs font-medium text-white">
              FINISHED
            </span>
          )}
        </div>
      </div>

      <AnnouncementDisplay hackathonUrl={hackathon.url} />
      <HackathonInfo
        hackathon={hackathon}
        userParticipation={userParticipation}
      />
    </>
  );
};

export default DashUrl;
