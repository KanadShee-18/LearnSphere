// import React, { useRef } from "react";
// import { useScroll, useTransform, motion } from "framer-motion";

// import BannerImage1 from "../assets/Images/aboutus1.webp";
// import BannerImage2 from "../assets/Images/aboutus2.webp";
// import BannerImage3 from "../assets/Images/aboutus3.webp";
// import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
// import LearningGrid from "../components/core/AboutPage/LearningGrid";
// import Quote from "../components/core/AboutPage/Quote";
// import StatsComponenet from "../components/core/AboutPage/Stats";
// import HighlightText from "../components/core/homeaccessories/HighlightText";
// import Footer from "../components/common/Footer";
// import Vision from "../components/core/AboutPage/Vision";

// const About = () => {
//   const targetRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: targetRef,
//     offset: ["end end", "end start"],
//   });

//   const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 0.4, 0.2]);
//   // const translateX = useTransform(scrollYProgress, [0, 0.7], ["0%", "50%"]);
//   // const translateY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-100%"]);

//   return (
//     <div className="relative mt-0 text-white md:mt-14 selection:bg-cyan-800">
//       {/* Section 1 */}
//       <motion.div
//         style={{ opacity }}
//         ref={targetRef}
//         className="relative h-screen"
//       >
//         <section className=" py-48 bg-[#161d29] flex items-center justify-center">
//           <motion.div
//             style={{ scale }}
//             className="relative flex flex-col items-center justify-center mt-10 md:mt-0 gap-y-3 max-w-maxContent"
//           >
//             <header className="flex flex-col items-center justify-center text-2xl md:text-4xl text-slate-200">
//               <h1 className="font-semibold text-center">
//                 Driving Innovation in Online Education for a
//               </h1>{" "}
//               <HighlightText text={"Brighter Future"} />
//               <p className="mt-3 text-sm text-slate-400 font-medium max-w-[80%] text-center">
//                 LearnSphere is at the forefront of driving innovation in online
//                 education. We're passionate about creating a brighter future by
//                 offering cutting-edge courses, leveraging emerging technologies,
//                 and nurturing a vibrant learning community.
//               </p>
//             </header>
//             <div className="absolute md:top-[140%] gap-y-10 top-[150%] flex flex-col mx-auto">
//               <div className="flex flex-row mx-auto gap-x-5">
//                 <img
//                   src={BannerImage1}
//                   alt="Banner1"
//                   className="w-[100px] aspect-square md:aspect-auto sm:w-[200px] lg:w-[384px]"
//                 />
//                 <img
//                   src={BannerImage2}
//                   alt="Banner2"
//                   className="w-[100px] aspect-square md:aspect-auto sm:w-[200px] lg:w-[384px]"
//                 />
//                 <img
//                   src={BannerImage3}
//                   alt="Banner3"
//                   className="w-[100px] aspect-square md:aspect-auto sm:w-[200px] lg:w-[384px]"
//                 />
//               </div>
//               <Quote />
//             </div>
//           </motion.div>
//         </section>
//       </motion.div>

//       {/* Section: 2/3 */}

//       <Vision />
//       {/* Section: 4 */}
//       <section>
//         <StatsComponenet />
//       </section>
//       {/* Section: 5 */}
//       <section className="w-11/12 mx-auto max-w-maxContent">
//         <LearningGrid />
//         <ContactFormSection />
//       </section>

//       <section className="mt-20">
//         <Footer />
//       </section>
//     </div>
//   );
// };

// export default About;

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Quote from "../components/core/AboutPage/Quote";
import StatsComponenet from "../components/core/AboutPage/Stats";
import HighlightText from "../components/core/homeaccessories/HighlightText";
import Footer from "../components/common/Footer";
import Vision from "../components/core/AboutPage/Vision";

const About = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);

  return (
    <div className="mt-0 text-white md:mt-14 selection:bg-cyan-800">
      {/* Section 1 */}
      <motion.div ref={targetRef} className="relative h-screen">
        <section className=" bg-[#161d29] h-[40vh] flex items-center justify-center">
          <motion.div
            style={{ opacity, scale }}
            className="fixed flex flex-col items-center justify-center gap-y-3 max-w-maxContent"
          >
            <header className="flex flex-col items-center justify-center mx-5 text-xl mt-14 md:mt-0 md:text-4xl text-slate-200">
              <h1 className="font-semibold text-center">
                Driving Innovation in Online Education for a
              </h1>{" "}
              <HighlightText text={"Brighter Future"} />
              <p className="mt-3 text-xs text-slate-400 font-medium max-w-[80%] text-center">
                LearnSphere is at the forefront of driving innovation in online
                education. We're passionate about creating a brighter future by
                offering cutting-edge courses, leveraging emerging technologies,
                and nurturing a vibrant learning community.
              </p>
            </header>
            <div className="absolute md:top-[140%] gap-y-10 top-[108%] flex flex-col mx-auto">
              <div className="flex flex-row mx-auto gap-x-5">
                <img
                  src={BannerImage1}
                  alt="Banner1"
                  className="w-[100px] aspect-square md:aspect-auto sm:w-[200px] lg:w-[384px]"
                />
                <img
                  src={BannerImage2}
                  alt="Banner2"
                  className="w-[100px] aspect-square md:aspect-auto sm:w-[200px] lg:w-[384px]"
                />
                <img
                  src={BannerImage3}
                  alt="Banner3"
                  className="w-[100px] aspect-square md:aspect-auto sm:w-[200px] lg:w-[384px]"
                />
              </div>
              <Quote />
            </div>
          </motion.div>
        </section>
      </motion.div>

      {/* Section: 2/3 */}
      <Vision />
      {/* Section: 4 */}
      <section>
        <StatsComponenet />
      </section>
      {/* Section: 5 */}
      <section className="w-11/12 mx-auto max-w-maxContent">
        <LearningGrid />
        <ContactFormSection />
      </section>

      <section className="mt-20">
        <Footer />
      </section>
    </div>
  );
};

export default About;
