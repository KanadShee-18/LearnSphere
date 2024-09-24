import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import frameImg from "../../../assets/Images/frame.png";

const Template = ({ title, description1, description2, image, formType }) => {
    const { loading } = useSelector((state) => state.auth);

    return (
        <div className="grid min-h-[calc(100vh-4rem)] place-items-center">
            {loading ? (
                <Spinner />
            ) : (
                <div className="w-11/12 max-w-maxContent md:flex-row flex-col-reverse mx-auto flex justify-between md:gap-y-0 gap-y-12 md:gap-x-12">
                    <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
                        <h1 className="text-[#4adfd7] mb-5 font-semibold leading-8 text-3xl text-start">
                            {title}
                        </h1>
                        <p className="font-medium">
                            <span className="text-slate-400 text-[15px]">
                                {description1}
                            </span>{" "}
                            <span className="text-cyan-400 font-eduSa text-[17px]">
                                {description2}
                            </span>
                        </p>
                        {formType === "signup" ? <SignUpForm /> : <LogInForm />}
                    </div>
                    <div className="mx-auto w-11/12 relative max-w-[450px] md:mx-0">
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
                            className="absolute z-10 right-4 -top-4"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Template;
