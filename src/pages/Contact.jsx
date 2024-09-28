import React from "react";
import { HiChatBubbleLeftRight, HiGlobeAsiaAustralia } from "react-icons/hi2";
import { FaPhone } from "react-icons/fa6";
import ContactUsForm from "../components/ContactPage/ContactUsForm";
import Footer from "../components/common/Footer";

const Contact = () => {
  return (
    <div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 h-[50vh]"></div>
      <div className="relative flex justify-center w-11/12 mx-auto text-white max-w-maxContent mt-28">
        <div className="flex flex-col-reverse items-center justify-between w-full lg:items-start lg:flex-row gap-y-14 lg:gap-y-0">
          <div className="text-slate-400 relative text-sm max-w-[45%] max-h-fit hover:cursor-pointer bg-slate-800 rounded-lg flex flex-col gap-y-6 lg:p-16 p-9 shadow-md shadow-teal-500">
            <div className="flex items-start justify-start p-3 transition-all duration-200 rounded-lg gap-x-5 hover:bg-slate-700 hover:translate-x-2">
              <div>
                <HiChatBubbleLeftRight className="mt-1 size-7 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-slate-300">
                  Chat On Us
                </h1>
                <p className="text-sm font-medium font-poppins">
                  Our friendly team is here to help.
                </p>
                <p className="font-medium text-slate-400">
                  kanadshee18@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-start justify-start p-3 transition-all duration-200 rounded-lg gap-x-5 hover:bg-slate-700 hover:translate-x-2">
              <div>
                <HiGlobeAsiaAustralia className="mt-1 size-7 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-slate-300">
                  Visit Us
                </h1>
                <p className="font-medium font-poppins">
                  Come and say hello at our office HQ.
                </p>
                <p className="font-medium text-slate-400">
                  Nainan, Falta, Diamond Harbour
                </p>
              </div>
            </div>
            <div className="flex items-start justify-start p-3 transition-all duration-200 rounded-lg gap-x-5 hover:bg-slate-700 hover:translate-x-2">
              <div>
                <FaPhone className="mt-1 size-7 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-slate-300">
                  Call Us
                </h1>
                <p className="font-medium font-poppins">
                  Mon - Fri from 9am to 7pm.
                </p>
                <p className="font-medium text-slate-400">+1478963250</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center pb-0 mb-12 border-2 rounded-lg formDiv max-w-fit pt-9 px-9 lg:pb-2 border-slate-800">
            <h1 className="w-full px-4 mb-3 text-3xl font-medium text-teal-500 text-start">
              Got an Idea? We've got the skills. <br />
              Let's team up
            </h1>

            <p className="w-full px-4 mb-3 font-medium text-start font-playwrite text-slate-400">
              Tell us more about yourself and what you're got in mind.
            </p>

            <ContactUsForm />
          </div>
        </div>
      </div>
      <section className="mt-20">
        <Footer />
      </section>
    </div>
  );
};

export default Contact;
