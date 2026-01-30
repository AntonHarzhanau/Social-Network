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
    <section
      className={cn(
        "w-full rounded-2xl bg-secondary shadow overflow-hidden",
        className,
      )}
    >
      {/* Cover */}
      <div className="relative h-28 sm:h-36 md:h-44 lg:h-56">
        {cover ?? (
          <div className="absolute inset-0 bg-linear-to-r from-slate-100 to-amber-200" />
        )}

        {coverAction ? (
          <div className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10">
            {coverAction}
          </div>
        ) : null}
      </div>

      {/* Bottom */}
      <div className="px-3 sm:px-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          {/* Avatar overlaps cover */}
          <div className="-mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16 shrink-0 self-start">
            {avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">{title}</div>
                {rightActions ? (
                  <div className="shrink-0 mt-1">{rightActions}</div>
                ) : null}
              </div>

              {meta ? (
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {meta}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
