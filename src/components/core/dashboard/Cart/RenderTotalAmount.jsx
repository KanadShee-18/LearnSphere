import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";

const RenderTotalAmount = () => {
    const { total, cart } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const user = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        buyCourse(token, courses, user, navigate, dispatch);
    };
    return (
        <div className="min-w-[282px] rounded-md border-[1px] border-slate-500 bg-[#2c3b5a] p-6">
            <p className="mb-1 text-sm font-medium text-slate-300">Total:</p>
            <p className="mb-6 text-3xl font-medium text-teal-500">
                ₹ {total.toLocaleString()}
            </p>
            <button
                onClick={handleBuyCourse}
                className="px-4 py-3 font-medium bg-teal-500 rounded-md hover:bg-teal-600 text-slate-800 hover:text-slate-200"
            >
                Buy Now
            </button>
        </div>
    );
};

export default RenderTotalAmount;
