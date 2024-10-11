import React from "react";

const HomeShimmer = () => {
  return (
    <div className="flex flex-col w-full h-full gap-y-8 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300">
      <div className="flex justify-between p-2 m-2 navShimmer">
        <div className="h-20 w-[200px] rounded-3xl p-2"></div>
        <div className="p-2 ">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="firstShimmer"></div>
      <div className="codeBlockShimmer"></div>
    </div>
  );
};

export default HomeShimmer;
