import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaT, FaTrashCan } from "react-icons/fa6";
import { BsFillTrash2Fill } from "react-icons/bs";
import { removeFromCart } from "../../../../slices/cartSlice";

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col flex-1">
      {cart.map((course, index) => (
        <div
          key={course._id}
          className={`w-full flex flex-wrap items-start justify-between gap-6 ${
            index !== cart.length - 1 && "border-b border-b-slate-500 pb-6"
          }
                ${index !== 0 && "mt-6"}
                `}
        >
          <div className="flex flex-col flex-1 gap-4 xl:flex-row">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[150px] w-[220px] rounded-lg object-cover"
            />
            <div className="flex flex-col gap-y-1">
              <p className="text-lg font-medium text-slate-300">
                {course?.courseName}
              </p>
              <p className="text-sm text-slate-500">{course?.category?.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-teal-500">4.5</span>
                <ReactStars
                  count={5}
                  value={course?.ratingAndReviews?.length}
                  size={20}
                  edit={false}
                  activeColor="#09e099"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span className="text-slate-400">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              className="flex items-center px-4 py-3 text-pink-200 border rounded-md gap-x-1 border-slate-600 bg-[#222c42]"
              onClick={() => dispatch(removeFromCart(course._id))}
            >
              <BsFillTrash2Fill />
              <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-teal-500">
              ₹ {course?.price.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartCourses;
