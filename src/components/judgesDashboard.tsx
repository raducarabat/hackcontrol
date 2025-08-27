import { api } from "@/trpc/api";
import { Button } from "@/ui";
import { ArrowRight } from "@/ui/icons";
import Link from "next/link";

const JudgesDashboard = () => {
  const { data: judgedHackathons, isLoading } = api.judge.getJudgedHackathons.useQuery();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-neutral-800 p-6">
        <h2 className="mb-4 text-lg font-semibold">Judge Assignments</h2>
        <div className="text-gray-400">Loading your judge assignments...</div>
      </div>
    );
  }

  if (!judgedHackathons || judgedHackathons.length === 0) {
    return null; // Don't show anything if user is not a judge
  }

  return (
    <div className="rounded-lg border border-neutral-800 p-6">
      <h2 className="mb-4 text-lg font-semibold">Judge Assignments</h2>
      <div className="space-y-3">
        {judgedHackathons.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center justify-between rounded-lg border border-neutral-700 p-4"
          >
            <div>
              <h3 className="font-medium text-white">
                {assignment.hackathon.name}
              </h3>
              <p className="text-sm text-gray-400">
                {assignment.hackathon.description}
              </p>
              <div className="mt-1 flex items-center space-x-2">
                {assignment.hackathon.is_finished ? (
                  <span className="rounded-full bg-yellow-600/20 px-2 py-1 text-xs text-yellow-400">
                    Finished
                  </span>
                ) : (
                  <span className="rounded-full bg-green-600/20 px-2 py-1 text-xs text-green-400">
                    Active
                  </span>
                )}
              </div>
            </div>
            <Link href={`/app/${assignment.hackathon.url}`}>
              <Button icon={<ArrowRight width={16} />}>
                Judge
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JudgesDashboard;