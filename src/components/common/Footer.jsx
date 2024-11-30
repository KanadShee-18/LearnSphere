import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
import Logo from "../../../src/assets/Logo/LL_logo.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";


const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-richblack-800 via-slate-800 to-richblack-900 font-inter">
     
      <div className="relative flex items-center justify-between w-11/12 gap-8 mx-auto leading-6 lg:flex-row max-w-maxContent text-richblack-400 py-14">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Section 1 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <img src={Logo} alt="LearnSphere" />
              <h1 className="text-slate-300 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2 text-[#577bb3]">
                {["About", "Careers", "Affiliates"].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-slate-300 hover:translate-x-2 transition-all duration-200"
                    >
                      <Link to="/">{ele}</Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 text-lg text-[#577bb3]">
                <FaFacebook className="transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-slate-400" />
                <FaGoogle className="transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-slate-400" />
                <FaTwitter className="transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-slate-400" />
                <FaYoutube className="transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-slate-400" />
              </div>
              <div></div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-slate-300 font-semibold text-[16px]">
                Resources
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] text-[#577bb3] cursor-pointer hover:text-slate-300 hover:translate-x-2 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <h1 className="text-slate-300 font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div className="text-[14px] text-[#577bb3] cursor-pointer hover:text-slate-300 hover:translate-x-2 transition-all duration-200 mt-2">
                <Link to={"/contact"}>Help Center</Link>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-slate-300 font-semibold text-[16px]">
                Plans
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] text-[#577bb3] cursor-pointer hover:text-slate-300 hover:translate-x-2 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-slate-300 font-semibold text-[16px] mt-7">
                Community
              </h1>

              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-slate-300 text-[#577bb3] hover:translate-x-2 transition-all duration-200"
                    >
                      <Link to={ele.split(" ").join("-").toLowerCase()}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele, i) => {
              return (
                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className="text-slate-300 font-semibold text-[16px]">
                    {ele.title}
                  </h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] text-[#577bb3] cursor-pointer hover:text-slate-300 hover:translate-x-2 transition-all duration-200"
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 mx-auto text-sm text-blue-100 max-w-maxContent pb-14">
        {/* Section 1 */}
        <div className="flex flex-col items-center justify-between w-full gap-3 lg:items-start lg:flex-row">
          <div className="flex flex-row">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-slate-300 hover:translate-x-2 transition-all duration-200"
                  } px-3 `}
                >
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            Made with ❤️ by Kanad © 2024 LearnSphere
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
