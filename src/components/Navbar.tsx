'use client'

import { Button } from "@base-ui/react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const { user } = useUser();

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <Link className='hover:text-blue-500 cursor-pointer transition-colors duration-200' href="/">
          <h1 className="font-bold text-xl ">AI Job Board</h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link className='hover:text-blue-500 cursor-pointer transition-colors duration-200' href="/jobs">Jobs</Link>
          <Link href="/ats-score">ATS Score</Link>
          <Link href="/cover-letter">Cover Letter</Link>
          <Link href="/insights">Industry Insights</Link>
          <Link href="/whiteboard">Visual Whiteboard</Link>
        </nav>

        {!user ? (
          <>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button>Get Started</Button>
            </SignInButton>
          </>
        ) : (
          <UserButton />
        )}
      </div>
    </>
  );
};

export default Navbar;