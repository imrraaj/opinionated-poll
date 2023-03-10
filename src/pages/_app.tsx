import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession, signIn } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { api } from "../utils/api";
import "../styles/globals.css";
import React from "react";
import Image from "next/image";
import NextNProgress from "nextjs-progressbar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyApp: AppType<{ session: Session | null; auth: boolean }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { auth } = pageProps;
  return (
    <SessionProvider session={session}>
      <NextNProgress />
      <main className="flex min-h-screen flex-col justify-between py-4">
        <Navbar />
        {auth ? (
          // Private Pages
          <AuthGuard>
            <>
              <Component {...pageProps} />
            </>
          </AuthGuard>
        ) : (
          // public page
          <Component {...pageProps} />
        )}
        <Footer />
      </main>
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

function AuthGuard({ children }: { children: JSX.Element }) {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session) {
    return <Login />;
  }
  return <>{children}</>;
}

function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className=" px-4 text-xl font-black leading-loose md:text-2xl ">
        To continue using, please Sign in
      </h1>
      <div className="flex flex-col items-center justify-center">
        <p>SignIn Via</p>
        <button
          onClick={() => {
            signIn("github")
              .then((e) => console.log(e))
              .catch((x) => console.error(x));
          }}
          className="my-2 flex items-center justify-center gap-2 rounded-md border-2 border-gray-100 border-transparent py-2 px-4 shadow-md ring-emerald-400 transition hover:ring-2"
        >
          <Image
            alt=""
            width={32}
            height={32}
            src="https://authjs.dev/img/providers/github.svg"
          />
          <span className="font-semibold">GitHub</span>
        </button>

        <button
          onClick={() => {
            signIn("google")
              .then((e) => console.log(e))
              .catch((x) => console.error(x));
          }}
          className="my-2 flex items-center justify-center gap-2 rounded-md border-2 border-gray-100 border-transparent py-2 px-4 shadow-md ring-emerald-400 transition hover:ring-2"
        >
          <Image
            alt=""
            width={32}
            height={32}
            src="https://authjs.dev/img/providers/google.svg"
          />
          <span className="font-semibold">Google</span>
        </button>
      </div>
    </main>
  );
}
