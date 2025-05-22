
import React from "react";
import { useTheme, ThemeName } from "@/utils/themeContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/utils/authContext";

interface ThemeOption {
  name: ThemeName;
  label: string;
  color: string;
  textColor: string;
}

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, updateUserTheme } = useAuth();
  
  const themeOptions: ThemeOption[] = [
    { name: 'light', label: 'Light', color: 'bg-white', textColor: 'text-black' },
    { name: 'dark', label: 'Dark', color: 'bg-gray-900', textColor: 'text-white' },
    { name: 'green', label: 'Green', color: 'bg-green-500', textColor: 'text-white' },
    { name: 'blue', label: 'Blue', color: 'bg-blue-500', textColor: 'text-white' },
    { name: 'purple', label: 'Purple', color: 'bg-purple-500', textColor: 'text-white' },
    { name: 'amber', label: 'Amber', color: 'bg-amber-500', textColor: 'text-white' },
  ];

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    
    // If user is authenticated, update their theme preference
    if (isAuthenticated) {
      updateUserTheme(newTheme);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className="rounded-full"
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Palette className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3">
          <div className="space-y-1">
            <h4 className="font-medium leading-none mb-2">Theme</h4>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  className={cn(
                    `${option.color} ${option.textColor} h-8 justify-start gap-2`,
                    theme === option.name && "border-2 border-primary"
                  )}
                  onClick={() => handleThemeChange(option.name)}
                >
                  {theme === option.name && <Check className="h-4 w-4 mr-1" />}
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSelector;
