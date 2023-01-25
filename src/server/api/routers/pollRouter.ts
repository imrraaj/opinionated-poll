import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";


export const pollRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllPollsCreatedByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.poll.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        question: true,
        id: true,
        options: true,
      },
    });
  }),

  getPollsByIdCreatedByUser: protectedProcedure.input(String).query(async ({ ctx, input }) => {

    const poll = await ctx.prisma.poll.findFirst({
      select: {
        question: true,
        id: true,
        options: {
          select: {
            id: true,
            option_text: true,
          },
        },
      },
      where: {
        id: input,
      },
    });
    return poll;
  }),

  getResultsForPoll: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const poll = await ctx.prisma.poll.findFirst({
      select: {
        question: true,
        id: true,
        options: {
          select: {
            id: true,
            option_text: true,
            vote_count: true,
          },
        },
      },
      where: {
        id: input.id,
      },
    });
    return poll;
  }),

  addPoll: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        options: z.array(
          z.string()
        ),
      })
    ).mutation(async ({ ctx, input }) => {
      const optionArray = input.options.map((opt) => {
        return { option_text: opt };
      });

      const pollQuestion = await ctx.prisma.poll.create({
        data: {
          question: input.question,
          ownerId: ctx.session.user.id,
          options: {
            create: optionArray,
          },
        },
      });
      return { pollQuestion }
    }),


  deletePollById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {


      const PollToBeDeleted = await ctx.prisma.poll.findUnique({
        where: {
          id: input.id,
        },
      });


      if (PollToBeDeleted) {
        // if the user is not the onwer of the poll do not delete it...
        if (PollToBeDeleted.ownerId !== ctx.session.user.id) return;


        // delete the every votes of this poll
        await ctx.prisma.vote.deleteMany({
          where: {
            pollId: input.id,
          },
        });

        // delete option for this poll
        await ctx.prisma.option.deleteMany({
          where: {
            pollId: input.id,
          },
        });

        // delete the poll
        await ctx.prisma.poll.delete({
          where: {
            id: input.id,
          },
        });
      }
    }),


  upvote: protectedProcedure
    .input(z.object({ pollId: z.string(), optId: z.number() }))
    .mutation(async ({ ctx, input }) => {

      // find if the owner is polling and cancel it 
      const poll = await ctx.prisma.poll.findFirst({
        where: {
          id: input.pollId,
        }
      });
      if (poll?.ownerId === ctx.session.user.id) {
        return { status: false };
      }

      // checking if the user has already voted
      const existingVote = await ctx.prisma.vote.findMany({
        where: {
          userId: ctx.session.user.id
        }
      })
      if (existingVote.length > 0) {
        return { status: false };
      }


      // if the user has not already voted create a vote in table and update the results
      const vote = await ctx.prisma.vote.create({
        data: {
          userId: ctx.session.user.id,
          pollId: input.pollId,
          VotedFor: input.optId,
        },
      });

      await ctx.prisma.poll.update({
        where: {
          id: input.pollId,
        },
        data: {
          options: {
            update: {
              where: {
                id: input.optId,
              },
              data: {
                vote_count: { increment: 1 },
              },
            },
          },
        },
      });
      return { status: true, vote };
    }),
});
