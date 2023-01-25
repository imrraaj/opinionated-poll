import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { api } from "../../utils/api";

function VoteOnPoll() {
  const { query } = useRouter();
  const id = query.id as string;
  const {
    data: poll,
    error,
    isError,
    isLoading,
  } = api.poll.getPollsByIdCreatedByUser.useQuery(id);

  const router = useRouter();

  const upVoteMutation = api.poll.upvote.useMutation({
    onSuccess: () => {
      toast.success("Voted Sucessfully!!");
    },
    onError: () => {
      toast.error("Voted Sucessfully!!");
    },
  });
  if (isError) {
    return <h1>Error... {error.message}</h1>;
  }

  if (isLoading) return <h1>Loading...</h1>;

  if (!poll) {
    return <h1>No Data...</h1>;
  }

  return (
    <>
      <Head>
        <title>Opinionated Poll - {poll.question}</title>
      </Head>
      <div className="my-16 px-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl font-bold">{poll.question}</span>
        </div>

        <div className="my-4 grid grid-cols-2 gap-4">
          {poll.options?.map((opt, index) => {
            return (
              <div
                className="my-2 cursor-pointer rounded border-2 border-transparent bg-cyan-300 py-2 px-4 shadow-md transition hover:border-cyan-700"
                key={opt.id}
                onClick={() => {
                  upVoteMutation.mutate({ pollId: poll.id, optId: opt.id });
                }}
              >
                <p className="inline font-semibold">
                  <span className="mr-4">{index}.</span>
                  {opt.option_text}
                </p>
              </div>
            );
          })}
        </div>

        <div>
          <Link href={`result/${id}`} className="underline">
            See Results
          </Link>
        </div>
      </div>
    </>
  );
}

export default VoteOnPoll;
