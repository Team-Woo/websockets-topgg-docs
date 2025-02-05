"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";

// create a new component that will be used to select the version
export default function SelectVersion({
  platform,
  versions,
  version,
}: {
  platform: string;
  versions: string[];
  version?: string;
}) {
  const router = useRouter();

  const handlePlatformChange = (newVersion: string) => {
    router.push(`/${platform}/${newVersion}`);
  };
  return (
    <Select
      defaultValue={version || versions[0]}
      onValueChange={handlePlatformChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Version" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {versions.map((version) => (
            <SelectItem key={version} value={version}>
              {version}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
