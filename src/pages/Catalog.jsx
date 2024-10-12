import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { useSelector } from "react-redux";
import Spinner from "../components/common/Spinner";

const Catalog = () => {
  const { loading } = useSelector((state) => state.profile);
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories
  useEffect(() => {
    const getAllCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const categoryData = res?.data?.categoryDetails?.categories;
      const category_id = categoryData?.filter(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]._id;
      setCategoryId(category_id);
    };
    getAllCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogPageData(categoryId);
        console.log("Category response comes as: ", res);

        setCatalogPageData(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Hero section or section: 0 */}
        <div className="box-content px-4 bg-richblack-800">
          <div className="mx-auto flex min-h-[255px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
            <p className="text-sm text-richblack-300">
              {`Home / Catalog / `}
              <span className="text-teal-400">
                {catalogPageData?.data?.selectedCategory?.name}
              </span>
            </p>
            <p className="text-3xl text-richblack-5">
              {catalogPageData?.data?.selectedCategory?.name}
            </p>
            <p className="max-w-[860px] text-richblack-200">
              {catalogPageData?.data?.selectedCategory?.description}
            </p>
          </div>
        </div>

        {/* Section: 1 */}
        <div className="box-content w-full px-4 py-12 mx-auto max-w-maxContentTab lg:max-w-maxContent">
          <div className="text-2xl font-bold text-slate-300 lg:text-4xl">
            Courses To Get You Started
          </div>
          <div className="flex my-4 text-sm border-b border-b-richblack-600">
            <p
              className={`px-4 py-2 cursor-pointer ${
                active === 1
                  ? "border-b border-b-teal-300 text-teal-400"
                  : "text-richblack-50"
              }`}
              onClick={() => setActive(1)}
            >
              Most Popular
            </p>
            <p
              className={`px-4 py-2 cursor-pointer ${
                active === 2
                  ? "border-b border-b-teal-300 text-teal-400"
                  : "text-richblack-50"
              }`}
              onClick={() => setActive(2)}
            >
              Latest
            </p>
          </div>

          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default Catalog;
