import React, { lazy, Suspense, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { motion, spring, useScroll, useTransform } from "framer-motion";
import Spinner from "../components/common/Spinner.jsx";

// Lazy load components
const LearningLanguageSection = lazy(() =>
  import("../components/core/homeaccessories/LearningLanguageSection.jsx")
);
const InstructorSection = lazy(() =>
  import("../components/core/homeaccessories/InstructorSection.jsx")
);
const Footer = lazy(() => import("../components/common/Footer.jsx"));
const ExploreMore = lazy(() =>
  import("../components/core/homeaccessories/ExploreMore.jsx")
);
const CTAButton = lazy(() =>
  import("../components/core/homeaccessories/CTAButton.jsx")
);
const BannerVid = lazy(() =>
  import("../components/core/homeaccessories/BannerVid.jsx")
);
const ReviewSlider = lazy(() =>
  import("../components/common/ReviewSlider.jsx")
);
const HighlightText = lazy(() =>
  import("../components/core/homeaccessories/HighlightText.jsx")
);
const CodeBlock = lazy(() =>
  import("../components/core/homeaccessories/CodeBlock.jsx")
);
const TimeLineSection = lazy(() =>
  import("../components/core/homeaccessories/TimeLineSection.jsx")
);

const container = (delay) => ({
  hidden: {
    x: -100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: delay,
    },
  },
});

const Home = () => {
  const navigate = useNavigate();
  const targetRef1 = useRef(null);
  const targetRef2 = useRef(null);

  // Set up separate scroll hooks with different offsets
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: targetRef1,
    offset: ["end end", "end start"],
  });
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: targetRef2,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress1, [0, 0.5, 0.8], [1, 0.6, 0.1], {
    type: "spring",
    stiffness: 50,
    damping: 20,
  });
  const scale = useTransform(scrollYProgress1, [0, 0.5, 0.8], [1, 0.5, 0.3], {
    type: "spring",
    stiffness: 50,
    damping: 20,
  });

  const scaleFixed = useTransform(
    scrollYProgress1,
    [0, 0.5, 0.8],
    [1, 0.5, 0.3],
    {
      type: "spring",
      stiffness: 50,
      damping: 20,
    }
  );

  return (
    <div className="scroll-smooth">
      <div className="fixed inset-0 z-0">
        <Suspense
          fallback={
            <div className="grid w-full h-full place-items-center">
              <Spinner />
            </div>
          }
        >
          <BannerVid />
        </Suspense>
      </div>

      <div className="relative z-30 flex flex-col items-center justify-between w-11/12 mx-auto text-white scroll-smooth section1 max-w-maxContent">
        <motion.div
          ref={targetRef1}
          style={{ scale, opacity }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 25,
          }}
          className="relative top-0 z-30 flex flex-col items-center justify-center w-full h-screen max-w-full mx-auto mt-16"
        >
          <motion.div
            style={{ scale: scaleFixed }}
            className="fixed flex flex-col items-center"
          >
            <motion.div
              variants={container(0.3)}
              initial="hidden"
              animate="visible"
              className="mt-8 lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold drop-shadow-2xl text-center text-[#c1edff] font-inter"
            >
              Unlock your potential and drive future success with
              <HighlightText text={"Coding Skills"} />
            </motion.div>
            <Link to={"/signup"}>
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.5,
                  delay: 1.2,
                  type: "spring",
                  stiffness: 60,
                  damping: 25,
                }}
                className="mx-auto mt-14 w-fit font-semibold transition-all duration-200 bg-opacity-60 rounded-full shadow-sm group bg-[#223253] font-playwrite text-slate-300 shadow-slate-500 hover:scale-95"
              >
                <div className="flex flex-row items-center justify-center px-4 py-3 transition-all duration-300 rounded-full gap-x-3 group-hover:bg-slate-900 group-active:bg-slate-600">
                  <p className="text-sm font-medium text-blue-25">
                    Become an Instructor
                  </p>{" "}
                  <FaArrowRightLong />
                </div>
              </motion.div>
            </Link>

            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 1.2,
                type: "spring",
                stiffness: 60,
                damping: 25,
              }}
              className="mt-10 text-sm font-medium tracking-wide text-center md:text-base text-blue-25 font-inter"
            >
              Study at your own speed, from anywhere in the world, with our
              online coding courses. Have access to a plethora of tools, such as
              interactive projects, tests, and individualized feedback from
              instructors.
            </motion.div>
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 1.3,
                delay: 1.5,
                type: "spring",
                stiffness: 60,
                damping: 25,
              }}
              className="flex flex-row mt-16 lg:text-3xl md:text-2xl text-xl font-semibold gap-x-5 font-poppins bg-gradient-to-br from-[#2f89ff] via-[#6a78a5] to-[#16dfd5] text-transparent bg-clip-text"
            >
              <p>LEARN</p>.<p>TEACH</p>.<p>EARN</p>
            </motion.div>
            <motion.div
              initial={{ x: 400, y: 300, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{
                duration: 1.5,
                delay: 2.0,
                type: "spring",
                stiffness: 60,
                damping: 25,
              }}
              className="flex flex-row mt-8 gap-7 font-poppins"
            >
              <Suspense fallback={<div>Loading...</div>}>
                <CTAButton
                  children={"Learn More"}
                  active={true}
                  linkto={"/signup"}
                />

                <CTAButton
                  children={"Book Demo Session"}
                  active={false}
                  linkto={"/signup"}
                />
              </Suspense>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          // ref={targetRef2}
          // style={{ scale: scaleTransition, x: translateX, y: translateY }}
          className="flex flex-col w-full h-fit mb-36 md:mb-0"
        >
          <div>
            <Suspense
              fallback={
                <div>
                  <Spinner />
                </div>
              }
            >
              <CodeBlock
                position={"sm:flex-row flex-col"}
                heading={
                  <div className="text-2xl font-semibold text-center md:text-start md:text-4xl font-inter">
                    Empower your
                    <HighlightText text={"coding potential"} />
                    &nbsp;with our online courses
                  </div>
                }
                subHeading={
                  "Our instructors are seasoned professionals with years of coding expertise who are enthusiastic about imparting their knowledge to you through our courses."
                }
                ctaBtn1={{
                  btnTxt: "Try it Yourself",
                  linkto: "/signup",
                  active: true,
                }}
                ctaBtn2={{
                  btnTxt: "Learn More",
                  linkto: "/login",
                  active: false,
                }}
                codeBlock={`<!DOCTYPE html>\n<html>\n<head> <title>LearnCoding</title> <link rel="stylesheet" href="style.css">\n<head/>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="/one">One</a><a href="/two">Two</a>\n<a href="/three">Three</a>\n</nav>`}
                codeColor={"text-caribbeangreen-50"}
                backgroundGradient={<div className="absolute codeblock1"></div>}
              />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={<div>Loading Code Block...</div>}>
              <CodeBlock
                position={"sm:flex-row-reverse flex-col"}
                heading={
                  <div className="text-2xl font-semibold md:text-4xl font-inter">
                    Learn & start
                    <HighlightText text={"coding in seconds"} />
                  </div>
                }
                subHeading={
                  "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }
                ctaBtn1={{
                  btnTxt: "Continue Lesson",
                  linkto: "/login",
                  active: true,
                }}
                ctaBtn2={{
                  btnTxt: "Learn More",
                  linkto: "/login",
                  active: false,
                }}
                codeBlock={`<!DOCTYPE html>\n<html>\n<head> <title>CodeMaster</title> <link rel="stylesheet" href="main.css">\n<head/>\n<body>\n<h1><a href="/">Main Title</a></h1>\n<nav><a href="/first">First</a><a href="/second">Second</a>\n<a href="/third">Third</a>\n</nav>`}
                codeColor={"text-caribbeangreen-50"}
                backgroundGradient={<div className="absolute codeblock2"></div>}
              />
            </Suspense>
          </div>
        </motion.div>
        <Suspense fallback={<div>Loading Explore More...</div>}>
          <ExploreMore />
        </Suspense>
      </div>

      <div className="relative bg-gradient-to-bl z-20 sm:mt-32 from-[#c7f5e2] via-[#f0f2f1] to-[#c6f5e2] text-slate-700 section2">
        <div className="homepage_bg sm:h-[330px] h-[250px]">
          <div className="flex items-center justify-center w-11/12 h-full gap-5 mx-auto max-w-maxContent">
            <div className="flex flex-row gap-8 text-white font-inter">
              <Suspense fallback={<div>Loading CTA Buttons...</div>}>
                <CTAButton active={true} linkto={"/signup"}>
                  <div className="flex flex-row items-center gap-3 text-slate-700">
                    Explore Full Catalog
                    <FaArrowRightLong />
                  </div>
                </CTAButton>
                <CTAButton active={false} linkto={"/signup"}>
                  <div>Learn More</div>
                </CTAButton>
              </Suspense>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between w-11/12 gap-8 py-20 mx-auto max-w-maxContent">
          <div className="flex flex-col gap-6 sm:flex-row">
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                type: "spring",
                stiffness: 60,
                damping: 25,
              }}
              className="text-2xl text-center md:text-4xl md:text-start font-poppins s3ht"
            >
              <p className="font-semibold">
                Get the skills you need for a{" "}
                <HighlightText text={"job that is in demand"} />
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                type: "spring",
                stiffness: 60,
                damping: 25,
              }}
              className="flex flex-col items-start gap-5 font-medium font-inter"
            >
              <p className="text-sm text-center md:text-start">
                The modern LearnSphere dictates its own terms. Today, to be a
                competitive specialist requires more than professional skills.
              </p>
              <div className="w-full md:w-[150px]">
                <Suspense fallback={<div>Loading Button...</div>}>
                  <CTAButton active={true} children={"Learn More"} />
                </Suspense>
              </div>
            </motion.div>
          </div>

          <Suspense
            fallback={
              <div>
                <Spinner />
              </div>
            }
          >
            <TimeLineSection />
          </Suspense>
          <Suspense
            fallback={
              <div>
                <Spinner />
              </div>
            }
          >
            <LearningLanguageSection />
          </Suspense>
        </div>
      </div>

      <div className="section3 bAT">
        <div className="flex flex-col items-center justify-center w-11/12 h-full gap-5 mx-auto max-w-maxContent">
          <Suspense
            fallback={
              <div>
                <Spinner />
              </div>
            }
          >
            <InstructorSection />
          </Suspense>
          <div className="mb-6 bg-gradient-to-br from-[#2f89ff] via-[#6a78a5] to-[#16dfd5] text-transparent bg-clip-text md:text-4xl text-center text-3xl font-semibold text-slate-400 font-inter">
            Reviews from other Learners
          </div>
          <Suspense
            fallback={
              <div>
                <Spinner />
              </div>
            }
          >
            <ReviewSlider />
          </Suspense>
        </div>
      </div>

      <Suspense
        fallback={
          <div>
            <Spinner />
          </div>
        }
      >
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
