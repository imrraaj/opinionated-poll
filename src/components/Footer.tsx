import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center">
      Made by{" "}
      <Link
        href={"https://github.com/imrraaj/"}
        className="cursor-pointer text-cyan-600 underline decoration-dotted underline-offset-2"
      >
        imrraaj
      </Link>
    </footer>
  );
}
