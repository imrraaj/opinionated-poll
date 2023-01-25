import Link from "next/link";
import React, { useRef, useState } from "react";
import { api } from "../utils/api";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";
import Head from "next/head";

function MyPolls() {
  const totalVote = useRef(0);
  const { data, error, isError, isLoading } =
    api.poll.getAllPollsCreatedByUser.useQuery();

  const utils = api.useContext();

  const deleteMutation = api.poll.deletePollById.useMutation({
    // on sucess invalidate queries to fetch new queries...
    onSuccess: () => {
      toast.success("Poll deleted sucessfully");
      utils.poll.getAllPollsCreatedByUser.invalidate();
    },
  });

  if (isError) {
    return <h1>Error... {error.message}</h1>;
  }

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <Head>
        <title>Opinionated Poll - All of Your Polls</title>
      </Head>

      <div className="my-10">
        <h1 className="text-center text-3xl font-black">Polls created by me</h1>
        {data.map((poll) => (
          <div
            key={poll.id}
            className="my-8 w-full rounded border-2 border-gray-600 p-4 shadow-lg transition duration-150 hover:scale-[1.01]"
          >
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl font-bold underline">
                  <Link href={`/poll/${poll.id}`}>{poll.question}</Link>
                </span>
                <AiFillDelete
                  className="cursor-pointer rounded-md text-2xl font-bold text-red-700"
                  onClick={() => {
                    deleteMutation.mutate({ id: poll.id });
                  }}
                />
              </div>
              <div className="my-4 grid grid-cols-2 gap-4">
                {poll.options?.map((opt, index) => {
                  totalVote.current = totalVote.current + opt.vote_count;
                  return (
                    <div
                      className="flex cursor-pointer justify-between rounded border-2 border-transparent bg-cyan-300 py-2 px-4 shadow-md transition hover:border-cyan-700"
                      key={opt.id}
                    >
                      <p className="inline font-semibold ">{opt.option_text}</p>
                      <p className="font-bold">{opt.vote_count}</p>
                    </div>
                  );
                })}
              </div>
              <p>{totalVote.current} people voted</p>
            </>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyPolls;
// export const getStaticProps = () => {
//   return {
//     props: { auth: true },
//   };
// };
