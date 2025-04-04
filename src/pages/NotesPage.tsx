
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved notes from localStorage
    const savedNotes = localStorage.getItem('leaperNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage whenever they change
    if (notes.length > 0) {
      localStorage.setItem('leaperNotes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: new Date().toISOString()
    };
    setNotes([...notes, newNote]);
    setCurrentNote(newNote);
    
    toast({
      title: "Note created",
      description: "A new note has been created.",
    });
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    setCurrentNote(updatedNote);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (currentNote && currentNote.id === id) {
      setCurrentNote(null);
    }
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted.",
    });
  };

  const saveNote = () => {
    toast({
      title: "Note saved",
      description: "Your note has been saved.",
    });
  };
  
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with note list */}
        <div className="w-full lg:w-1/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Notes</h2>
            <Button 
              onClick={createNewNote} 
              variant="outline" 
              size="sm" 
              className="border-leaper-200 hover:border-leaper-500 hover:text-leaper-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-320px)] pr-4">
            {notes.length === 0 ? (
              <Card className="mb-4 cursor-pointer border border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-gray-500 mb-4">No notes yet</p>
                  <Button 
                    onClick={createNewNote}
                    variant="outline" 
                    className="border-leaper-200 bg-leaper-50 hover:bg-leaper-100 hover:border-leaper-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card 
                  key={note.id}
                  className={`mb-4 cursor-pointer transition-all hover:shadow-md ${
                    currentNote && currentNote.id === note.id ? 'border-leaper-500 bg-leaper-50' : ''
                  }`}
                  onClick={() => setCurrentNote(note)}
                >
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base truncate">{note.title}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(note.date).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </ScrollArea>
        </div>
        
        {/* Note editor */}
        <div className="w-full lg:w-3/4">
          {currentNote ? (
            <Card className="overflow-hidden">
              <CardHeader className="p-4 bg-leaper-50 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <Input 
                    value={currentNote.title}
                    onChange={(e) => updateNote({ ...currentNote, title: e.target.value })}
                    className="text-lg font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                  />
                  <Button 
                    onClick={saveNote}
                    variant="outline" 
                    size="sm" 
                    className="border-leaper-200 hover:border-leaper-500 hover:text-leaper-500"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Textarea 
                  value={currentNote.content}
                  onChange={(e) => updateNote({ ...currentNote, content: e.target.value })}
                  className="min-h-[calc(100vh-320px)] p-4 border-0 rounded-none focus-visible:ring-0"
                  placeholder="Start writing..."
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center h-[calc(100vh-320px)]">
              <div className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No Note Selected</h3>
                <p className="text-gray-500 mb-6">Select a note from the list or create a new one</p>
                <Button 
                  onClick={createNewNote}
                  className="bg-leaper-500 hover:bg-leaper-600 text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Note
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
