import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toggleLikePost } from "@/shared/api/post";
import { Toggle } from "@/shared/components/ui/toggle";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  id: string;
  likeCount: number;
  isLiked: boolean;
}

export const LikeButton = ({ id, likeCount, isLiked }: LikeButtonProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleLikePost(id),
    onSuccess: (data) => {
      setLiked((prev) => !prev);
      setCount(data.likeCount);
    },
    onError: (error) => {
      console.error("Error toggling like:", error);
    },
  });

  return (
    <Toggle
      aria-label="Toggle like"
      size="sm"
      variant="default"
      pressed={liked}
      disabled={isPending}
      onPressedChange={() => mutate()}
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-400 data-[state=on]:*:[svg]:stroke-red-400"
    >
      <Heart />
      {count}
    </Toggle>
  );
};
