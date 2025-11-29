import { Heart } from "lucide-react";
import { Button } from "./ui/button";

interface LikeButtonProps {
  count: number;
  isActive: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const LikeButton = ({ count, isActive, disabled, onClick }: LikeButtonProps) => {

  return (
   <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1"
      onClick={onClick}
      disabled={disabled}
    >
      <Heart className={isActive ? "fill-current text-red-500" : ""} />
      <span className={isActive ? "text-sm text-red-500" : "text-sm"}>{count}</span>
    </Button>
  );
};
