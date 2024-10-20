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

const Catalog = () => {
    const { loading: profileLoading } = useSelector((state) => state.profile);
    const { catalogName } = useParams();
    const [active, setActive] = useState(1);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all categories
    useEffect(() => {
        const getAllCategories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const categoryData = res?.data?.categoryDetails?.categories;
            const category_id = categoryData?.filter(
                (ct) =>
                    ct.name.split(" ").join("-").toLowerCase() === catalogName
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
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

    if (loading || profileLoading) {
        return (
            <div className="w-full place-items-center">
                <Spinner />
            </div>
        );
    }
    console.log("Catalog Page data: ", catalogPageData);

    return (
        <>
            <div className="flex flex-col min-h-screen mt-14">
                {/* Hero section or section: 0 */}
                <div className="box-content px-4 bg-richblack-800">
                    <div className="mx-auto flex min-h-[215px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
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
                            {
                                catalogPageData?.data?.selectedCategory
                                    ?.description
                            }
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
                        Id={"slider1"}
                        Courses={
                            catalogPageData?.data?.selectedCategory?.courses
                        }
                    />
                </div>

                {/* Section: 2 */}
                <div className="box-content w-full px-4 py-12 mx-auto max-w-maxContentTab lg:max-w-maxContent">
                    <div className="text-2xl font-bold text-slate-300 lg:text-4xl">
                        Top Courses in{" "}
                        {catalogPageData?.data?.differentCategory?.name}
                    </div>
                    <div className="py-2">
                        <CourseSlider
                            Id={"slider2"}
                            Courses={
                                catalogPageData?.data?.differentCategory
                                    ?.courses
                            }
                        />
                    </div>
                </div>

                {/* Section: 3 */}
                <div className="box-content w-full px-4 py-12 mx-auto max-w-maxContentTab lg:max-w-maxContent">
                    <div className="text-2xl font-bold text-slate-300 lg:text-4xl">
                        Frequently Bought
                    </div>
                    <div className="py-8">
                        <div className="grid grid-cols-1 gap-6 place-items-center lg:grid-cols-2">
                            {catalogPageData?.data?.mostSellingCourses
                                ?.slice(0, 4)
                                .map((course, i) => (
                                    <CourseCard
                                        course={course}
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
