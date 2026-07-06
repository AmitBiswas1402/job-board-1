"use client";

import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useUser();
  const fullName = user?.fullName;

  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold">Welcome {fullName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Link href={"/jobs"}>
          <h2>Jobs for you</h2>
        </Link>

        <Link href={"/ats-score"}>
          <h2>Your resume ATS</h2>
        </Link>

        <Link href={"/cover-letter"}>
          <h2>Create cover letter for your job</h2>
        </Link>

        <Link href={"/industry-insights"}>
          <h2>See insights in industry</h2>
        </Link>

        <Link href={"/visual-whiteboard"}>
          <h2>Visualize all your job applications</h2>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
