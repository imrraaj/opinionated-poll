import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="A poll website built using T3 stack by Raj Patel"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content="https://s6.imgcdn.dev/BodXM.png"
        ></meta>
        <meta property="og:title" content="Opinionated Poll"></meta>
        <meta
          property="og:description"
          content="A poll website built using T3 stack by Raj Patel"
        ></meta>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="twitter:title" content="Opinionated Poll" />
        <meta
          name="twitter:description"
          content="A poll website built using T3 stack by Raj Patel"
        />
        <meta name="twitter:image" content="https://s6.imgcdn.dev/BodXM.png" />
      </Head>
      <body className="relative mx-auto max-w-[1024px] px-2">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
