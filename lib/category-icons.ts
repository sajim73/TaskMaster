import {
  Briefcase,
  Home,
  Heart,
  BookOpen,
  ShoppingCart,
  Dumbbell,
  Plane,
  Music,
  Code,
  Palette,
  Camera,
  Coffee,
  Utensils,
  Car,
  Folder,
  Lightbulb,
  Target,
  Calendar,
  Users,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  work: Briefcase,
  home: Home,
  personal: Home,
  heart: Heart,
  health: Heart,
  book: BookOpen,
  study: BookOpen,
  shopping: ShoppingCart,
  dumbbell: Dumbbell,
  fitness: Dumbbell,
  plane: Plane,
  travel: Plane,
  music: Music,
  code: Code,
  palette: Palette,
  camera: Camera,
  coffee: Coffee,
  utensils: Utensils,
  food: Utensils,
  car: Car,
  folder: Folder,
  others: Folder,
  lightbulb: Lightbulb,
  target: Target,
  calendar: Calendar,
  users: Users,
  dollar: DollarSign,
  finance: DollarSign,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return categoryIcons[iconName.toLowerCase()] || Folder;
}

export const availableIcons = [
  { name: "briefcase", label: "Work", icon: Briefcase },
  { name: "home", label: "Personal", icon: Home },
  { name: "heart", label: "Health", icon: Heart },
  { name: "book", label: "Study", icon: BookOpen },
  { name: "shopping", label: "Shopping", icon: ShoppingCart },
  { name: "dumbbell", label: "Fitness", icon: Dumbbell },
  { name: "plane", label: "Travel", icon: Plane },
  { name: "music", label: "Music", icon: Music },
  { name: "code", label: "Code", icon: Code },
  { name: "palette", label: "Art", icon: Palette },
  { name: "camera", label: "Photography", icon: Camera },
  { name: "coffee", label: "Coffee", icon: Coffee },
  { name: "utensils", label: "Food", icon: Utensils },
  { name: "car", label: "Transport", icon: Car },
  { name: "folder", label: "Others", icon: Folder },
  { name: "lightbulb", label: "Ideas", icon: Lightbulb },
  { name: "target", label: "Goals", icon: Target },
  { name: "calendar", label: "Events", icon: Calendar },
  { name: "users", label: "Social", icon: Users },
  { name: "dollar", label: "Finance", icon: DollarSign },
];

export const predefinedCategories = [
  { 
    name: "Work", 
    icon: "briefcase", 
    color: "#3b82f6",
    description: "Tasks related to your job or professional life."
  },
  { 
    name: "Personal", 
    icon: "home", 
    color: "#8b5cf6",
    description: "Tasks for personal errands, hobbies, or self-care."
  },
  { 
    name: "Health", 
    icon: "heart", 
    color: "#ef4444",
    description: "Tasks related to health, fitness, and well-being."
  },
  { 
    name: "Study", 
    icon: "book", 
    color: "#10b981",
    description: "Tasks for academic work, learning, or skill development."
  },
  { 
    name: "Others", 
    icon: "folder", 
    color: "#6b7280",
    description: "Miscellaneous tasks that don't fit into other categories."
  },
];

