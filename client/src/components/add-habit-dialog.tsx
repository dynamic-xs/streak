import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { 
  Droplets, 
  Book, 
  Dumbbell, 
  Moon, 
  Heart, 
  Sun,
  Coffee,
  Music,
  Camera,
  Utensils
} from "lucide-react";

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconOptions = [
  { icon: Droplets, value: "fas fa-tint", color: "blue", label: "Water" },
  { icon: Book, value: "fas fa-book", color: "green", label: "Reading" },
  { icon: Dumbbell, value: "fas fa-dumbbell", color: "orange", label: "Exercise" },
  { icon: Moon, value: "fas fa-moon", color: "purple", label: "Sleep" },
  { icon: Heart, value: "fas fa-heart", color: "red", label: "Health" },
  { icon: Sun, value: "fas fa-sun", color: "yellow", label: "Morning" },
  { icon: Coffee, value: "fas fa-coffee", color: "amber", label: "Coffee" },
  { icon: Music, value: "fas fa-music", color: "pink", label: "Music" },
  { icon: Camera, value: "fas fa-camera", color: "indigo", label: "Photo" },
  { icon: Utensils, value: "fas fa-utensils", color: "emerald", label: "Food" },
];

export default function AddHabitDialog({ open, onOpenChange }: AddHabitDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; icon: string; color: string }) => {
      return apiRequest("POST", "/api/habits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Success!",
        description: "Your new habit has been added",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      icon: selectedIcon.value,
      color: selectedIcon.color,
    });
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setSelectedIcon(iconOptions[0]);
    onOpenChange(false);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100 hover:bg-blue-200 text-blue-600";
      case "green": return "bg-green-100 hover:bg-green-200 text-green-600";
      case "orange": return "bg-orange-100 hover:bg-orange-200 text-orange-600";
      case "purple": return "bg-purple-100 hover:bg-purple-200 text-purple-600";
      case "red": return "bg-red-100 hover:bg-red-200 text-red-600";
      case "yellow": return "bg-yellow-100 hover:bg-yellow-200 text-yellow-600";
      case "amber": return "bg-amber-100 hover:bg-amber-200 text-amber-600";
      case "pink": return "bg-pink-100 hover:bg-pink-200 text-pink-600";
      case "indigo": return "bg-indigo-100 hover:bg-indigo-200 text-indigo-600";
      case "emerald": return "bg-emerald-100 hover:bg-emerald-200 text-emerald-600";
      default: return "bg-gray-100 hover:bg-gray-200 text-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink water, Exercise, Read"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your habit goal..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {iconOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`w-12 h-12 p-0 ${getColorClass(option.color)} ${
                      selectedIcon.value === option.value ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedIcon(option)}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
