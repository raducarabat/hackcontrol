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
        enabled: !!publicData?.isOwner && (session?.user?.role === "ADMIN" || session?.user?.role === "ORGANIZER"),
      },
    );

  // Check if the owner is also a judge (so they can score their own hackathon)
  const { data: ownerJudgeStatus } = api.hackathon.getHackathonJudgeView.useQuery(
    {
      url: url as string,
    },
    {
      enabled: !!publicData?.isOwner && !!managementData?.hackathon?.id,
    },
  );

  // Get judge view data if user might be a judge but not owner
  const { data: judgeData, isLoading: judgeLoading } =
    api.hackathon.getHackathonJudgeView.useQuery(
      {
        url: url as string,
      },
      {
        enabled: !!session?.user && !publicData?.isOwner,
      },
    );

  const isLoading = publicLoading || (publicData?.isOwner && managementLoading) || (!publicData?.isOwner && judgeLoading);

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
            {ownerJudgeStatus?.isJudge && (
              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                JUDGE
              </span>
            )}
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

          {/* Stats Section */}
          <div className="flex items-center space-x-6 rounded-lg border border-neutral-800 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {managementData.participants?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {managementData.judgeCount || 0}
              </div>
              <div className="text-sm text-gray-400">Judges</div>
            </div>
          </div>

          {/* Participants Section */}
          {managementData.participants &&
          managementData.participants.length > 0 ? (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Submissions</h2>
              <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mb-16">
                {managementData.participants
                  .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                  .map((participant) => (
                    <ParticipationCard 
                      key={participant.id} 
                      participation={participant}
                      isJudging={ownerJudgeStatus?.isJudge || false}
                      hackathonId={hackathon.id}
                      isHackathonFinished={hackathon.is_finished}
                    />
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

  // Judge View (not owner but can judge)
  if (judgeData?.isJudge) {
    return (
      <>
        <Head>
          <title>{hackathon.name} - Project Hackathon (Judge View)</title>
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
            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
              JUDGE
            </span>
          </div>
        </div>
        <div className="container mx-auto mt-8 space-y-8 px-6">
          {/* Submissions Section for Judges */}
          {judgeData.participants && judgeData.participants.length > 0 ? (
            <div>
              <h2 className="mb-3 text-lg font-semibold">
                Submissions to Review ({judgeData.participants.length})
              </h2>
              <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mb-16">
                {judgeData.participants
                  .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                  .map((participant) => (
                    <ParticipationCard 
                      key={participant.id} 
                      participation={participant}
                      isJudging={true}
                      hackathonId={hackathon.id}
                      isHackathonFinished={hackathon.is_finished}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="rounded-lg border border-neutral-800 p-8 text-center">
                <h2 className="mb-2 text-xl font-medium">No Submissions Yet</h2>
                <p className="text-gray-400">
                  No participants have submitted projects to this hackathon yet.
                </p>
              </div>
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
