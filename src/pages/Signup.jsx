import React from "react";
import Template from "../components/core/auth/Template";
import signupImg from "../assets/Images/signup.jpg";

const Signup = () => {
  return (
    <Template
      title="Join the millions learning to code with LearnSphere for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  );
};

export default Signup;
