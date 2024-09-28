import React from "react";
import ContactUsForm from "../../ContactPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="mx-auto mt-24">
      <h1 className="text-4xl font-semibold text-center text-slate-400">
        Get in Touch
      </h1>
      <p className="mt-3 font-medium text-center text-cyan-500">
        We&apos;d love to hear for you, Please fill out this form.
      </p>
      <div className="flex justify-center mx-auto mt-12">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
