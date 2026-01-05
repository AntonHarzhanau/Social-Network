import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import MediaBoxImageItem from "./MediaBoxImageItem";

const MediaBoxImageList = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex justify-center">
        <div className="p-2 w-full">
          <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
            <MediaBoxImageItem />
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-4 w-full px-2">
        <Button className="flex-1">
          <PlusCircleIcon />
          Load photos
        </Button>
        <Button className="flex-1">All photos</Button>
      </div>
    </div>
  );
};

export default MediaBoxImageList;
