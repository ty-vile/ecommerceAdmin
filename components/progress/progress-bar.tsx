import React from "react";

type Props = {
  percentage: number;
};

const ProgressBar: React.FC<Props> = ({ percentage }) => {
  return (
    <div className={`w-full translate duration-300 -z-1 pb-4`}>
      <div className="flex items-center justify-between h-2 w-full bg-background">
        <div
          className="relative h-6 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 rounded-lg"
          style={{ width: percentage + "%" }}
        ></div>
        <div className="w-fit min-w-[80px] flex items-center justify-end">
          <span className="font-bold">Step {percentage / 50}/2</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
