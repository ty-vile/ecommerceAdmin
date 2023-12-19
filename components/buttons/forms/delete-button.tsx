import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";

type Props = {
  content: string;
  index: number;
  deleteFunc: (index: number) => void;
};

const DeleteButton = ({ content, index, deleteFunc }: Props) => {
  return (
    <Button type="button" onClick={() => deleteFunc(index)} variant="delete">
      <MdDelete />
      {content}
    </Button>
  );
};

export default DeleteButton;
