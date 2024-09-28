import React from "react";
import IconBtn from "../../../common/IconBtn";

const RenderTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id);
    console.log();

    // TODO: API Integration RZP
  };

  return (
    <div>
      <p>Total:</p>
      <p>Rs. {total}</p>

      <IconBtn
        text={"Buy Now"}
        onclick={handleBuyCourse}
        customClasses={`w-full py-3 bg-green-400`}
      ></IconBtn>
    </div>
  );
};

export default RenderTotalAmount;
