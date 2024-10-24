import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { SiBigcartel } from "react-icons/si";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);
  // console.log("Total in cart: ", total);
  //   console.log("Total items in cart: ", totalItems);

  return (
    <div className="flex flex-col w-10/12 mx-auto mt-12 mb-32 max-w-maxContent xl:w-3/4">
      <div className="flex items-center text-3xl font-medium gap-x-2 mb-14 text-blue-25">
        <SiBigcartel />
        Cart
      </div>
      <p className="pb-2 font-semibold border-b border-b-slate-500 text-slate-400">
        {totalItems} Courses in cart
      </p>

      {total > 0 ? (
        <div className="flex flex-col-reverse items-start mt-8 gap-x-10 gap-y-6 lg:flex-row">
          <RenderCartCourses />
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="text-3xl text-center mt-14 text-slate-400">
          Your cart is empty.
        </p>
      )}
    </div>
  );
}
