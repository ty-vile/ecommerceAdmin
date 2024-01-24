import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

type Props = {
  content: string;
  isLoadingContent: string;
  isLoading: boolean;
};

const CreateButton = ({ content, isLoading, isLoadingContent }: Props) => {
  return (
    <Button
      type="submit"
      variant="create"
      disabled={isLoading}
      className={`w-full ${isLoading && "bg-gray-100/70"}`}
    >
      <FaPlus />
      {isLoading ? isLoadingContent : content}
    </Button>
  );
};

export default CreateButton;
