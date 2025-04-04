
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Pencil } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-leaper-500">Leaper</span>Stuff
          </h1>
        </div>

        <Tabs defaultValue={
          currentPath === "/" ? "notes" :
          currentPath.includes("/calendar") ? "calendar" :
          currentPath.includes("/whiteboard") ? "whiteboard" : "notes"
        } className="w-full sm:w-auto">
          <TabsList className="w-full">
            <TabsTrigger value="notes" asChild>
              <Link to="/" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="calendar" asChild>
              <Link to="/calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="whiteboard" asChild>
              <Link to="/whiteboard" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span>Whiteboard</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
};

export default Navigation;
