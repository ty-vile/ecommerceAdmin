"use client";

import { SKUFORMSTEP } from "@/components/forms/dashboard/product/product-sku-form";
import { ReactElement } from "react";

type Props = {
  formStep: number;
  skuFormStep: number;
  stepNumber: number;
  setFormStep: (formStep: number) => void;
  children: React.ReactNode;
  content: String;
};

const FormStep = ({
  formStep,
  setFormStep,
  children,
  content,
  skuFormStep,
  stepNumber,
}: Props) => {
  const isActive = formStep === skuFormStep ? true : false;

  return (
    <>
      <div
        className={`flex flex-col  px-8 py-6  w-1/5 min-w-[100px] transition-300 cursor-pointer ${
          isActive
            ? "border-blue-500 border-2 shadow-md"
            : "border-gray-200 border-2"
        }`}
        onClick={() => setFormStep(skuFormStep)}
      >
        {children}
        <span className="font-bold pt-2">Step {stepNumber}:</span>
        {content}
      </div>
    </>
  );
};

export default FormStep;
