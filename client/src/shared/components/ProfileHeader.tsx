import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface ProfileHeaderProps {
  className?: string;
  cover?: ReactNode;
  coverAction?: ReactNode;
  avatar: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  rightActions?: ReactNode;
}

const ProfileHeader = ({
  className,
  cover,
  coverAction,
  avatar,
  title,
  meta,
  rightActions,
}: ProfileHeaderProps) => {
  return (
    <div
      className={cn(
        "w-full mx-auto rounded-2xl bg-secondary shadow overflow-hidden",
        className,
      )}
    >
      {/* Cover */}
      <div
        className={cn(
          "w-full mx-auto rounded-2xl bg-secondary shadow overflow-hidden",
          className,
        )}
      >
        <div className="relative h-32 sm:h-40">
          {cover ?? (
            <div className="absolute inset-0 bg-linear-to-r from-slate-100 to-amber-200" />
          )}

          {coverAction ? (
            <div className="absolute right-7 top-7">{coverAction}</div>
          ) : null}

          {/* Avatar slot */}
          <div className="absolute left-4 sm:left-6 -bottom-4 translate-y-1/2">
            {avatar}
          </div>
        </div>

        {/* Bottom section */}
        <div
          className="
          min-h-28
          flex flex-col sm:flex-row
          justify-between items-start sm:items-center
          ml-34 sm:ml-40
          px-2 sm:px-4
        "
        >
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between items-start w-full">
              {title}
              {rightActions}
            </div>

            {meta ? (
              <div className="mt-1 text-sm text-muted-foreground">{meta}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
