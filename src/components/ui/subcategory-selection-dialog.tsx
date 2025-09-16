"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Code, Palette, Eye } from "lucide-react";
import { subcategories, subcategoriesData, type SubcategoryData } from "@/data/subcategories";

interface SubcategorySelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryKey: string;
  categoryLabel: string;
  onSelect: (subcategory: string, data?: SubcategoryData) => void;
}

export function SubcategorySelectionDialog({
  open,
  onOpenChange,
  categoryKey,
  categoryLabel,
  onSelect
}: SubcategorySelectionDialogProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const availableSubcategories = subcategories[categoryKey as keyof typeof subcategories] || [];

  const filteredSubcategories = availableSubcategories.filter(subcategory =>
    subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedSubcategory) {
      const subcategoryKey = selectedSubcategory.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const subcategoryData = subcategoriesData[categoryKey]?.[subcategoryKey];
      onSelect(selectedSubcategory, subcategoryData);
      onOpenChange(false);
    }
  };

  const getSubcategoryData = (subcategory: string): SubcategoryData | null => {
    const subcategoryKey = subcategory.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    return subcategoriesData[categoryKey]?.[subcategoryKey] || null;
  };

  const SubcategoryCard = ({ subcategory }: { subcategory: string }) => {
    const isSelected = selectedSubcategory === subcategory;
    const data = getSubcategoryData(subcategory);

    return (
      <div
        className={`
          relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
          ${isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}
        `}
        onClick={() => setSelectedSubcategory(subcategory)}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold capitalize">{subcategory}</h3>
            {data && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(data.live_link, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          {data && (
            <>
              {/* Tech Stack */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Code className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Tech Stack:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.tech_stack.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {data.tech_stack.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{data.tech_stack.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Pages */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Palette className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Pages:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.pages.slice(0, 4).map((page) => (
                    <Badge key={page} variant="outline" className="text-xs">
                      {page}
                    </Badge>
                  ))}
                  {data.pages.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.pages.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Live Preview Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(data.live_link, '_blank');
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Live Preview
              </Button>
            </>
          )}

          {!data && (
            <div className="text-sm text-muted-foreground">
              Custom implementation - no preview available
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-3xl md:max-w-5xl lg:max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your {categoryLabel} Type</DialogTitle>
          <DialogDescription>
            Select the specific type of {categoryLabel.toLowerCase()} you want to build.
            Click "Live Preview" to see examples in action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${categoryLabel.toLowerCase()} types...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubcategories.map((subcategory) => (
              <SubcategoryCard key={subcategory} subcategory={subcategory} />
            ))}
          </div>

          {filteredSubcategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No {categoryLabel.toLowerCase()} types found matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Back
          </Button>
          <Button onClick={handleSelect} disabled={!selectedSubcategory}>
            Continue with {selectedSubcategory}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}