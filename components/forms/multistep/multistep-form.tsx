"use client";

type Props = {
  multiStepData: {
    content: React.ReactElement;
    formStep: number;
  };
  formData: {
    content: React.ReactElement;
    form: any;
  };
};

const MultistepForm = ({ multiStepData, formData }: Props) => {
  return (
    <>
      {multiStepData.content}
      {formData.content}
    </>
  );
};

export default MultistepForm;
