"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [value, setValue] = useState("");
  const router = useRouter();

  const trpc = useTRPC();
  const createdProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => toast.error(error.message),
    })
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-blue-950">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={createdProject.isPending}
          onClick={() => createdProject.mutate({ value: value })}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Page;
