"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; 

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Prevents hydration mismatch
    }
    return (
        <div className="cursor-pointer" onClickCapture={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {
                theme === "dark" ? (
                    <Sun className="w-5 h-5 text-white" />
                ) : (
                    <Moon className="w-5 h-5 text-black" />
                )
            }
        </div>
    )
}
export default ThemeToggle;