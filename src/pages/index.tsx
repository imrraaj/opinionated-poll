import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Opinionated Poll - Built using T3 stack</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="bg-gradient-to-b from-green-400 to-cyan-400 bg-clip-text text-4xl font-black leading-loose text-transparent md:text-8xl lg:text-8xl">
          Opinionated Poll
        </h1>
        <p className="text-shadow-lg mt-0 text-center text-gray-500">
          create polls and ask others anything you want - it&apos;s free!
        </p>
        <div className="flex gap-4">
          <button className="my-4 rounded-md border-2 border-transparent bg-cyan-400 py-2 px-4 shadow-md transition hover:border-cyan-700">
            <Link href="/create">Create A Poll</Link>
          </button>
          <button className="my-4 rounded-md border-2 border-transparent bg-green-400 py-2 px-4 shadow-md transition hover:border-green-700">
            <Link href="/my-polls">Goto My Polls</Link>
          </button>
        </div>
      </main>
    </>
  );
}
