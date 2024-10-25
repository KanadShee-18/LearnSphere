import React from "react";
import banner2Video from "../../../assets/Images/banner2.mp4";

const BannerVid = () => {
  return (
    <div className="relative w-full h-screen">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 object-cover w-full h-full"
      >
        <source src={banner2Video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full opacity-65 bg-[#14192e]"></div>

      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-slate-950 to-transparent"></div>
    </div>
  );
};

export default BannerVid;
