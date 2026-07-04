"use client";

import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const { user } = useUser();
  const fullName = user?.fullName;

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome {fullName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <h2>Jobs for you</h2>

        <h2>Your resume ATS</h2>

        <h2>Create cover letter for your job</h2>

        <h2>See insights in industry</h2>

        <h2>Visualize all your job applications</h2>
      </div>
    </div>
  );
};

export default Dashboard;
