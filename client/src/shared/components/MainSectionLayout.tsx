import React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

interface MainSectionLayoutProps {
  pageContent: React.ReactNode;
  asideContent: React.ReactNode;
}

const MainSectionLayout = ({
  pageContent,
  asideContent,
}: MainSectionLayoutProps) => {
  return (
    <div className="flex w-full gap-2">
      <div className="flex-5 min-w-0">
        <div className="lg:hidden mb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                Open list
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>List</SheetTitle>
              </SheetHeader>
              <div className="p-2">{asideContent}</div>
            </SheetContent>
          </Sheet>
        </div>

        {pageContent}
      </div>

      <aside className="hidden lg:block flex-3 h-fit sticky top-14 p-2">
        {asideContent}
      </aside>
    </div>
  );
};

export default MainSectionLayout;
