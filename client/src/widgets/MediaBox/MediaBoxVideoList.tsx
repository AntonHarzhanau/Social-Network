import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription } from "@/shared/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/components/ui/carousel";
import { PlusCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

const MediaBoxVideoList = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Carousel className="w-full max-w-md">
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-2/3"
            >
              <div className="p-1">
                <Card className="p-0 gap-1 border-none">
                  <CardContent className="flex aspect-video items-center justify-center p-0 rounded-2xl overflow-clip">
                    <img
                      src="https://sun9-7.userapi.com/SFWe7LEOYjCPVue4O9Aj72Mrfg7NLlhWfu82dg/ST7DUb9WAzw.jpg"
                      alt=""
                    />
                  </CardContent>
                  <CardDescription>
                    <div className="flex flex-col">
                      <Button
                        size="icon"
                        variant="link"
                        className="text-lg font-semibold px-0"
                      >
                        Title
                      </Button>
                      <Link to="/" className="text-sm font-nomal">
                        Author
                      </Link>
                      <div className="flex gap-1">
                        <p>200 watches</p>
                        <p>·</p>
                        <p>2 hours ago</p>
                      </div>
                    </div>
                  </CardDescription>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="secondary" className="left-4" />
        <CarouselNext variant="secondary" className="right-4" />
      </Carousel>

      <div className="mt-4 flex gap-4 w-full px-2">
        <Button className="flex-1">
          <PlusCircleIcon />
          Load videos
        </Button>
        <Button className="flex-1">All videos</Button>
      </div>
    </div>
  );
};

export default MediaBoxVideoList;
