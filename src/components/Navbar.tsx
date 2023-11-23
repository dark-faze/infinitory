'use client'
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
// import Login from "@/components/Auth/Login";
// import LoggedIn from "@/components/Auth/LoggedIn";

// import { useSession } from "next-auth/react";

function Navbar() {
  // const session = useSession();

  return (
    <nav className="overflow-x-hidden fixed top-0 inset-x-0 flex h-fit items-center justify-between border-b z-[20] mb-2 max-w-screen trueGlass !rounded-none border-black">
      <div className="container flex items-center h-full py-2 mx-auto max-w-7xl" >
        <div className="flex w-1/3"></div>

        <div className="flex items-center justify-center w-1/3 align-middle">
          <Link href="/dashboard">
            {/* <Avatar>
              <AvatarImage src="https://raw.githubusercontent.com/shadcn/ui/main/apps/www/public/android-chrome-512x512.png"></AvatarImage>
            </Avatar> */}
          <h4 className="text-lg font-extrabold text-black dark:text-white font-inter">Infinitory</h4>
          </Link>
        </div>
        <div className="flex items-center justify-end w-1/3 gap-2">
          <ModeToggle />
          {/* {session.status != "authenticated" && <Login /> } */}
          {/* {session.status == "authenticated" && <LoggedIn /> } */}
        </div>

      </div>
    </nav>
  )
}

export default Navbar