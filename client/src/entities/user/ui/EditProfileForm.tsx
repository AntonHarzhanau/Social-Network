import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addEducation,
  addWorkExperience,
  deleteEducation,
  deleteWorkExperience,
  patchMyProfileSettings,
  updateEducation,
  updateWorkExperience,
} from "@/entities/user/api/userApi";

import type {
  EducationUpsertInput,
  MaritalStatus,
  ProfileVisibility,
  UserPrivateProfileDetails,
  UserPrivacySettings,
  WorkExperienceUpsertInput,
} from "@/entities/user/model/types";

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

import { Skeleton } from "@/shared/components/ui/skeleton";

import {
  User as UserIcon,
  Shield,
  Briefcase,
  GraduationCap,
  KeyRound,
  Menu,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
} from "lucide-react";

import { sessionStore } from "@/entities/session/model/sessionStore";
import { authActions } from "@/features/auth/model/authActions";

import { userKeys } from "@/entities/user/model/queryKeys";
import { useUserProfileDetails } from "@/entities/user/model/useUserProfileDetails";

/* =========================
   Helpers
========================= */

const VISIBILITY_OPTIONS: ProfileVisibility[] = [
  "public",
  "friends",
  "private",
];
const MARITAL_OPTIONS: MaritalStatus[] = [
  "single",
  "married",
  "divorced",
  "widowed",
];

const DEFAULT_PRIVACY: UserPrivacySettings = {
  postsVisibility: "public",
  mediaVisibility: "public",
  friendsVisibility: "public",
  profileVisibility: "public",
  groupsVisibility: "public",
};

function normalizeNullableText(v: string): string | null {
  const t = v.trim();
  return t.length ? t : null;
}

/* =========================
   UI form shapes (no null in inputs)
========================= */

type UIInfoForm = {
  username: string;
  location: string; // "" => null
  bio: string; // "" => null
  maritalStatus: MaritalStatus | "__none__";
  dateOfBirth: string; // YYYY-MM-DD
};

type UIPrivacyForm = UserPrivacySettings;

const uiInfoSchema = z.object({
  username: z
    .string()
    .min(3, "Min 3 characters")
    .max(100, "Max 100 characters"),
  location: z.string().max(100, "Max 100 characters"),
  bio: z.string().max(2000, "Max 2000 characters"),
  maritalStatus: z.union([
    z.literal("__none__"),
    z.enum(["single", "married", "divorced", "widowed"]),
  ]),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
});

const uiPrivacySchema = z.object({
  postsVisibility: z.enum(["public", "friends", "private"]),
  mediaVisibility: z.enum(["public", "friends", "private"]),
  friendsVisibility: z.enum(["public", "friends", "private"]),
  profileVisibility: z.enum(["public", "friends", "private"]),
  groupsVisibility: z.enum(["public", "friends", "private"]),
});

/* =========================
   Experience/Education schemas
========================= */

const workSchema = z.object({
  company: z.string().min(1, "Company is required").max(150),
  positionTitle: z.string().max(150).optional(),
  startAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  endAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
});

const eduSchema = z.object({
  institutionName: z.string().min(1, "Institution is required").max(150),
  programName: z.string().max(150).optional(),
  degree: z.string().max(100).optional(),
  startAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  endAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
});

type UIWorkForm = z.infer<typeof workSchema>;
type UIEduForm = z.infer<typeof eduSchema>;

/* =========================
   Tabs
========================= */

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
  loading,
}: {
  value: TabKey;
  onChange: (v: TabKey) => void;
  className?: string;
  onItemClick?: () => void;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {tabs.map((t) => (
          <div
            key={t.key}
            className="rounded-xl px-3 py-2 border bg-background"
          >
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    );
  }

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
              "w-full text-left rounded-xl px-3 py-2 text-sm flex items-center gap-2 transition-colors",
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

/* =========================
   Component props
========================= */

interface EditProfileFormProps {
  /** id профиля на странице (обычно publicP.id) */
  profileUserId?: string;

  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  withTrigger?: boolean;
}

const EditProfileForm = ({
  profileUserId,
  trigger,
  open: openProp,
  onOpenChange,
  withTrigger = true,
}: EditProfileFormProps) => {
  const currentUser = sessionStore((s) => s.user);

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };

  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // если profileUserId не передали — попробуем взять id из sessionStore
  const targetUserId = profileUserId ?? currentUser?.id ?? "";
  const canLoad = open && !!targetUserId;

  // details для редактирования (dateOfBirth/bio/…), списки education/work
  const detailsQuery = useUserProfileDetails(
    targetUserId,
    canLoad && !!targetUserId,
  );

  const details: UserPrivateProfileDetails | undefined = detailsQuery.data;

  const ready =
    !!currentUser?.id && !!targetUserId && detailsQuery.isSuccess && !!details;

  /* =========================
     Forms
  ========================= */

  const infoForm = useForm<UIInfoForm>({
    resolver: zodResolver(uiInfoSchema),
    defaultValues: {
      username: "",
      location: "",
      bio: "",
      maritalStatus: "__none__",
      dateOfBirth: "2000-01-01",
    },
    mode: "onChange",
  });

  const privacyForm = useForm<UIPrivacyForm>({
    resolver: zodResolver(uiPrivacySchema),
    defaultValues: DEFAULT_PRIVACY,
    mode: "onChange",
  });

  // add/edit forms for work/education
  const workForm = useForm<UIWorkForm>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      company: "",
      positionTitle: "",
      startAt: "",
      endAt: "",
    },
  });

  const eduForm = useForm<UIEduForm>({
    resolver: zodResolver(eduSchema),
    defaultValues: {
      institutionName: "",
      programName: "",
      degree: "",
      startAt: "",
      endAt: "",
    },
  });

  const [addingWork, setAddingWork] = useState(false);
  const [addingEdu, setAddingEdu] = useState(false);

  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  // initial snapshots for diff (profile)
  const initialProfileRef = useRef<{
    username: string;
    location: string | null;
    bio: string | null;
    maritalStatus: MaritalStatus | null;
    dateOfBirth: string;
  } | null>(null);

  // privacy: у нас нет GET, поэтому используем дефолт как baseline
  const initialPrivacyRef = useRef<UserPrivacySettings | null>(null);

  // when data arrives and dialog open -> reset forms
  useEffect(() => {
    if (!open) return;
    if (!ready) return;

    const initProfile = {
      username: currentUser?.name ?? "",
      location: details.location ?? null,
      bio: details.bio ?? null,
      maritalStatus: details.maritalStatus ?? null,
      dateOfBirth: details.dateOfBirth ?? "2000-01-01",
    };

    initialProfileRef.current = initProfile;

    // privacy baseline — дефолт (пока нет эндпоинта GET)
    initialPrivacyRef.current = { ...DEFAULT_PRIVACY };
    privacyForm.reset({ ...DEFAULT_PRIVACY });

    infoForm.reset({
      username: initProfile.username,
      location: initProfile.location ?? "",
      bio: initProfile.bio ?? "",
      maritalStatus: initProfile.maritalStatus ?? "__none__",
      dateOfBirth: initProfile.dateOfBirth,
    });

    // reset add/edit subforms
    workForm.reset({ company: "", positionTitle: "", startAt: "", endAt: "" });
    eduForm.reset({
      institutionName: "",
      programName: "",
      degree: "",
      startAt: "",
      endAt: "",
    });

    setAddingWork(false);
    setAddingEdu(false);
    setEditingWorkId(null);
    setEditingEduId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ready, currentUser?.id, targetUserId, detailsQuery.dataUpdatedAt]);

  /* =========================
     Cache sync helper
  ========================= */

  const syncProfileCaches = async () => {
    if (!targetUserId) return;

    await Promise.all([
      qc.invalidateQueries({ queryKey: userKeys.profile(targetUserId) }),
      qc.invalidateQueries({ queryKey: userKeys.profileDetails(targetUserId) }),
      qc.invalidateQueries({ queryKey: userKeys.avatars(targetUserId) }),
      qc.invalidateQueries({ queryKey: userKeys.all }),
    ]);

    // держим sessionStore.user в актуальном состоянии (name/avatarUrl)
    authActions.refreshMe();
  };

  /* =========================
     Mutations
  ========================= */

  const patchSettingsMutation = useMutation({
    mutationFn: patchMyProfileSettings,
    onSuccess: async () => {
      await syncProfileCaches();
    },
  });

  const addWorkMutation = useMutation({
    mutationFn: (input: WorkExperienceUpsertInput) => addWorkExperience(input),
    onSuccess: async () => {
      await syncProfileCaches();
    },
  });

  const updateWorkMutation = useMutation({
    mutationFn: (vars: { id: string; input: WorkExperienceUpsertInput }) =>
      updateWorkExperience(vars.id, vars.input),
    onSuccess: async () => {
      await syncProfileCaches();
    },
  });

  const deleteWorkMutation = useMutation({
    mutationFn: (id: string) => deleteWorkExperience(id),
    onSuccess: async () => {
      await syncProfileCaches();
    },
  });

  const addEduMutation = useMutation({
    mutationFn: (input: EducationUpsertInput) => addEducation(input),
    onSuccess: async () => {
      await syncProfileCaches();
    },
  });

  const updateEduMutation = useMutation({
    mutationFn: (vars: { id: string; input: EducationUpsertInput }) =>
      updateEducation(vars.id, vars.input),
    onSuccess: async () => {
      await syncProfileCaches();
    },
  });

  const deleteEduMutation = useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onSuccess: async () => {
      await syncProfileCaches();
    },
  });

  const isBusy =
    patchSettingsMutation.isPending ||
    addWorkMutation.isPending ||
    updateWorkMutation.isPending ||
    deleteWorkMutation.isPending ||
    addEduMutation.isPending ||
    updateEduMutation.isPending ||
    deleteEduMutation.isPending;

  /* =========================
     Save handlers
  ========================= */

  const buildProfilePatch = (ui: UIInfoForm) => {
    const init = initialProfileRef.current;
    if (!init) return null;

    const next = {
      username: ui.username.trim(),
      location: normalizeNullableText(ui.location),
      bio: normalizeNullableText(ui.bio),
      maritalStatus:
        ui.maritalStatus === "__none__"
          ? (null as MaritalStatus | null)
          : ui.maritalStatus,
      dateOfBirth: ui.dateOfBirth,
    };

    const patch: Record<string, unknown> = {};
    if (next.username !== init.username) patch.username = next.username;
    if (next.location !== init.location) patch.location = next.location;
    if (next.bio !== init.bio) patch.bio = next.bio;
    if (next.maritalStatus !== init.maritalStatus)
      patch.maritalStatus = next.maritalStatus;
    if (next.dateOfBirth !== init.dateOfBirth)
      patch.dateOfBirth = next.dateOfBirth;

    return Object.keys(patch).length ? patch : null;
  };

  const buildPrivacyPatch = (ui: UIPrivacyForm) => {
    const init = initialPrivacyRef.current;
    if (!init) return null;

    const patch: Partial<UserPrivacySettings> = {};
    (Object.keys(DEFAULT_PRIVACY) as (keyof UserPrivacySettings)[]).forEach(
      (k) => {
        if (ui[k] !== init[k]) patch[k] = ui[k];
      },
    );

    return Object.keys(patch).length ? patch : null;
  };

  const onSave = async () => {
    if (!targetUserId) return;

    if (activeTab === "general") {
      await infoForm.handleSubmit(async (ui) => {
        const profilePatch = buildProfilePatch(ui);
        if (!profilePatch) {
          setOpen(false);
          return;
        }
        await patchSettingsMutation.mutateAsync({ profile: profilePatch });
        setOpen(false);
      })();
      return;
    }

    if (activeTab === "privacy") {
      await privacyForm.handleSubmit(async (ui) => {
        const privacyPatch = buildPrivacyPatch(ui);
        if (!privacyPatch) {
          setOpen(false);
          return;
        }
        await patchSettingsMutation.mutateAsync({ privacy: privacyPatch });
        setOpen(false);
      })();
      return;
    }

    // experience/education — отдельные Save в карточках
    setOpen(false);
  };

  const onCancel = () => setOpen(false);

  /* =========================
     Work/Education inline edit helpers
  ========================= */

  const startEditWork = (id: string) => {
    const item = details?.workExperiences?.find((w) => w.id === id);
    if (!item) return;
    setEditingWorkId(id);
    setAddingWork(false);
    workForm.reset({
      company: item.company ?? "",
      positionTitle: item.positionTitle ?? "",
      startAt: item.startAt ?? "",
      endAt: item.endAt ?? "",
    });
  };

  const startEditEdu = (id: string) => {
    const item = details?.educations?.find((e) => e.id === id);
    if (!item) return;
    setEditingEduId(id);
    setAddingEdu(false);
    eduForm.reset({
      institutionName: item.institutionName ?? "",
      programName: item.programName ?? "",
      degree: item.degree ?? "",
      startAt: item.startAt ?? "",
      endAt: item.endAt ?? "",
    });
  };

  /* =========================
     Render helpers (skeleton blocks)
  ========================= */

  const SkeletonLine = ({ w = "w-full" }: { w?: string }) => (
    <Skeleton className={cn("h-10 rounded-md", w)} />
  );

  /* =========================
     UI
  ========================= */

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setActiveTab("general");
          setAddingWork(false);
          setAddingEdu(false);
          setEditingWorkId(null);
          setEditingEduId(null);
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
          "w-[96vw] sm:w-[94vw] md:w-[96vw] lg:w-auto",
          "sm:max-w-none md:max-w-none lg:max-w-[1120px] xl:max-w-[1240px]",
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
                Update your profile and privacy settings.
              </p>
            </div>

            {/* Mobile nav */}
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
                      loading={!ready}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
          className="flex-1 overflow-hidden"
        >
          <div className="h-full grid md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_280px]">
            {/* Left */}
            <div className="h-full px-5 sm:px-6 py-5 overflow-y-auto">
              {/* ===== GENERAL ===== */}
              <TabsContent value="general" className="m-0 space-y-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-24 w-24 sm:h-28 sm:w-28">
                    {!currentUser?.id ? (
                      <Skeleton className="h-full w-full rounded-full" />
                    ) : (
                      <UserProfileAvatar
                        userId={currentUser.id}
                        avatarUrl={currentUser.avatarUrl}
                        name={currentUser.name}
                        isOwner
                        isOnline={currentUser.isOnline}
                      />
                    )}
                  </div>

                  <div className="w-full max-w-[520px]">
                    {!ready ? (
                      <SkeletonLine />
                    ) : (
                      <FormInput
                        name="username"
                        control={infoForm.control}
                        label="Name"
                        type="text"
                        autoComplete="off"
                      />
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    {!ready ? (
                      <SkeletonLine />
                    ) : (
                      <FormInput
                        name="location"
                        control={infoForm.control}
                        label="Location"
                        type="text"
                        placeholder="City, Country"
                        autoComplete="off"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Marital status</Label>
                    {!ready ? (
                      <SkeletonLine />
                    ) : (
                      <Select
                        value={infoForm.watch("maritalStatus")}
                        onValueChange={(v) =>
                          infoForm.setValue("maritalStatus", v as any, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Not set</SelectItem>
                          {MARITAL_OPTIONS.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Date of birth</Label>
                    {!ready ? (
                      <SkeletonLine />
                    ) : (
                      <input
                        type="date"
                        className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                        value={infoForm.watch("dateOfBirth") || ""}
                        onChange={(e) =>
                          infoForm.setValue("dateOfBirth", e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  {!ready ? (
                    <Skeleton className="h-[120px] w-full rounded-md" />
                  ) : (
                    <Textarea
                      value={infoForm.watch("bio") || ""}
                      onChange={(e) =>
                        infoForm.setValue("bio", e.target.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      placeholder="Tell something about yourself…"
                      className="min-h-[120px] resize-none"
                    />
                  )}
                </div>

                <Separator />

                {/* password stub */}
                <div className="space-y-3 opacity-70">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Change password</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password API is not wired yet.
                  </p>
                </div>
              </TabsContent>

              {/* ===== PRIVACY ===== */}
              <TabsContent value="privacy" className="m-0 space-y-6">
                <div>
                  <h3 className="text-base font-semibold">Privacy settings</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Control who can see your profile data.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: current privacy values are not fetched yet (no GET
                    endpoint). Saving will apply the selected values.
                  </p>
                </div>

                {!ready ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine />
                    <SkeletonLine w="sm:col-span-2" />
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {(
                      [
                        ["profileVisibility", "Profile visibility"],
                        ["postsVisibility", "Posts visibility"],
                        ["mediaVisibility", "Media visibility"],
                        ["friendsVisibility", "Friends visibility"],
                        ["groupsVisibility", "Groups visibility"],
                      ] as const
                    ).map(([key, label]) => (
                      <div
                        key={key}
                        className={cn(
                          "space-y-2",
                          key === "groupsVisibility" ? "sm:col-span-2" : "",
                        )}
                      >
                        <Label>{label}</Label>
                        <Select
                          value={privacyForm.watch(key)}
                          onValueChange={(v) =>
                            privacyForm.setValue(key, v as ProfileVisibility, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            {VISIBILITY_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ===== EXPERIENCE ===== */}
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
                    onClick={() => {
                      setAddingWork(true);
                      setEditingWorkId(null);
                      workForm.reset({
                        company: "",
                        positionTitle: "",
                        startAt: "",
                        endAt: "",
                      });
                    }}
                    className="gap-2"
                    disabled={!ready}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {detailsQuery.isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : null}

                {ready && (addingWork || editingWorkId) ? (
                  <Card className="p-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormInput
                        name="company"
                        control={workForm.control}
                        label="Company"
                        type="text"
                        autoComplete="off"
                      />
                      <FormInput
                        name="positionTitle"
                        control={workForm.control}
                        label="Position title"
                        type="text"
                        autoComplete="off"
                      />
                      <div className="space-y-2">
                        <Label>Start date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          value={workForm.watch("startAt") || ""}
                          onChange={(e) =>
                            workForm.setValue("startAt", e.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          value={workForm.watch("endAt") || ""}
                          onChange={(e) =>
                            workForm.setValue("endAt", e.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setAddingWork(false);
                          setEditingWorkId(null);
                        }}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>

                      <Button
                        onClick={workForm.handleSubmit(async (ui) => {
                          const input: WorkExperienceUpsertInput = {
                            company: ui.company.trim(),
                            positionTitle:
                              normalizeNullableText(ui.positionTitle ?? "") ??
                              null,
                            startAt: ui.startAt,
                            endAt: ui.endAt ? ui.endAt : null,
                          };

                          if (editingWorkId) {
                            await updateWorkMutation.mutateAsync({
                              id: editingWorkId,
                              input,
                            });
                          } else {
                            await addWorkMutation.mutateAsync(input);
                          }

                          setAddingWork(false);
                          setEditingWorkId(null);
                          workForm.reset({
                            company: "",
                            positionTitle: "",
                            startAt: "",
                            endAt: "",
                          });
                        })}
                        className="gap-2"
                        disabled={isBusy}
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </Card>
                ) : null}

                {details?.workExperiences?.length ? (
                  <div className="space-y-3">
                    {details.workExperiences.map((w) => (
                      <Card key={w.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {w.company}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {w.positionTitle ?? "—"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {w.startAt} — {w.endAt ?? "present"}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => startEditWork(w.id)}
                              disabled={!ready}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9 text-destructive"
                              onClick={async () => {
                                await deleteWorkMutation.mutateAsync(w.id);
                                if (editingWorkId === w.id)
                                  setEditingWorkId(null);
                              }}
                              disabled={!ready || isBusy}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : detailsQuery.isSuccess ? (
                  <div className="text-sm text-muted-foreground">
                    No work experience yet.
                  </div>
                ) : null}
              </TabsContent>

              {/* ===== EDUCATION ===== */}
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
                    onClick={() => {
                      setAddingEdu(true);
                      setEditingEduId(null);
                      eduForm.reset({
                        institutionName: "",
                        programName: "",
                        degree: "",
                        startAt: "",
                        endAt: "",
                      });
                    }}
                    className="gap-2"
                    disabled={!ready}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                {detailsQuery.isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                ) : null}

                {ready && (addingEdu || editingEduId) ? (
                  <Card className="p-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <FormInput
                          name="institutionName"
                          control={eduForm.control}
                          label="Institution"
                          type="text"
                          autoComplete="off"
                        />
                      </div>

                      <FormInput
                        name="programName"
                        control={eduForm.control}
                        label="Program name"
                        type="text"
                        autoComplete="off"
                      />

                      <FormInput
                        name="degree"
                        control={eduForm.control}
                        label="Degree"
                        type="text"
                        autoComplete="off"
                      />

                      <div className="space-y-2">
                        <Label>Start date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          value={eduForm.watch("startAt") || ""}
                          onChange={(e) =>
                            eduForm.setValue("startAt", e.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End date</Label>
                        <input
                          type="date"
                          className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                          value={eduForm.watch("endAt") || ""}
                          onChange={(e) =>
                            eduForm.setValue("endAt", e.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setAddingEdu(false);
                          setEditingEduId(null);
                        }}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>

                      <Button
                        onClick={eduForm.handleSubmit(async (ui) => {
                          const input: EducationUpsertInput = {
                            institutionName: ui.institutionName.trim(),
                            programName:
                              normalizeNullableText(ui.programName ?? "") ??
                              null,
                            degree:
                              normalizeNullableText(ui.degree ?? "") ?? null,
                            startAt: ui.startAt,
                            endAt: ui.endAt ? ui.endAt : null,
                          };

                          if (editingEduId) {
                            await updateEduMutation.mutateAsync({
                              id: editingEduId,
                              input,
                            });
                          } else {
                            await addEduMutation.mutateAsync(input);
                          }

                          setAddingEdu(false);
                          setEditingEduId(null);
                          eduForm.reset({
                            institutionName: "",
                            programName: "",
                            degree: "",
                            startAt: "",
                            endAt: "",
                          });
                        })}
                        className="gap-2"
                        disabled={isBusy}
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </Card>
                ) : null}

                {details?.educations?.length ? (
                  <div className="space-y-3">
                    {details.educations.map((e) => (
                      <Card key={e.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">
                              {e.institutionName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {e.programName ?? "—"}
                              {e.degree ? ` • ${e.degree}` : ""}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {e.startAt} — {e.endAt ?? "present"}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => startEditEdu(e.id)}
                              disabled={!ready}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-9 w-9 text-destructive"
                              onClick={async () => {
                                await deleteEduMutation.mutateAsync(e.id);
                                if (editingEduId === e.id)
                                  setEditingEduId(null);
                              }}
                              disabled={!ready || isBusy}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : detailsQuery.isSuccess ? (
                  <div className="text-sm text-muted-foreground">
                    No education yet.
                  </div>
                ) : null}
              </TabsContent>
            </div>

            {/* Right (desktop) */}
            <div className="hidden md:block h-full border-l bg-muted/20 px-3 lg:px-4 py-5">
              <div className="sticky top-0">
                <TabNav
                  value={activeTab}
                  onChange={setActiveTab}
                  loading={!ready}
                />

                <Separator className="my-5" />

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Notes</p>
                  <p>
                    Editor loads details from{" "}
                    <code>/users/:id/profile/details</code>. Profile updates use{" "}
                    <code>/me/*</code> endpoints and then invalidate caches for
                    the viewed userId.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Tabs>

        <Separator />

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
            Cancel
          </Button>

          <Button onClick={onSave} disabled={isBusy || !ready}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm;
