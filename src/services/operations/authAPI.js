import { toast } from "react-toastify";

import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        console.log("In send otp email comes as: ", email);

        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            });
            console.log("SENDOTP API RESPONSE............", response);

            console.log(response.data.success);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("OTP Sent Successfully");
            navigate("/verify-email");
        } catch (error) {
            console.log("SENDOTP API ERROR............", error);
            toast.error("Could Not Send OTP");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            });

            console.log("SIGNUP API RESPONSE............", response);

            if (!response.data.success) {
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            toast.success("Signup Successful");
            navigate("/login");
        } catch (error) {
            console.log("SIGNUP API ERROR............", error);
            toast.error("Signup Failed");
            navigate("/signup");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password,
            });

            console.log("LOGIN API RESPONSE............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            const { token } = await response.data.loggedUser;
            const { firstName, lastName, image } = await response.data
                ?.loggedUser?.dataUser?.data;
            const user = await response?.data?.loggedUser?.dataUser?.data;

            console.log("Auth User set as: ", user);

            toast.success("Login Successful");
            dispatch(setToken(token));

            const userImage = image
                ? image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
            dispatch(setUser({ ...user, image: userImage }));

            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/dashboard/my-profile");
        } catch (error) {
            console.log("LOGIN API ERROR............", error);
            const errorMessage =
                error.response?.data?.message || "Login failed";
            console.log("Setting error message:", errorMessage);
            console.log("Error message after setting:", errorMessage);
            toast.error(errorMessage);
        }
        dispatch(setLoading(false));
    };
}

export function logout(navigate) {
    console.log("Logout action triggered!");

    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out Successfully!");
        navigate("/");
    };
}

export function getPasswordResetToken(email, setEmailSent) {
    console.log("Email comes as: ", email);

    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                email,
            });

            console.log("Reset password token response: ", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Reset Email Sent");

            setEmailSent(true);
        } catch (error) {
            console.log("RESET PASSWORD TOKEN ERROR");
            toast.error("Failed to send email for resetting the password.");
        }
        dispatch(setLoading(false));
    };
}

export function resetPassword(
    password,
    confirmPassword,
    token,
    setErrMessage,
    navigate
) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSWORD_API, {
                password,
                confirmPassword,
                token,
            });

            console.log("RESET PASSWORD RESPONSE: ", response);

            console.log(response.data.message);

            if (!response.data.success) {
                setErrMessage(response.data.message);
                // toast.error(response.data.message);
                throw new Error(response.data.message);
            }

            toast.success("Password reset successfully.");
            navigate("/revert-back");
        } catch (error) {
            console.log("RESET PASSWORD ERROR: ", error);
            toast.error("Failed to reset password.");
        }
        dispatch(setLoading(false));
    };
}
