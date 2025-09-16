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
import {
  ShoppingCart,
  FileText,
  User,
  Zap,
  Rocket,
  BarChart3,
  BookOpen,
  Code,
  Users,
  GraduationCap,
  Heart,
  DollarSign,
  Gamepad2,
  CheckSquare,
  MapPin,
  MoreHorizontal
} from "lucide-react";
import { subcategories } from "@/data/subcategories";

export interface Category {
  key: string;
  label: string;
  description: string;
  template: string | null;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  subcategoryCount?: number;
}

const categories: Category[] = [
  {
    key: 'portfolio',
    label: 'Portfolio',
    description: 'Showcase your work and skills',
    template: 'portfolio-starter',
    icon: User,
    features: ['Project showcase', 'About section', 'Contact form', 'Resume'],
    subcategoryCount: subcategories.portfolio?.length || 0
  },
  {
    key: 'blog',
    label: 'Blog/Magazine',
    description: 'Content-focused site with articles and posts',
    template: 'blog-starter',
    icon: FileText,
    features: ['Article management', 'Categories', 'Search', 'Comments'],
    subcategoryCount: subcategories.blog?.length || 0
  },
  {
    key: 'ecommerce',
    label: 'E-commerce Store',
    description: 'Online store with products, cart, and checkout',
    template: 'https://github.com/kirill-zhirnov/nextjs-ecommerce-starter-kit.git',
    icon: ShoppingCart,
    features: ['Product catalog', 'Shopping cart', 'Payment integration', 'User accounts'],
    subcategoryCount: subcategories.ecommerce?.length || 0
  },
  {
    key: 'social',
    label: 'Social Platform',
    description: 'Connect people and build communities',
    template: 'social-starter',
    icon: Users,
    features: ['User profiles', 'Social feeds', 'Messaging', 'Communities'],
    subcategoryCount: subcategories.social?.length || 0
  },
  {
    key: 'saas_tools',
    label: 'SaaS Tools',
    description: 'Software as a Service applications',
    template: 'saas-starter',
    icon: Zap,
    features: ['User dashboard', 'Subscription billing', 'API integration', 'Analytics'],
    subcategoryCount: subcategories.saas_tools?.length || 0
  },
  {
    key: 'education',
    label: 'Education Platform',
    description: 'Learning and educational applications',
    template: 'education-starter',
    icon: GraduationCap,
    features: ['Course management', 'Student tracking', 'Assessments', 'Progress reports'],
    subcategoryCount: subcategories.education?.length || 0
  },
  {
    key: 'health_fitness',
    label: 'Health & Fitness',
    description: 'Wellness and fitness applications',
    template: 'health-starter',
    icon: Heart,
    features: ['Activity tracking', 'Health metrics', 'Goal setting', 'Progress monitoring'],
    subcategoryCount: subcategories.health_fitness?.length || 0
  },
  {
    key: 'finance',
    label: 'Finance & Banking',
    description: 'Financial management applications',
    template: 'finance-starter',
    icon: DollarSign,
    features: ['Transaction tracking', 'Budget planning', 'Investment tools', 'Reports'],
    subcategoryCount: subcategories.finance?.length || 0
  },
  {
    key: 'entertainment',
    label: 'Entertainment',
    description: 'Media and entertainment platforms',
    template: 'entertainment-starter',
    icon: Gamepad2,
    features: ['Content streaming', 'User ratings', 'Recommendations', 'Social features'],
    subcategoryCount: subcategories.entertainment?.length || 0
  },
  {
    key: 'productivity',
    label: 'Productivity Tools',
    description: 'Tools to enhance productivity and workflow',
    template: 'productivity-starter',
    icon: CheckSquare,
    features: ['Task management', 'Time tracking', 'Collaboration', 'Automation'],
    subcategoryCount: subcategories.productivity?.length || 0
  },
  {
    key: 'travel',
    label: 'Travel & Tourism',
    description: 'Travel planning and booking platforms',
    template: 'travel-starter',
    icon: MapPin,
    features: ['Trip planning', 'Booking system', 'Reviews', 'Location services'],
    subcategoryCount: subcategories.travel?.length || 0
  },
  {
    key: 'others',
    label: 'Other Applications',
    description: 'Miscellaneous and specialized applications',
    template: null,
    icon: MoreHorizontal,
    features: ['Custom functionality', 'Tailored design', 'Specific requirements', 'Unique features'],
    subcategoryCount: subcategories.others?.length || 0
  }
];

interface CategorySelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: Category) => void;
  suggestedCategory?: string;
}

export function CategorySelectionDialog({
  open,
  onOpenChange,
  onSelect,
  suggestedCategory
}: CategorySelectionDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleSelect = () => {
    if (selectedCategory) {
      onSelect(selectedCategory);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-3xl md:max-w-5xl lg:max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Project Category</DialogTitle>
          <DialogDescription>
            Select the type of website or application you want to build. This helps us provide the best starting template and features.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isRecommended = category.key === suggestedCategory;
            const isSelected = selectedCategory?.key === category.key;

            return (
              <div
                key={category.key}
                className={`
                  relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
                  ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                `}
                onClick={() => setSelectedCategory(category)}
              >
                {isRecommended && (
                  <Badge className="absolute -top-2 -right-2 bg-primary">
                    Recommended
                  </Badge>
                )}

                <div className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{category.label}</h3>
                      {category.subcategoryCount && (
                        <Badge variant="secondary" className="text-xs">
                          {category.subcategoryCount} types
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Key Features:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedCategory}>
            Continue with {selectedCategory?.label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}