import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
import Logo from "../../../src/assets/Logo/LL_logo.png";
import {
  FaFacebook,
  FaGlobe,
  FaGoogle,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

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
    <div
      id='footer'
      className='bg-gradient-to-br from-richblack-800 via-slate-800 to-richblack-900 font-inter'
    >
      <div className='relative flex items-center justify-between w-11/12 gap-8 mx-auto leading-6 lg:flex-row max-w-maxContent text-richblack-400 py-14'>
        <div className='border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700'>
          {/* Section 1 */}
          <div className='lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3 text-neutral-400'>
            <div className='w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0'>
              <img src={Logo} alt='LearnSphere' />
              <h1 className='text-slate-300 font-semibold text-[16px]'>
                Company
              </h1>
              <div className='flex flex-col gap-2'>
                {["About", "Careers", "Affiliates"].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className='text-[14px] cursor-pointer hover:translate-x-0.5 transition-all duration-200 hover:text-neutral-300'
                    >
                      <Link to='/#footer'>{ele}</Link>
                    </div>
                  );
                })}
              </div>
              <div className='flex gap-3 text-lg'>
                <FaFacebook className='transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-cyan-400' />
                <FaGoogle className='transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-cyan-400' />
                <FaTwitter className='transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-cyan-400' />
                <FaYoutube className='transition-all duration-200 hover:cursor-pointer hover:scale-105 hover:text-cyan-400' />
              </div>
              <div></div>
            </div>

            <div className='w-[48%] lg:w-[30%] mb-7 lg:pl-0'>
              <h1 className='text-slate-300 font-semibold text-[16px]'>
                Resources
              </h1>

              <div className='flex flex-col gap-2 mt-2'>
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className='text-[14px] cursor-pointer hover:translate-x-0.5 transition-all duration-200 hover:text-neutral-300'
                    >
                      <Link to='/#footer'>{ele}</Link>
                    </div>
                  );
                })}
              </div>

              <h1 className='text-slate-300 font-semibold text-[16px] mt-7'>
                Support
              </h1>
              <div className='text-[14px]  cursor-pointer  hover:translate-x-0.5 transition-all duration-200 mt-2 hover:text-neutral-300'>
                <Link to={"/contact"}>Help Center</Link>
              </div>
            </div>

            <div className='w-[48%] lg:w-[30%] mb-7 lg:pl-0'>
              <h1 className='text-slate-300 font-semibold text-[16px]'>
                Plans
              </h1>

              <div className='flex flex-col gap-2 mt-2'>
                {Plans.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className='text-[14px] hover:text-neutral-300 cursor-pointer  hover:translate-x-0.5 transition-all duration-200'
                    >
                      <Link to='/#footer'>{ele}</Link>
                    </div>
                  );
                })}
              </div>
              <h1 className='text-slate-300 font-semibold text-[16px] mt-7'>
                Community
              </h1>

              <div className='flex flex-col gap-2 mt-2'>
                {Community.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className='text-[14px] cursor-pointer hover:translate-x-0.5 transition-all duration-200 hover:text-neutral-300'
                    >
                      <Link to='/#footer'>{ele}</Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className='lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3'>
            {FooterLink2.map((ele, i) => {
              return (
                <div key={i} className='w-[48%] lg:w-[30%] mb-7 lg:pl-0'>
                  <h1 className='text-slate-300 font-semibold text-[16px]'>
                    {ele.title}
                  </h1>
                  <div className='flex flex-col gap-2 mt-2'>
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className='text-[14px]  cursor-pointer  hover:translate-x-0.5 hover:text-neutral-300 transition-all duration-200'
                        >
                          <Link to={"/#footer"}>{link.title}</Link>
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

      <div className='flex flex-row items-center justify-between w-11/12 mx-auto text-sm text-blue-100 max-w-maxContent pb-14 relative'>
        {/* Section 1 */}
        <div className='flex flex-col items-center justify-between w-full gap-3 lg:items-start lg:flex-row'>
          <div className='flex flex-row'>
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer  hover:translate-x-0.5 hover:text-neutral-300 transition-all duration-200"
                  } px-3 `}
                >
                  <Link to={"/#footer"}>{ele}</Link>
                </div>
              );
            })}
          </div>

          <div className='text-center'>
            Made with ❤️ by Kanad © 2024 LearnSphere
          </div>

          <div className='w-fit h-fit'>
            <a
              href='https://kanaddev.me/'
              target='_blank'
              className='flex flex-row items-center gap-2.5 bg-gradient-to-br from-neutral-900 via-cyan-600/20 to-neutral-900 backdrop-blur-sm px-3 py-2.5 rounded-full shadow-sm shadow-slate-600 text-white/60 hover:text-cyan-400/90 relative cursor-pointer transition-all group'
            >
              <span className='absolute inset-x-0 mx-auto h-px bottom-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent w-3/4'></span>
              <FaGlobe className='size-4 group-hover:translate-x-0.5 transition-all duration-200 ease-in-out' />
              <p className='group-hover:-translate-x-0.5 transition-all duration-200 ease-in-out'>
                Connect with me
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
