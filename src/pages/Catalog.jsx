import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { useSelector } from "react-redux";
import Spinner from "../components/common/Spinner";
import CourseCard from "../components/core/Catalog/CourseCard";
import { toast } from "sonner";
import { motion } from "framer-motion";
import BounceToTop from "../components/common/BounceToTop";
import { FaStar } from "react-icons/fa";
import CatalogShimmer from "../components/common/CatalogShimmer";

const Catalog = () => {
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [initialCourses, setInitialCourses] = useState([]);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  useEffect(() => {
    const getAllCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const categoryData = res?.data?.categoryDetails?.categories;
      const category_id = categoryData?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]?._id;
      setCategoryId(category_id);
    };
    getAllCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      setLoading(true);
      try {
        const res = await getCatalogPageData(categoryId);

        setCatalogPageData(res);
        if (!initialCourses.length) {
          setInitialCourses(res?.data?.selectedCategory?.courses || []);
        }
      } catch (error) {
        toast.error("Error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);

  const handleActiveChange = (option) => {
    if (option === 2) {
      const sortedCourses = [
        ...catalogPageData.data.selectedCategory.courses,
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setCatalogPageData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          selectedCategory: {
            ...prevData.data.selectedCategory,
            courses: sortedCourses,
          },
        },
      }));
    } else if (option === 1) {
      setCatalogPageData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          selectedCategory: {
            ...prevData.data.selectedCategory,
            courses: initialCourses,
          },
        },
      }));
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="w-full grid h-[70vh] place-items-center">
        <CatalogShimmer />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen mt-14">
        <div className="fixed  z-[200]">
          <BounceToTop />
        </div>
        {/* Hero section or section: 0 */}
        <div className="box-content px-4 bg-richblack-800">
          <motion.div
            initial={{ x: 70, y: -70, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.4,
              type: "spring",
              stiffness: 60,
              damping: 25,
            }}
            className="mx-auto flex min-h-[215px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent"
          >
            <p className="text-xs md:text-sm text-richblack-300">
              {`Home / Catalog / `}
              <span className="text-teal-400">
                {catalogPageData?.data?.selectedCategory?.name}
              </span>
            </p>
            <p className="text-2xl md:text-3xl text-richblack-5">
              {catalogPageData?.data?.selectedCategory?.name}
            </p>
            <p className="max-w-[860px] md:text-base text-sm text-richblack-200">
              {catalogPageData?.data?.selectedCategory?.description}
            </p>
          </motion.div>
        </div>

        {/* Section: 1 */}
        <div className="box-content w-full px-4 py-12 mx-auto max-w-maxContentTab lg:max-w-maxContent">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 60,
              damping: 25,
            }}
            className="text-xl font-bold md:text-2xl text-slate-300 lg:text-4xl"
          >
            Courses To Get You Started
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              type: "spring",
              stiffness: 60,
              damping: 25,
            }}
            className="flex my-4 text-sm border-b border-b-richblack-600"
          >
            <p
              className={`px-4 py-2 cursor-pointer ${
                active === 1
                  ? "border-b border-b-teal-300 text-teal-400"
                  : "text-richblack-50"
              }`}
              onClick={() => {
                setActive(1);
                handleActiveChange(1);
              }}
            >
              Most Popular
            </p>
            <p
              className={`px-4 py-2 cursor-pointer ${
                active === 2
                  ? "border-b border-b-teal-300 text-teal-400"
                  : "text-richblack-50"
              }`}
              onClick={() => {
                setActive(2);
                handleActiveChange(2);
              }}
            >
              Latest
            </p>
          </motion.div>

          <CourseSlider
            Id={"slider1"}
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>

        {/* Section: 2 */}
        <div className="box-content w-full px-4 py-12 mx-auto max-w-maxContentTab lg:max-w-maxContent">
          <div className="text-xl font-bold md:text-2xl text-slate-300 lg:text-4xl">
            Top Courses in {catalogPageData?.data?.differentCategory?.name}
          </div>
          <div className="py-2">
            <CourseSlider
              Id={"slider2"}
              Courses={catalogPageData?.data?.differentCategory?.courses}
            />
          </div>
        </div>

        {/* Section: 3 */}
        <div className="box-content w-full px-4 py-12 mx-auto max-w-maxContentTab lg:max-w-maxContent">
          <div className="text-xl font-bold md:text-2xl text-slate-300 lg:text-4xl">
            Frequently Bought
          </div>
          <div className="py-8">
            <div className="grid grid-cols-1 gap-6 place-items-center lg:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, i) => (
                  <CourseCard
                    course={course}
                    Width={"w-10/12"}
                    key={i}
                    Height={"h-[270px]"}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Catalog;
