import React from "react";
import CTAButton from "./CTAButton";
import HighlightText from "./HighlightText";
import { FaArrowRight } from "react-icons/fa6";

const CodeBlock = ({
    position,
    heading,
    subHeading,
    ctaBtn1,
    ctaBtn2,
    codeBlock,
    backgroundGradient,
    codeColor,
}) => {
    console.log(ctaBtn1.btnTxt);

    return (
        <div className={`flex ${position} my-20 justify-between gap-10`}>
            {/* Section: 1 */}
            <div className="flex flex-col justify-between text-start w-1/2 gap-8">
                {heading}
                <div className="text-richblack-200 font-semibold font-inter">
                    {subHeading}
                </div>
                <div className="flex gap-7 mt-7">
                    <CTAButton active={ctaBtn1.active} linkto={ctaBtn1.linkto}>
                        <div className="flex gap-3 items-center font-poppins">
                            {ctaBtn1.btnTxt}
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                    <CTAButton active={ctaBtn2.active} linkto={ctaBtn2.linkto}>
                        <div className="flex gap-3 items-center font-poppins">
                            {ctaBtn2.btnTxt}
                        </div>
                    </CTAButton>
                </div>
            </div>
        </div>
    );
};

export default CodeBlock;
