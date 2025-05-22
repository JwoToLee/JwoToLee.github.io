
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/authContext";
import ThemeSelector from "@/components/ThemeSelector";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname === "/admin";
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <ClipboardCheck className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Aid</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAdminPage && (
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            )}
            
            <ThemeSelector />
            
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Admin Panel
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
