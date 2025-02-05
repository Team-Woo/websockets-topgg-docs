"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";

// create a new component that will be used to select the platform
export default function SelectPlatform({ platform }: { platform?: string }) {
  const router = useRouter();

  const handlePlatformChange = (newPlatform: string) => {
    router.push(`/${newPlatform}`);
  };

  return (
    <Select
      defaultValue={platform?.toLocaleLowerCase()}
      onValueChange={handlePlatformChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Platform" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Libraries</SelectLabel>
          <SelectItem value="javascript">Javascript</SelectItem>
          <SelectItem value="python">Python</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Advanced</SelectLabel>
          <SelectItem value="websocket">Websocket</SelectItem>
          <SelectItem value="api">API</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
