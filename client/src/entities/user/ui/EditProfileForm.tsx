import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { UserProfile } from "../model/types";
import { updateUserProfile } from "../api/userApi";

import UserProfileAvatar from "@/features/user/manage-avatar/ui/UserProfileAvatar";

import { FormInput } from "@/shared/components/FormInput";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

import { Tabs, TabsContent } from "@/shared/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import {
  User as UserIcon,
  Shield,
  Briefcase,
  GraduationCap,
  KeyRound,
  Menu,
  Plus,
} from "lucide-react";

/* -------------------- Schemas -------------------- */

const infoSchema = z.object({
  username: z.string().min(2, "Username is too short").max(100),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  maritalStatus: z.string().max(30).optional().nullable(),
});
type InfoForm = z.infer<typeof infoSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter current password"),
    newPassword: z.string().min(6, "Min 6 characters"),
    confirmNewPassword: z.string().min(6, "Min 6 characters"),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

type Visibility = "public" | "friends" | "private";
const privacySchema = z.object({
  pageVisibility: z.enum(["public", "friends", "private"]),
  postsVisibility: z.enum(["public", "friends", "private"]),
});
type PrivacyForm = z.infer<typeof privacySchema>;

/* -------------------- Local mock types (Experience/Education) -------------------- */

type WorkExperienceItem = {
  id: string;
  company: string;
  positionTitle?: string | null;
  startAt: string; // YYYY-MM-DD
  endAt?: string | null;
};

type EducationItem = {
  id: string;
  institutionName: string;
  programName?: string | null;
  degree?: string | null;
  startAt: string;
  endAt?: string | null;
};

/* -------------------- UI helpers -------------------- */

type TabKey = "general" | "privacy" | "experience" | "education";

const tabs: Array<{ key: TabKey; label: string; icon: ReactNode }> = [
  { key: "general", label: "General", icon: <UserIcon className="h-4 w-4" /> },
  { key: "privacy", label: "Privacy", icon: <Shield className="h-4 w-4" /> },
  {
    key: "experience",
    label: "Experience",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    key: "education",
    label: "Education",
    icon: <GraduationCap className="h-4 w-4" />,
  },
];

function TabNav({
  value,
  onChange,
  className,
  onItemClick,
}: {
  value: TabKey;
  onChange: (v: TabKey) => void;
  className?: string;
  onItemClick?: () => void;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              onChange(t.key);
              onItemClick?.();
            }}
            className={cn(
              "w-full text-left rounded-xl px-3 py-2 text-sm flex items-center gap-2",
              "transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t.icon}
            </span>
            <span className="font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------- Component -------------------- */

interface EditProfileFormProps {
  profileData?: UserProfile;
  userId?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  withTrigger?: boolean;
}

const EditProfileForm = ({
  profileData,
  userId,
  trigger,
  open: openProp,
  onOpenChange,
  withTrigger = true,
}: EditProfileFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };

  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Experience/Education mocks
  const [workItems, setWorkItems] = useState<WorkExperienceItem[]>([
    {
      id: "w1",
      company: "ACME Corp",
      positionTitle: "Junior Dev",
      startAt: "2023-09-01",
      endAt: null,
    },
    {
      id: "w2",
      company: "Ynov Lab",
      positionTitle: "Intern",
      startAt: "2022-06-01",
      endAt: "2022-09-01",
    },
  ]);

  const [eduItems, setEduItems] = useState<EducationItem[]>([
    {
      id: "e1",
      institutionName: "Ynov Campus Strasbourg",
      programName: "CS",
      degree: "Bachelor",
      startAt: "2022-09-01",
      endAt: null,
    },
    {
      id: "e2",
      institutionName: "Online Academy",
      programName: "Algorithms",
      degree: null,
      startAt: "2021-01-01",
      endAt: "2021-06-01",
    },
  ]);

  const [addingWork, setAddingWork] = useState(false);
  const [addingEdu, setAddingEdu] = useState(false);

  const queryClient = useQueryClient();

  // Mutation: base info only (existing API)
  const infoMutation = useMutation({
    mutationFn: (data: InfoForm) => updateUserProfile(data as any),
    onSuccess: async () => {
      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: ["userProfile", userId],
        });
      }
    },
  });

  // Placeholder handlers for password/privacy (plug your APIs later)
  const passwordMutation = useMutation({
    mutationFn: async (_data: PasswordForm) => {
      // TODO: call change-password API
      return;
    },
  });

  const privacyMutation = useMutation({
    mutationFn: async (_data: PrivacyForm) => {
      // TODO: call privacy API
      return;
    },
  });

  const isBusy =
    infoMutation.isPending ||
    passwordMutation.isPending ||
    privacyMutation.isPending;

  const infoForm = useForm<InfoForm>({
    resolver: zodResolver(infoSchema),
    defaultValues: { username: "", bio: "", location: "", maritalStatus: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const privacyForm = useForm<PrivacyForm>({
    resolver: zodResolver(privacySchema),
    defaultValues: { pageVisibility: "public", postsVisibility: "friends" },
  });

  // Reset when opening / profileData changes
  useEffect(() => {
    if (!open) return;
    if (!profileData) return;

    infoForm.reset({
      username: profileData.name ?? "",
      bio: profileData.bio ?? "",
      location: profileData.location ?? "",
      maritalStatus: profileData.maritalStatus ?? "",
    });

    privacyForm.reset({
      pageVisibility: "public",
      postsVisibility: "friends",
    });

    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  }, [open, profileData?.id]);

  // Footer buttons
  const onCancel = () => setOpen(false);

  const onSave = async () => {
    if (activeTab === "general") {
      // Save general info only
      await infoForm.handleSubmit(async (data) => {
        await infoMutation.mutateAsync(data);
        setOpen(false);
      })();
      return;
    }

    if (activeTab === "privacy") {
      await privacyForm.handleSubmit(async (data) => {
        await privacyMutation.mutateAsync(data);
        setOpen(false);
      })();
      return;
    }

    // experience/education placeholders: close
    setOpen(false);
  };

  const currentUserAvatarUrl = profileData?.avatarUrl ?? null;
  const isOwner = true; // if needed: pass from parent

  const openingDialogRef = useRef(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setActiveTab("general");
          setAddingWork(false);
          setAddingEdu(false);
        }
      }}
    >
      {withTrigger && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="default" size="sm">
              Edit profile
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "p-0 overflow-hidden flex flex-col",
          // wider on md (768px) so left column doesn't shrink
          "w-[96vw] sm:w-[94vw] md:w-[96vw] lg:w-auto",
          "sm:max-w-none md:max-w-none lg:max-w-[1120px] xl:max-w-[1240px]",
          // fixed height -> no jumping on tab change
          "h-[85vh] sm:h-[82vh]",
        )}
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-lg sm:text-xl">
                Edit Profile
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Update your profile and account settings.
              </p>
            </div>

            {/* Mobile: tabs button */}
            <div className="md:hidden">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Sections</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <TabNav
                      value={activeTab}
                      onChange={setActiveTab}
                      onItemClick={() => setMobileNavOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Body */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
          className="flex-1 overflow-hidden"
        >
          <div className="h-full grid md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_280px]">
            {/* Left content */}
            <div className="h-full px-5 sm:px-6 py-5 overflow-y-auto">
              {/* -------- General -------- */}
              <TabsContent value="general" className="m-0 space-y-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-24 w-24 sm:h-28 sm:w-28">
                    <UserProfileAvatar
                      userId={userId}
                      avatarUrl={currentUserAvatarUrl}
                      name={profileData?.name}
                      isOwner={isOwner}
                      isOnline={profileData?.isOnline}
                    />
                  </div>

                  <div className="w-full max-w-[520px]">
                    <FormInput
                      name="username"
                      control={infoForm.control}
                      label="Name"
                      type="text"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FormInput
                      name="location"
                      control={infoForm.control}
                      label="Address"
                      type="text"
                      placeholder="City, Country"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <FormInput
                      name="maritalStatus"
                      control={infoForm.control}
                      label="Status"
                      type="text"
                      placeholder="Single / Married / ..."
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Bio textarea with RHF */}
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={infoForm.watch("bio") ?? ""}
                    onChange={(e) => infoForm.setValue("bio", e.target.value)}
                    placeholder="Tell something about yourself…"
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <Separator />

                {/* Change password block */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Change password</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput
                      name="currentPassword"
                      control={passwordForm.control}
                      label="Current password"
                      type="password"
                      autoComplete="current-password"
                    />
                    <div className="hidden sm:block" />
                    <FormInput
                      name="newPassword"
                      control={passwordForm.control}
                      label="New password"
                      type="password"
                      autoComplete="new-password"
                    />
                    <FormInput
                      name="confirmNewPassword"
                      control={passwordForm.control}
                      label="Confirm new password"
                      type="password"
                      autoComplete="new-password"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Password change API is not wired yet — plug it into
                    passwordMutation.
                  </p>
                </div>
              </TabsContent>

              {/* -------- Privacy -------- */}
              <TabsContent value="privacy" className="m-0 space-y-6">
                <div>
                  <h3 className="text-base font-semibold">Privacy settings</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Control who can see your profile and posts.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Page visibility</Label>
                    <Select
                      value={privacyForm.watch("pageVisibility")}
                      onValueChange={(v) =>
                        privacyForm.setValue("pageVisibility", v as Visibility)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">public</SelectItem>
                        <SelectItem value="friends">friends</SelectItem>
                        <SelectItem value="private">private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Posts visibility</Label>
                    <Select
                      value={privacyForm.watch("postsVisibility")}
                      onValueChange={(v) =>
                        privacyForm.setValue("postsVisibility", v as Visibility)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">public</SelectItem>
                        <SelectItem value="friends">friends</SelectItem>
                        <SelectItem value="private">private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Privacy API is not wired yet — plug it into privacyMutation.
                </p>
              </TabsContent>

              {/* -------- Experience -------- */}
              <TabsContent value="experience" className="m-0 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">Work experience</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your work history.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setAddingWork(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {addingWork ? (
                  <Card className="p-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <input
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="we-company"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <input
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="we-position"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="we-start"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="we-end"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setAddingWork(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // mock save
                          setWorkItems((prev) => [
                            {
                              id: "w" + (prev.length + 1),
                              company: "New Company",
                              positionTitle: "New Position",
                              startAt: "2024-01-01",
                              endAt: null,
                            },
                            ...prev,
                          ]);
                          setAddingWork(false);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </Card>
                ) : null}

                <div className="space-y-3">
                  {workItems.map((w) => (
                    <Card key={w.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{w.company}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {w.positionTitle ?? "—"}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {w.startAt} — {w.endAt ?? "present"}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* -------- Education -------- */}
              <TabsContent value="education" className="m-0 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">Education</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your education history.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setAddingEdu(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {addingEdu ? (
                  <Card className="p-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Institution</Label>
                        <input
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="ed-inst"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Program</Label>
                        <input
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="ed-prog"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <input
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="ed-deg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="ed-start"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          id="ed-end"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setAddingEdu(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // mock save
                          setEduItems((prev) => [
                            {
                              id: "e" + (prev.length + 1),
                              institutionName: "New University",
                              programName: "New Program",
                              degree: "New Degree",
                              startAt: "2024-09-01",
                              endAt: null,
                            },
                            ...prev,
                          ]);
                          setAddingEdu(false);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </Card>
                ) : null}

                <div className="space-y-3">
                  {eduItems.map((e) => (
                    <Card key={e.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {e.institutionName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {e.programName ?? "—"}{" "}
                            {e.degree ? `• ${e.degree}` : ""}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {e.startAt} — {e.endAt ?? "present"}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>

            {/* Right panel (desktop) */}
            <div className="hidden md:block h-full border-l bg-muted/20 px-3 lg:px-4 py-5">
              <div className="sticky top-0">
                <TabNav value={activeTab} onChange={setActiveTab} />

                <Separator className="my-5" />

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Tip</p>
                  <p>
                    Use tabs to edit sections. Save applies to the current tab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Tabs>

        <Separator />

        {/* Footer buttons (always visible) */}
        <div className="px-6 py-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isBusy}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm;
