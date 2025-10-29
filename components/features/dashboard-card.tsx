import { cn } from "@/lib/utils";
import { DashCardItem } from "@/types";
import { ArrowDown, ArrowUp } from "lucide-react";

const DashboardCard = ({
  title,
  value,
  description,
  isPositiveDesc,
  descClassName,
  DescIcon,
  rightColorBg,
}: DashCardItem) => {
  return (
    <div className="!h-full  bg-white/12 p-4 rounded-lg sm:basis-[44%] md:basis-[28.5%] lg:basis-[22.5%] box-content">
      <div className="flex justify-between h-[90%] items-stretch">
        <div>
          <h4 className="text-lg">{title}</h4>
          <h3 className="text-2xl">{value}</h3>
        </div>
        <div className={cn("w-14 h-14 rounded-lg", rightColorBg)}></div>
      </div>
      <div className={cn("t-2 flex gap-1 items-center", descClassName)}>
        <DescIcon />
        <span>{description}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
