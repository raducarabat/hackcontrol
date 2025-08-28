import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "..";

export const scoringRouter = createTRPCRouter({
  //------
  // Submit score (judges only) =>
  submitScore: protectedProcedure
    .input(
      z.object({
        participationId: z.string(),
        score: z.number().min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get the participation to find the hackathon
      const participation = await ctx.prisma.participation.findUnique({
        where: { id: input.participationId },
        include: {
          hackathon: {
            select: {
              id: true,
              creatorId: true,
            },
          },
        },
      });

      if (!participation) {
        throw new Error("Participation not found");
      }

      const hackathonId = participation.hackathon?.id;
      if (!hackathonId) {
        throw new Error("Hackathon not found");
      }

      // Check if user can judge this hackathon
      const canJudge = ctx.session.user.role === "ADMIN" ||
        participation.hackathon?.creatorId === userId ||
        await ctx.prisma.judge.findUnique({
          where: {
            userId_hackathonId: {
              userId,
              hackathonId,
            },
          },
        });

      if (!canJudge) {
        throw new Error("Not authorized to judge this hackathon");
      }

      // Find the judge record to get judgeId
      const judge = await ctx.prisma.judge.findUnique({
        where: {
          userId_hackathonId: {
            userId,
            hackathonId,
          },
        },
      });

      if (!judge) {
        throw new Error("Judge record not found");
      }

      // Create or update the score
      return ctx.prisma.score.upsert({
        where: {
          judgeId_participationId: {
            judgeId: judge.id,
            participationId: input.participationId,
          },
        },
        update: {
          score: input.score,
        },
        create: {
          judgeId: judge.id,
          participationId: input.participationId,
          score: input.score,
        },
      });
    }),

  //------
  // Get all scores for a submission =>
  getSubmissionScores: publicProcedure
    .input(z.object({ participationId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.score.findMany({
        where: {
          participationId: input.participationId,
        },
        include: {
          judge: {
            include: {
              user: {
                select: {
                  name: true,
                  username: true,
                },
              },
            },
          },
        },
      });
    }),

  //------
  // Get all scores by a specific judge for a hackathon =>
  getJudgeScores: protectedProcedure
    .input(z.object({ hackathonId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Find the judge record
      const judge = await ctx.prisma.judge.findUnique({
        where: {
          userId_hackathonId: {
            userId,
            hackathonId: input.hackathonId,
          },
        },
      });

      if (!judge) {
        throw new Error("Judge record not found");
      }

      return ctx.prisma.score.findMany({
        where: {
          judgeId: judge.id,
        },
        include: {
          participation: {
            select: {
              id: true,
              title: true,
              description: true,
              project_url: true,
              creatorName: true,
            },
          },
        },
      });
    }),

  //------
  // Calculate rankings for a hackathon =>
  calculateRankings: publicProcedure
    .input(z.object({ hackathonId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get hackathon with min judges requirement
      const hackathon = await ctx.prisma.hackathon.findUnique({
        where: { id: input.hackathonId },
        select: { min_judges_required: true, url: true },
      });

      if (!hackathon) {
        throw new Error("Hackathon not found");
      }

      // Get all participations with their scores
      const participations = await ctx.prisma.participation.findMany({
        where: {
          hackathon_url: hackathon.url,
        },
        include: {
          scores: true,
        },
      });

      // Calculate rankings
      const ranked = participations
        .map((participation) => {
          const scores = participation.scores;
          const totalScores = scores.length;
          const averageScore = totalScores > 0 
            ? scores.reduce((sum, s) => sum + s.score, 0) / totalScores 
            : 0;

          return {
            ...participation,
            averageScore,
            totalScores,
            isEligibleForRanking: totalScores >= hackathon.min_judges_required,
          };
        })
        .filter(p => p.isEligibleForRanking)
        .sort((a, b) => {
          // Sort by average score descending, then by total scores descending as tiebreaker
          if (b.averageScore !== a.averageScore) {
            return b.averageScore - a.averageScore;
          }
          return b.totalScores - a.totalScores;
        })
        .map((submission, index) => ({
          ...submission,
          rank: index + 1,
          isWinner: index === 0,
          isPodium: index < 3,
        }));

      // Get ineligible submissions
      const ineligible = participations
        .map((participation) => {
          const scores = participation.scores;
          const totalScores = scores.length;
          const averageScore = totalScores > 0 
            ? scores.reduce((sum, s) => sum + s.score, 0) / totalScores 
            : 0;

          return {
            ...participation,
            averageScore,
            totalScores,
            isEligibleForRanking: totalScores >= hackathon.min_judges_required,
          };
        })
        .filter(p => !p.isEligibleForRanking);

      return {
        eligible: ranked,
        ineligible,
        minJudgesRequired: hackathon.min_judges_required,
      };
    }),

  //------
  // Update minimum judges required (organizer only) =>
  updateMinJudges: protectedProcedure
    .input(
      z.object({
        hackathonId: z.string(),
        minJudges: z.number().min(1).max(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if user is organizer or admin
      const hackathon = await ctx.prisma.hackathon.findUnique({
        where: { id: input.hackathonId },
        select: { creatorId: true },
      });

      if (!hackathon) {
        throw new Error("Hackathon not found");
      }

      const canUpdate = ctx.session.user.role === "ADMIN" || hackathon.creatorId === userId;

      if (!canUpdate) {
        throw new Error("Not authorized to update this hackathon");
      }

      return ctx.prisma.hackathon.update({
        where: { id: input.hackathonId },
        data: { min_judges_required: input.minJudges },
      });
    }),
});