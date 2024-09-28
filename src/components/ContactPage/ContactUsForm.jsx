import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiConnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from "../../data/countrycode.json";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Logging contact data: ", data);

    try {
      setLoading(true);
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      //   const response = { status: "OK", message: "Data Recieved" };
      console.log("Logging contact response", response);
      setLoading(false);
      toast.info("We have received your message!");
    } catch (error) {
      console.log("Contact error from error: ", error.message);
      toast.error("Some error occurred. Please try again!");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneno: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="flex justify-center text-cyan-500 max-w-[460px] "
    >
      <div className="flex flex-col gap-5 p-4 rounded-xl w-fit">
        <div className="flex flex-col gap-5 sm:flex-row">
          {/* Firstname */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="firstname">
              First Name <span className="text-pink-100">*</span>{" "}
            </label>
            <input
              className="px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-cyan-500 text-teal-500 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter first name"
              {...register("firstname", { required: true })}
            />
            {errors.firstname && (
              <span className="px-2 text-sm text-pink-100 ">
                Please Enter Your First Name
              </span>
            )}
          </div>
          {/* Lasstname */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="lasstname">
              Last Name{" "}
              <span className="text-sm text-teal-500">(Optional)</span>
            </label>
            <input
              className="px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-cyan-500 text-teal-500 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Enter last name"
              {...register("lastname")}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="email">
            Enter Email Address <span className="text-pink-100">*</span>
          </label>
          <input
            className="px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-cyan-500 text-teal-500 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
            type="email"
            name="email"
            id="email"
            placeholder="Enter email address"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="px-2 text-sm text-pink-100 ">
              Please enter your email address.
            </span>
          )}
        </div>

        {/* Phone No */}
        <div className="flex flex-row justify-between w-full gap-x-5 gap-y-2">
          {/* Dropdown */}
          <div className="flex flex-col max-w-[100px] overflow-hidden rounded-lg outline-none gap-y-2">
            <label htmlFor="phoneno">
              Code <span className="text-pink-200">*</span>
            </label>
            <select
              name="countrycode"
              id="countrycode"
              {...register("countrycode", { required: true })}
              className="py-3 rounded-lg outline-none bg-gradient-to-bl from-slate-800 to-slate-700 scrollbar-hide"
            >
              {CountryCode.map((element, index) => {
                return (
                  <option
                    key={index}
                    value={element.code}
                    className="pl-3 hover:bg-cyan-600 text-slate-300 bg-slate-700"
                  >
                    {element.code} - {element.country}
                  </option>
                );
              })}
            </select>
            {errors.countrycode && (
              <span className="px-2 text-sm text-pink-100 ">Required</span>
            )}
          </div>
          {/* Number */}
          <div className="flex flex-col gap-y-2 w-[80%]">
            <label htmlFor="phoneno">
              Enter Mobile No <span className="text-pink-200">*</span>
            </label>
            <input
              type="text"
              name="phoneno"
              id="phoneno"
              {...register("phoneno", {
                required: {
                  value: true,
                  message: "Please provide a Phone Number",
                },
                maxLength: { value: 10, message: "Invalid Phone Number" },
                minLength: { value: 8, message: "Invalid Phone Number" },
              })}
              placeholder="874XXXXXX0"
              className="px-2 w-full py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-cyan-500 text-teal-500 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
            />
            {errors.phoneno && (
              <span className="px-2 text-sm text-pink-100 ">
                {errors.phoneno.message}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="message">
            Enter Message <span className="text-pink-200">*</span>
          </label>
          <textarea
            className="px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-cyan-500 text-teal-500 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
            name="message"
            id="message"
            rows="7"
            placeholder="Enter your desire"
            {...register("message", { required: true })}
          />
          {errors.message && (
            <span className="px-2 text-sm text-pink-100 ">
              Please enter your message.
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 font-medium bg-teal-600 rounded-md shadow-sm text-slate-200 hover:bg-cyan-700 active:bg-cyan-500 shadow-teal-600 active:text-slate-900"
        >
          Send Message
        </button>
        <div className="flex justify-center w-full mt-3">
          {loading && <Spinner />}
        </div>
      </div>
    </form>
  );
};

export default ContactUsForm;
