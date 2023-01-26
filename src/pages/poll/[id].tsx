import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { api } from "../../utils/api";
import { FiCopy } from "react-icons/fi";
function VoteOnPoll() {
  const router = useRouter();
  const { query } = router;
  const { data: user, status } = useSession();

  const id = query.id as string;
  const {
    data: poll,
    error,
    isError,
    isLoading,
  } = api.poll.getPollsByIdCreatedByUser.useQuery(id);

  const upVoteMutation = api.poll.upvote.useMutation();

  if (isError) {
    return <h1>Error... {error.message}</h1>;
  }

  if (isLoading) return <h1>Loading...</h1>;

  if (!poll) {
    return <h1>No Data...</h1>;
  }
  const handleUpVote = (optId: number) => {
    console.log("here!", optId);

    let waitingLoadingId;
    if (status === "loading") {
      waitingLoadingId = toast.loading("Please Wait...");
    } else if (user?.user) {
      // logged In user
      if (user.user.id !== poll.ownerId) {
        upVoteMutation.mutate({ pollId: poll.id, optId });
        toast.success("Your vote added successfully", waitingLoadingId);
      } else {
        toast.error("Owner can not vote for the same poll!!", waitingLoadingId);
      }
    } else {
      toast.error(
        "You need to login to vote for this poll!!",
        waitingLoadingId
      );
    }
  };

  return (
    <>
      <Head>
        <title>Opinionated Poll - {poll.question}</title>
      </Head>
      <div className="my-16 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{poll.question}</p>
            <span
              className="cursor-pointer"
              aria-label="copy link"
              onClick={() => {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => toast.success("URL copied to the clipboard!!"))
                  .catch(() => toast.error("Can not copy the URL!"));
                return;
              }}
            >
              <FiCopy />
            </span>
          </div>
          <Link href={`result/${id}`} className="text-md underline">
            See Results
          </Link>
        </div>

        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {poll.options?.map((opt, index) => {
            return (
              <div
                className="my-2 cursor-pointer rounded border-2 border-transparent bg-cyan-300 py-2 px-4 shadow-md transition hover:border-cyan-700"
                key={opt.id}
                onClick={() => handleUpVote(opt.id)}
              >
                <p className="inline font-semibold">
                  <span className="mr-4">{index + 1}.</span>
                  {opt.option_text}
                </p>
              </div>
            );
          })}
        </div>

        <div></div>
      </div>
    </>
  );
}

export default VoteOnPoll;
