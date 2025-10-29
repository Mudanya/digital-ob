import DashboardCard from "@/components/features/dashboard-card";
import RecentCases from "@/components/features/recent-cases";
import { CardItems } from "@/lib/data";
import { DashCardItem } from "@/types";
import {
  ArrowUp,
  ArrowUp10,
  Calendar,
  Calendar1,
  CalendarCheck2,
  Check,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

const page = () => {
  const carditems: DashCardItem[] = CardItems;
  return (
    <section className="w-full h-full">
      <div>
        <h2 className="text-3xl font-extrabold">Dashboard Overview</h2>
        <p className="text-lg mt-1">
          Nairobi Central Police Station - Real-time operational status
        </p>
      </div>
      <div className="mt-8 flex gap-2 w-full flex-col sm:flex-row  flex-wrap lg:justify-between !min-h-1/5 h-fit lg:h-1/5 mb-15">
        {carditems.map((item) => (
          <DashboardCard key={item.title} {...item} />
        ))}
      </div>
      <div className="flex gap-2 my-5 h-1/3 flex-wrap lg:justify-between">
        <div className=" bg-white/12 border border-white/20 rounded-xl basis-full sm:basis-[49%] md:basis-[65.5%] ">
          <div className="flex justify-between p-4 border-b border-white/20">
            <h3>Recent Cases</h3>
            <Link href={"/cases"}>View All</Link>
          </div>
          <div className="p-4 flex gap-4 flex-col justify-between h-3/4">
            <RecentCases />
            <RecentCases />
            <RecentCases />
          </div>
        </div>
        <div className=" bg-white/12 rounded-xl border border-white/20 basis-full sm:basis-[49%] md:basis-[32.5%]">
          <div className="flex justify-between p-4 border-b border-white/20">
            <h3>Quick Action</h3>
          </div>
          <div className="p-4 flex gap-4 flex-col justify-between h-3/4">
            <Link
              href={"#"}
              className="bg-blue-500 py-4 rounded-xl text-center hover:opacity-70"
            >
              New OB Entry
            </Link>
            <Link
              href={"#"}
              className="bg-yellow-500 py-4  rounded-xl text-center hover:opacity-70"
            >
              Search Cases
            </Link>
            <Link
              href={"#"}
              className="bg-purple-500 py-4 rounded-xl text-center hover:opacity-70"
            >
              Generate Report
            </Link>
            <Link
              href={"#"}
              className="bg-green-500 py-4 rounded-xl text-center hover:opacity-70"
            >
              Add officer
            </Link>
          </div>
        </div>
      </div>
       <div className=" bg-white/12 rounded-xl border border-white/20 w-1/2 mt-25">
          <div className="flex justify-between p-4 border-b border-white/20">
            <h3>Quick Action</h3>
          </div>
          <div className="p-4">
            <div className="flex gap-2 items-center">
                <div className="h-8 w-8 bg-green-500 rounded-full"/>
              <div >
                <h4>Case OB/2024/001564 marked as resolved</h4>
                <p className="text-gray-500 text-xs">by Inspector John Kamau • 15 min ago</p>
              </div>
            </div>
            <div className="flex gap-2 items-center mt-2">
                <div className="h-8 w-8 bg-blue-500 rounded-full"/>
              <div >
                <h4>New officer assigned to traffic</h4>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default page;
