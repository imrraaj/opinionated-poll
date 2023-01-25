import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";

function VoteOnPoll() {
  const { query } = useRouter();
  const id = query.id as string;
  const {
    data: poll,
    error,
    isError,
    isLoading,
  } = api.poll.getResultsForPoll.useQuery({ id });

  console.log(poll);

  if (isError) {
    return <h1>Error... {error.message}</h1>;
  }

  if (isLoading) return <h1>Loading...</h1>;

  if (!poll) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-black">Invalid Id...</h1>
        <Link href={"/"} className="my-2 cursor-pointer underline">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Opinionated Poll | Results - {poll.question}</title>
      </Head>
      <div className="my-16 px-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl font-bold">{poll.question}</span>
        </div>

        <div className="my-4 grid grid-cols-2 gap-4">
          {poll.options?.map((opt) => {
            return (
              <div
                className="my-2 flex justify-between rounded border-2 border-transparent bg-cyan-300 py-2 px-4 shadow-md transition hover:border-cyan-700"
                key={opt.id}
              >
                <p className="inline font-semibold ">{opt.option_text}</p>
                <p className="font-bold">{opt.vote_count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default VoteOnPoll;
