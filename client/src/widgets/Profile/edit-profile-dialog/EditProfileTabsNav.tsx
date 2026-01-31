import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export type TabKey =
  | "general"
  | "privacy"
  | "security"
  | "education"
  | "workExperience";

const LABEL: Record<TabKey, string> = {
  general: "General",
  privacy: "Privacy",
  security: "Security",
  education: "Education",
  workExperience: "Work experience",
};

const TABS: TabKey[] = [
  "general",
  "privacy",
  "security",
  "education",
  "workExperience",
];

export function TabsDesktop(props: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
}) {
  return (
    <aside className="h-full border-l pl-4">
      <div className="text-sm font-medium mb-2">Sections</div>
      <div className="flex flex-col gap-2">
        {TABS.map((k) => (
          <Button
            key={k}
            variant={props.tab === k ? "secondary" : "ghost"}
            className="justify-start w-full"
            onClick={() => props.setTab(k)}
          >
            {LABEL[k]}
          </Button>
        ))}
      </div>
    </aside>
  );
}

export function TabsMobilePicker(props: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
}) {
  return (
    <Select value={props.tab} onValueChange={(v) => props.setTab(v as TabKey)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Section" />
      </SelectTrigger>
      <SelectContent>
        {TABS.map((k) => (
          <SelectItem key={k} value={k}>
            {LABEL[k]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
