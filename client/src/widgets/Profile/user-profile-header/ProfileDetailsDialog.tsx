import type { UserPrivateProfileDetails } from "@/entities/user/model/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isPending: boolean;
  data?: UserPrivateProfileDetails;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-semibold">{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value || !value.trim()) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export function ProfileDetailsDialog({
  open,
  onOpenChange,
  isPending,
  data,
}: Props) {
  const work = data?.workExperiences?.filter(
    (w) => w.company?.trim() || w.positionTitle?.trim(),
  );
  const educations = data?.educations?.filter(
    (e) => e.institutionName?.trim() || e.programName?.trim(),
  );

  const showProfile =
    !!data?.dateOfBirth?.trim() ||
    !!data?.maritalStatus?.trim() ||
    !!data?.location?.trim();
  const showBio = !!data?.bio?.trim();
  const showWork = !!work?.length;
  const showEducation = !!educations?.length;

  const hasAny = showProfile || showBio || showWork || showEducation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90dvh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Profile details</DialogTitle>
        </DialogHeader>

        {/* Scroll area */}
        <div className="min-h-0 flex-1 overflow-auto flex flex-col gap-5">
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : data && hasAny ? (
            <>
              {showProfile ? (
                <>
                  <Section title="Profile">
                    <Row label="Date of birth" value={data.dateOfBirth} />
                    <Row label="Marital status" value={data.maritalStatus} />
                    <Row label="Location" value={data.location} />
                  </Section>
                  <Separator />
                </>
              ) : null}

              {showBio ? (
                <>
                  <Section title="Biography">
                    <div className="text-sm whitespace-pre-wrap">
                      {data.bio!.trim()}
                    </div>
                  </Section>
                  <Separator />
                </>
              ) : null}

              {showWork ? (
                <>
                  <Section title="Work experience">
                    {work!.map((w) => (
                      <div key={w.id} className="flex flex-col gap-1">
                        <div className="text-sm">
                          {w.company}
                          {w.positionTitle ? ` — ${w.positionTitle}` : ""}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {w.startAt} — {w.endAt ?? "present"}
                        </div>
                      </div>
                    ))}
                  </Section>
                  <Separator />
                </>
              ) : null}

              {showEducation ? (
                <Section title="Education">
                  {educations!.map((e) => (
                    <div key={e.id} className="flex flex-col gap-1">
                      <div className="text-sm">
                        {e.institutionName}
                        {e.programName ? ` — ${e.programName}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {e.startAt} — {e.endAt ?? "present"}
                      </div>
                    </div>
                  ))}
                </Section>
              ) : null}
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Details are not available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
