"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const {data: message} = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: ({ content }) => {
        toast.success(content);
        // setValue("");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-blue-950">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button
          disabled={createMessage.isPending}
          onClick={() => createMessage.mutate({ value: value })}
        >
          Submit
        </Button>
        <div className="flex flex-col gap-y-2">
          {message?.map((message) => (
            <div key={message.id}>{message.content}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
