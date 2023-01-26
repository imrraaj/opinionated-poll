import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { data: user } = useSession();
  return (
    <nav className="my-4 flex items-center justify-between">
      <ul className="flex items-center justify-center gap-4">
        <li>
          <Link
            href="/"
            className="font-semibold text-gray-400 hover:text-gray-900 hover:underline"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/create"
            className="font-semibold text-gray-400 hover:text-gray-900 hover:underline"
          >
            Create
          </Link>
        </li>
        <li>
          <Link
            href="/my-polls"
            className="font-semibold text-gray-400 hover:text-gray-900 hover:underline"
          >
            MyPolls
          </Link>
        </li>
      </ul>
      <div>
        {user?.user && (
          <div className="flex items-center justify-center gap-2">
            <Image
              height={30}
              width={30}
              className="rounded-full"
              src="https://api.dicebear.com/5.x/shapes/svg"
              alt={user.user.email ?? "User Image"}
            />
            <button
              className="font-semibold text-gray-400 hover:text-gray-900 hover:underline"
              onClick={() => {
                signOut()
                  .then((x) => console.log(x))
                  .catch(() => toast.error("Failed to login!!"));
                return;
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
