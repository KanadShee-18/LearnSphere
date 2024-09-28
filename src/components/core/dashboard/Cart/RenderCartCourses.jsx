import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaT, FaTrashCan } from "react-icons/fa6";
import { removeFromCart } from "../../../../slices/cartSlice";

const RenderCartCourses = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  return (
    <div>
      {cart.map((course, index) => (
        <div>
          <div>
            <img src={course.thumbnail} alt={course.name} />
            <div>
              <p>{course?.courseName}</p>
              <p>{course?.category?.name}</p>
              <div>
                <span>4.5</span>
                <ReactStars
                  count={5}
                  size={20}
                  edit={false}
                  activeColor={"#ffd700"}
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span>{course?.ratingsAndReviews?.length} Ratings</span>
              </div>
            </div>
          </div>

          <div>
            <button
              className="flex flex-col items-center justify-start"
              onClick={() => dispatch(removeFromCart(course._id))}
            >
              <FaTrashCan className="text-red-400 size-7" />
              <span>Remove</span>
            </button>
            <p>Rs. {course.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartCourses;
