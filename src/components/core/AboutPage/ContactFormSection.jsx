import React from "react";
import ContactUsForm from "../../ContactPage/ContactUsForm";
import { DiSenchatouch } from "react-icons/di";

const ContactFormSection = () => {
  return (
    <div className="mx-auto mt-24">
      <h1 className="flex items-center justify-center text-4xl font-semibold text-center gap-x-2 text-slate-400">
        <DiSenchatouch />
        Get in Touch
      </h1>
      <p className="mt-3 font-medium text-center text-cyan-500">
        We&apos;d love to hear from you. Please fill out this form!
      </p>
      <div className="flex justify-center mx-auto mt-12">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
