"use client";

type Props = {
  formStep: number;
  formStepValue: number;
  children: React.ReactNode;
  content: String;
};

const FormStep = ({ formStep, formStepValue, children, content }: Props) => {
  const isActive = formStep === formStepValue ? true : false;

  return (
    <>
      <div
        className={`flex items-center gap-4  px-8 py-6  w-1/5 min-w-[100px] w-full transition-300 ${
          isActive
            ? "bg-blue-700 text-white shadow-md"
            : "bg-white text-black border-2 border-gray-100"
        }`}
      >
        {children}
        <div>{content}</div>
      </div>
    </>
  );
};

export default FormStep;
