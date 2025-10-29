const RecentCases = () => {
  return (
    <div className="h-3/4 bg-white/5 rounded-xl p-2 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <div className="h-4 w-4 bg-red-500 rounded-full"/>
        <div>
          <h4 className="text-lg font-bold">OB/2024/001567</h4>
          <p>Armed Robbery - Westlands Area</p>
          <p className="text-xs !text-gray-400">Officer: PC Mary Wanjiku</p>
        </div>
      </div>
      <div>
        <p className="bg-red-500/10 text-center rounded-lg">Urgent</p>
        <p className="text-xs text-gray-500">2 hours ago</p>
      </div>
    </div>
  );
};

export default RecentCases;
