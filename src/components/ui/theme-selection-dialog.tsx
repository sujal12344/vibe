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
import { Search, Palette, Check } from "lucide-react";
import { defaultPresets } from "@/utils/theme-presets";

interface ThemeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (themeKey: string, themeName: string) => void;
}

export function ThemeSelectionDialog({
  open,
  onOpenChange,
  onSelect
}: ThemeSelectionDialogProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThemes = Object.entries(defaultPresets).filter(([key, theme]) =>
    theme.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedTheme) {
      const themeName = defaultPresets[selectedTheme].label;
      onSelect(selectedTheme, themeName);
      onOpenChange(false);
    }
  };

  const ThemePreview = ({ themeKey, theme }: { themeKey: string; theme: any }) => {
    const lightColors = theme.styles.light;
    const isSelected = selectedTheme === themeKey;

    return (
      <div
        className={`
          relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
          ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}
        `}
        onClick={() => setSelectedTheme(themeKey)}
      >
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <h3 className="font-semibold">{theme.label}</h3>
            {theme.createdAt && (
              <Badge variant="secondary" className="text-xs">
                {new Date(theme.createdAt).getFullYear()}
              </Badge>
            )}
          </div>

          {/* Color Preview */}
          <div className="grid grid-cols-6 gap-1 h-8">
            <div
              className="rounded-sm border"
              style={{ backgroundColor: lightColors.background }}
              title="Background"
            />
            <div
              className="rounded-sm border"
              style={{ backgroundColor: lightColors.primary }}
              title="Primary"
            />
            <div
              className="rounded-sm border"
              style={{ backgroundColor: lightColors.secondary }}
              title="Secondary"
            />
            <div
              className="rounded-sm border"
              style={{ backgroundColor: lightColors.accent }}
              title="Accent"
            />
            <div
              className="rounded-sm border"
              style={{ backgroundColor: lightColors.muted }}
              title="Muted"
            />
            <div
              className="rounded-sm border"
              style={{ backgroundColor: lightColors.border }}
              title="Border"
            />
          </div>

          {/* Font Preview */}
          {lightColors['font-sans'] && (
            <p className="text-xs text-muted-foreground">
              Font: {lightColors['font-sans'].split(',')[0]}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-3xl md:max-w-5xl lg:max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Theme</DialogTitle>
          <DialogDescription>
            Select a theme for your project. You can customize it further using TweakCN later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map(([themeKey, theme]) => (
              <ThemePreview key={themeKey} themeKey={themeKey} theme={theme} />
            ))}
          </div>

          {filteredThemes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No themes found matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" asChild>
            <a href="https://tweakcn.com" target="_blank" rel="noopener noreferrer">
              Customize on TweakCN
            </a>
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedTheme}>
              Apply Theme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}