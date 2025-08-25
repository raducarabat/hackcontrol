import { Button } from "@/ui";
import { Send, Trophy, Clock, CheckCircle } from "@/ui/icons";
import { useRouter } from "next/navigation";

interface HackathonInfoProps {
  hackathon: {
    id: string;
    name: string;
    description?: string | null;
    rules?: string | null;
    criteria?: string | null;
    url: string;
    is_finished: boolean;
    updatedAt: Date | string;
  };
  userParticipation?: {
    id: string;
    title: string;
    description: string;
    is_reviewed: boolean;
    is_winner: boolean;
  } | null;
}

const HackathonInfo = ({
  hackathon,
  userParticipation,
}: HackathonInfoProps) => {
  const router = useRouter();

  return (
    <div className="container mx-auto mt-8 max-w-4xl px-6">
      <div className="rounded-lg border border-neutral-800 p-6">
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">About this Hackathon</h2>
          {hackathon.description ? (
            <p className="leading-relaxed text-gray-400">
              {hackathon.description}
            </p>
          ) : (
            <p className="italic text-gray-500">No description provided</p>
          )}
        </div>

        {/* Rules Section */}
        {hackathon.rules && (
          <div className="mb-6 border-t border-neutral-800 pt-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              📋 Hackathon Rules
            </h3>
            <div className="rounded-lg bg-neutral-900/50 p-4">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-300">
                {hackathon.rules}
              </p>
            </div>
          </div>
        )}

        {/* Judging Criteria Section */}
        {hackathon.criteria && (
          <div className="mb-6 border-t border-neutral-800 pt-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              ⚖️ Judging Criteria
            </h3>
            <div className="rounded-lg bg-neutral-900/50 p-4">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-300">
                {hackathon.criteria}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 border-t border-neutral-800 pt-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm text-gray-500">Status</p>
            <p className="flex items-center gap-2 font-medium">
              {hackathon.is_finished ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="text-yellow-500">Finished</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                  <span className="text-green-500">
                    Active - Accepting Submissions
                  </span>
                </>
              )}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">
              {new Date(hackathon.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* User's submission status */}
        <div className="border-t border-neutral-800 pt-6">
          {userParticipation ? (
            <div className="rounded-lg border border-green-800/30 bg-green-900/10 p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-green-400">
                    <CheckCircle width={20} />
                    You have submitted a project
                  </h3>
                  <p className="mb-2 text-white">
                    <span className="text-sm text-gray-400">Project: </span>
                    <span className="font-medium">
                      {userParticipation.title}
                    </span>
                  </p>
                  {userParticipation.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-gray-400">
                      {userParticipation.description}
                    </p>
                  )}
                </div>
                {userParticipation.is_winner && (
                  <div className="flex items-center gap-1 rounded-full bg-yellow-600 px-3 py-1">
                    <Trophy width={16} />
                    <span className="text-sm font-bold text-white">WINNER</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Review Status:</span>
                {userParticipation.is_reviewed ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                    <CheckCircle width={14} />
                    Reviewed by organizers
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-medium text-yellow-400">
                    <Clock width={14} />
                    Pending review
                  </span>
                )}
              </div>
            </div>
          ) : (
            <>
              {!hackathon.is_finished ? (
                <div className="rounded-lg border border-blue-800/30 bg-blue-900/10 p-5">
                  <h3 className="mb-3 text-lg font-semibold text-blue-400">
                    Ready to participate?
                  </h3>
                  <p className="mb-4 text-gray-400">
                    Submit your project to this hackathon and compete with other
                    developers!
                  </p>
                  <Button
                    onClick={() => router.push(`/send/${hackathon.url}`)}
                    icon={<Send width={18} />}
                  >
                    Submit Your Project
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-800/30 bg-gray-900/20 p-5">
                  <p className="text-gray-400">
                    🏁 This hackathon has ended and is no longer accepting
                    submissions.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* How to Participate Guide */}
      {!hackathon.is_finished && !userParticipation && (
        <div className="mt-6 rounded-lg border border-neutral-800 p-6">
          <h3 className="mb-4 text-lg font-semibold">How to Participate</h3>
          <ol className="space-y-3 text-gray-400">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white">
                1
              </span>
              <span>
                Review the hackathon description and requirements carefully
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white">
                2
              </span>
              <span>
                Build your project according to the theme and guidelines
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white">
                3
              </span>
              <span>
                Click the &quot;Submit Your Project&quot; button above
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white">
                4
              </span>
              <span>Fill in your project details and submit</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-white">
                5
              </span>
              <span>
                Wait for the organizers to review and announce winners
              </span>
            </li>
          </ol>
        </div>
      )}

      {/* Results Section for Finished Hackathons */}
      {hackathon.is_finished && (
        <div className="mt-6 rounded-lg border border-neutral-800 p-6">
          <h3 className="mb-4 text-lg font-semibold">Hackathon Results</h3>
          {userParticipation?.is_winner ? (
            <div className="rounded-lg bg-yellow-900/20 p-4 text-center">
              <Trophy width={48} className="mx-auto mb-2 text-yellow-500" />
              <p className="text-lg font-bold text-yellow-400">
                Congratulations! You won this hackathon! 🎉
              </p>
            </div>
          ) : (
            <p className="text-gray-400">
              The hackathon has concluded. Check back to see if you&apos;re
              among the winners!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HackathonInfo;
