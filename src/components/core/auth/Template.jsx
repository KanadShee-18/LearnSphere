import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import frameImg from "../../../assets/Images/frame.png";

const Template = ({ title, description1, description2, image, formType }) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center z-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="z-20 flex flex-col-reverse justify-between w-11/12 mx-auto max-w-maxContent md:flex-row md:gap-y-0 gap-y-12 md:gap-x-12">
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-[#4adfd7] mb-5 font-semibold leading-8 text-3xl text-start">
              {title}
            </h1>
            <p className="font-medium">
              <span className="text-slate-400 text-[15px]">{description1}</span>{" "}
              <span className="text-cyan-400 font-eduSa text-[17px]">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignUpForm /> : <LogInForm />}
          </div>
          <div className="mx-auto my-0 md:my-auto w-11/12 relative max-w-[450px] md:mx-0">
            <img
              src={frameImg}
              alt="frame"
              width={558}
              height={504}
              loading="lazy"
              className=""
            />

            <img
              src={image}
              alt="image"
              width={558}
              height={504}
              loading="lazy"
              className="absolute z-10 right-2 -top-4 mainImg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Template;
