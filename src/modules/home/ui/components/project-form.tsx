"use client";

import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Loader2Icon, Sparkles } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";
import { useClerk } from "@clerk/nextjs";
import { CategorySelectionDialog, type Category } from "@/components/ui/category-selection-dialog";
import { SubcategorySelectionDialog } from "@/components/ui/subcategory-selection-dialog";
import { ThemeSelectionDialog } from "@/components/ui/theme-selection-dialog";
import { type SubcategoryData } from "@/data/subcategories";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();
  const queryClient = useQueryClient();

  // Multi-step state
  const [step, setStep] = useState<'prompt' | 'category' | 'subcategory' | 'theme'>('prompt');
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSubcategoryDialog, setShowSubcategoryDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [subcategoryData, setSubcategoryData] = useState<SubcategoryData | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<{ key: string; name: string } | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  // Enhanced prompt mutation
  const enhancePrompt = useMutation({
    mutationFn: async (prompt: string) => {
      // This would call your enhanced prompt API
      return {
        enhancedPrompt: `Enhanced: ${prompt}`,
        suggestedCategory: 'saas' // This would come from AI analysis
      };
    },
    onSuccess: (data) => {
      setEnhancedPrompt(data.enhancedPrompt);
      setShowCategoryDialog(true);
    },
    onError: (error) => {
      toast.error("Failed to enhance prompt");
    }
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`projects/${data.id}`);
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }

        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Step 1: Enhance the prompt
    await enhancePrompt.mutateAsync(values.value);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryDialog(false);
    setShowSubcategoryDialog(true);
  };

  const handleSubcategorySelect = (subcategory: string, data?: SubcategoryData) => {
    setSelectedSubcategory(subcategory);
    setSubcategoryData(data || null);
    setShowSubcategoryDialog(false);
    setShowThemeDialog(true);
  };

  const handleThemeSelect = (themeKey: string, themeName: string) => {
    setSelectedTheme({ key: themeKey, name: themeName });
    setShowThemeDialog(false);

    // Now create the project with all the enhanced data
    const finalPrompt = `
      ${enhancedPrompt}
      
      Category: ${selectedCategory?.label}
      Subcategory: ${selectedSubcategory}
      GitHub Template URL: ${subcategoryData?.github_link || selectedCategory?.template || 'fallback'}
      Theme: ${themeName}
      Theme Key: ${themeKey}
      
      ${subcategoryData ? `
      Reference Data:
      - Live Example: ${subcategoryData.live_link}
      - GitHub Repository: ${subcategoryData.github_link}
      - Tech Stack: ${subcategoryData.tech_stack.join(', ')}
      - Pages: ${subcategoryData.pages.join(', ')}
      - Sample Data: ${JSON.stringify(subcategoryData.data, null, 2)}
      ` : ''}
      
      Please use the cloneTemplate tool with the GitHub Template URL provided above, then apply the selected theme using applyTheme tool. Use the reference data as a guide for structure and content.
    `;

    createProject.mutate({
      value: finalPrompt,
    });
  };

  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const [isFocused, setIsFocused] = useState(false);
  const isPending = createProject.isPending || enhancePrompt.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && "shadow-xs"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                disabled={isPending}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                placeholder="Describe your project in detail... (e.g., 'A modern e-commerce store for selling handmade jewelry with user accounts and payment processing')"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
              &nbsp; to submit
            </div>
            <Button
              className={cn(
                "size-8 rounded-full",
                isButtonDisabled && "bg-muted-foreground border"
              )}
              disabled={isButtonDisabled}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Progress indicator */}
        {(selectedCategory || selectedSubcategory || selectedTheme) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            {selectedCategory && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                📁 {selectedCategory.label}
              </span>
            )}
            {selectedSubcategory && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                🏷️ {selectedSubcategory}
              </span>
            )}
            {selectedTheme && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                🎨 {selectedTheme.name}
              </span>
            )}
          </div>
        )}

        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant={"outline"}
              size="sm"
              className="bg-white dark:bg-sidebar"
              onClick={() => form.setValue("value", template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </section>

      {/* Category Selection Dialog */}
      <CategorySelectionDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        onSelect={handleCategorySelect}
        suggestedCategory="saas" // This would come from AI analysis
      />

      {/* Subcategory Selection Dialog */}
      {selectedCategory && (
        <SubcategorySelectionDialog
          open={showSubcategoryDialog}
          onOpenChange={setShowSubcategoryDialog}
          categoryKey={selectedCategory.key}
          categoryLabel={selectedCategory.label}
          onSelect={handleSubcategorySelect}
        />
      )}

      {/* Theme Selection Dialog */}
      <ThemeSelectionDialog
        open={showThemeDialog}
        onOpenChange={setShowThemeDialog}
        onSelect={handleThemeSelect}
      />
    </Form>
  );
};
