import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

import {
  useUserProfile,
  useUserProfileDetails,
  useMyPrivacySettings,
} from "@/entities/user/model/useUserQueries";
import { usePatchMyProfileSettingsMutation } from "@/entities/user/model/useUserMutations";
import {
  TabsDesktop,
  TabsMobilePicker,
  type TabKey,
} from "./EditProfileTabsNav";
import {
  editProfileSchema,
  type EditProfileForm,
} from "@/features/user/edit-profile-dialog/model/schema";
import { GeneralTab } from "@/features/user/edit-profile-dialog/ui/tabs/GeneralTab";
import { PrivacyTab } from "@/features/user/edit-profile-dialog/ui/tabs/PrivacyTab";
import { SecurityTab } from "@/features/user/edit-profile-dialog/ui/tabs/SecurityTab";
import { EducationTab } from "@/features/user/edit-profile-dialog/ui/tabs/EducationTab";
import { WorkExperienceTab } from "@/features/user/edit-profile-dialog/ui/tabs/WorkExperienceTab";
import { patchFromDirty } from "@/features/user/edit-profile-dialog/lib/patchFromDirty";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export function EditProfileDialog(props: {
  myUserId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [tab, setTab] = useState<TabKey>("general");
  const hydratedRef = useRef(false);

  const profileQ = useUserProfile({
    userId: props.myUserId,
    enabled: props.open,
  });
  const detailsQ = useUserProfileDetails({
    userId: props.myUserId,
    enabled: props.open,
  });
  const privacyQ = useMyPrivacySettings({ enabled: props.open });

  const patchMut = usePatchMyProfileSettingsMutation({
    myUserId: props.myUserId,
  });

  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      profile: {
        username: "",
        location: "",
        maritalStatus: "",
        bio: "",
        dateOfBirth: "",
      },
      privacy: {
        postsVisibility: "public",
        mediaVisibility: "public",
        friendsVisibility: "public",
        profileVisibility: "public",
        groupsVisibility: "public",
      },
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!props.open) return;
    if (hydratedRef.current) return;

    if (!profileQ.data || !detailsQ.data || !privacyQ.data) return;

    form.reset(
      {
        profile: {
          username: profileQ.data.public.name ?? "",
          location: detailsQ.data.location ?? "",
          maritalStatus: detailsQ.data.maritalStatus ?? "",
          bio: detailsQ.data.bio ?? "",
          dateOfBirth: detailsQ.data.dateOfBirth ?? "",
        },
        privacy: privacyQ.data,
      },
      { keepDirty: false },
    );

    hydratedRef.current = true;
  }, [props.open, profileQ.data, detailsQ.data, privacyQ.data, form]);

  const loading =
    props.open &&
    (profileQ.isLoading || detailsQ.isLoading || privacyQ.isLoading);
  const loadFail =
    props.open &&
    !loading &&
    (!profileQ.data || !detailsQ.data || !privacyQ.data);

  const left = useMemo(() => {
    if (!props.open) return null;
    if (loading)
      return <div className="text-sm text-muted-foreground">Loading…</div>;
    if (loadFail)
      return <div className="text-sm text-destructive">Failed to load.</div>;

    switch (tab) {
      case "general":
        return (
          <GeneralTab
            avatarUrl={profileQ.data!.public.avatarUrl}
            displayName={profileQ.data!.public.name}
          />
        );
      case "privacy":
        return <PrivacyTab />;
      case "security":
        return <SecurityTab />;
      case "education":
        return (
          <EducationTab
            myUserId={props.myUserId}
            items={detailsQ.data!.educations}
          />
        );
      case "workExperience":
        return (
          <WorkExperienceTab
            myUserId={props.myUserId}
            items={detailsQ.data!.workExperiences}
          />
        );
    }
  }, [
    props.open,
    loading,
    loadFail,
    tab,
    profileQ.data,
    detailsQ.data,
    props.myUserId,
  ]);

  async function onBottomSave() {
    const values = form.getValues();
    const payload = patchFromDirty(values, form.formState.dirtyFields);

    if (!payload) {
      props.onOpenChange(false);
      return;
    }

    await patchMut.mutateAsync(payload);

    props.onOpenChange(false);
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(v) => {
        props.onOpenChange(v);

        if (v) {
          hydratedRef.current = false;
          setTab("general");
          return;
        }

        form.reset();
        setTab("general");
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="min-w-[90vw] min-h-[90vh] p-0"
      >
        <FormProvider {...form}>
          <div className="h-full flex flex-col py-2">
            <DialogHeader className="px-6 py-2">
              <div className="flex items-center justify-between gap-3">
                <DialogTitle>Edit profile</DialogTitle>

                {/* mobile: tabs picker */}
                <div className="md:hidden">
                  <TabsMobilePicker tab={tab} setTab={setTab} />
                </div>
              </div>
            </DialogHeader>

            <Separator />

            <div className="flex-1 min-h-0 px-6 py-4 overflow-hidden">
              <div className=" min-h-0 grid grid-cols-1 md:grid-cols-[1fr_280px] md:gap-6">
                <ScrollArea className="h-full min-h-0 overflow-hidden">
                  {left}
                </ScrollArea>

                <div className="hidden md:block">
                  <TabsDesktop tab={tab} setTab={setTab} />
                </div>
              </div>
            </div>

            <Separator />

            <div className="px-6 pt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => props.onOpenChange(false)}
                disabled={patchMut.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={onBottomSave}
                disabled={!form.formState.isDirty || patchMut.isPending}
              >
                Save
              </Button>
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
