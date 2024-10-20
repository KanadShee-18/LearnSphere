import { studentEndpoints } from "../apis";
import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export async function buyCourse(
    token,
    courses,
    userDetails,
    navigate,
    dispatch
) {
    const toastId = toast.loading("Loading ...");
    try {
        // script load
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            toast.error(
                "Server side error occurred in Razorpay. Please retry!"
            );
            return;
        }

        // Initiate order using capture payment
        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("Printing order response: ", orderResponse);

        // Options:
        const options = {
            key: orderResponse.data.message.key,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_Id: orderResponse.data.message.id,
            name: "LearnSphere",
            description: "Thank You for Purchasing the Course",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: `${userDetails.email}`,
            },
            handler: function (response) {
                // Send success email

                sendPaymentSuccessEmail(
                    response,
                    orderResponse.data.message.amount,
                    token
                );
                // Verify payment
                verifyPayment(
                    { ...response, courses },
                    token,
                    navigate,
                    dispatch
                );
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Oops, Payment Failed!");
            console.log(response.error);
        });
    } catch (error) {
        console.log("PAYMENT API ERROR: ", error);
        toast.error("Could Not Make Payment.");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`,
            }
        );
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

// Verify Payment:
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment ...");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success(
            "Payment Successful, you have been enrolled in the course."
        );
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR: ", error);
        toast.error("Could not verify payment.");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
