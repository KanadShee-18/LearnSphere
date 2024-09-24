import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    cart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],

    total: localStorage.getItem("total")
        ? JSON.parse(localStorage.getItem("total"))
        : 0,

    totalItems: localStorage.getItem("totalItems")
        ? JSON.parse(localStorage.getItem("totalItems"))
        : 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload;
            const index = state.cart.findIndex(
                (item) => item._id === course._id
            );

            if (index >= 0) {
                // if course alreary in cart
                toast.error("Course is already in cart. Proceed further.");
                return;
            }
            // if course is not present in cart
            state.cart.push(course);
            state.totalItems++;
            state.total += course.price;
            // update local storage
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total));
            localStorage.setItem(
                "totalItems",
                JSON.stringify(state.totalItems)
            );
            // return success toast
            toast.success("Course added to your cart.");
        },

        removeFromCart: (state, action) => {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            if (index >= 0) {
                // if course is in cart then remove
                state.totalItems--;
                state.total -= state.cart[index].price;
                state.cart.splice(index, 1);
                // update the local storage
                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("total", JSON.stringify(state.total));
                localStorage.setItem(
                    "totalItems",
                    JSON.stringify(state.totalItems)
                );
                // success toast of remove item from cart
                toast.success("Course has successfully removed from the cart.");
            }
        },
        resetCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;
            // remove them from local storage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        },
    },
});

export const { addToCartm, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
