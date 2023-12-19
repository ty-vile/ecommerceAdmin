"use client";

import { ReactElement } from "react";

type Props = {
  formStep: number;
  formStepValue: number;
  stepNumber: number;
  setFormStep: (formStep: number) => void;
  children: React.ReactNode;
  content: String;
};

const FormStep = ({
  formStep,
  formStepValue,
  setFormStep,
  children,
  content,
  stepNumber,
}: Props) => {
  const isActive = formStep === formStepValue ? true : false;

  return (
    <>
      <div
        className={`flex flex-col  px-8 py-6  w-1/5 min-w-[100px] transition-300 cursor-pointer ${
          isActive
            ? "bg-blue-700 text-white shadow-md"
            : "bg-white text-black border-2"
        }`}
        onClick={() => setFormStep(formStepValue)}
      >
        {children}
        <span className="font-bold pt-2">Step {stepNumber}:</span>
        {content}
      </div>
    </>
  );
};

export default FormStep;
