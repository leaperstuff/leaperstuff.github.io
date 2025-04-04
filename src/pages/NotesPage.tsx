
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash, Save, Folder, FolderPlus, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  folderId: string;
}

interface Folder {
  id: string;
  name: string;
  isExpanded: boolean;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved notes and folders from localStorage
    const savedNotes = localStorage.getItem('leaperNotes');
    const savedFolders = localStorage.getItem('leaperFolders');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Create a default folder if none exists
      const defaultFolder = { id: 'default', name: 'General', isExpanded: true };
      setFolders([defaultFolder]);
      localStorage.setItem('leaperFolders', JSON.stringify([defaultFolder]));
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage whenever they change
    if (notes.length > 0) {
      localStorage.setItem('leaperNotes', JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    // Save folders to localStorage whenever they change
    if (folders.length > 0) {
      localStorage.setItem('leaperFolders', JSON.stringify(folders));
    }
  }, [folders]);

  const createNewFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the folder.",
      });
      return;
    }
    
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      isExpanded: true
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsCreatingFolder(false);
    
    toast({
      title: "Folder created",
      description: `Folder "${newFolderName}" has been created.`,
    });
  };

  const deleteFolder = (folderId: string) => {
    // Move all notes from this folder to the default folder
    const updatedNotes = notes.map(note => 
      note.folderId === folderId ? {...note, folderId: 'default'} : note
    );
    
    setNotes(updatedNotes);
    setFolders(folders.filter(folder => folder.id !== folderId));
    
    toast({
      title: "Folder deleted",
      description: "Folder has been deleted and its notes moved to General.",
    });
  };

  const toggleFolderExpanded = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? {...folder, isExpanded: !folder.isExpanded} : folder
    ));
  };

  const createNewNote = (folderId: string = currentFolder || 'default') => {
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: new Date().toISOString(),
      folderId: folderId
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

  const moveNoteToFolder = (noteId: string, targetFolderId: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? {...note, folderId: targetFolderId} : note
    );
    
    setNotes(updatedNotes);
    
    if (currentNote && currentNote.id === noteId) {
      setCurrentNote({...currentNote, folderId: targetFolderId});
    }
    
    toast({
      title: "Note moved",
      description: "Your note has been moved to another folder.",
    });
  };
  
  const getNotesInFolder = (folderId: string) => {
    return notes.filter(note => note.folderId === folderId);
  };
  
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with folders and note list */}
        <div className="w-full lg:w-1/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Notes</h2>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setIsCreatingFolder(true)} 
                variant="outline" 
                size="sm"
                className="border-leaper-200 hover:border-leaper-500 hover:text-leaper-500"
              >
                <FolderPlus className="h-4 w-4 mr-1" />
                New Folder
              </Button>
              <Button 
                onClick={() => createNewNote()} 
                variant="outline" 
                size="sm" 
                className="border-leaper-200 hover:border-leaper-500 hover:text-leaper-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Note
              </Button>
            </div>
          </div>
          
          {isCreatingFolder && (
            <div className="mb-4 flex items-center space-x-2">
              <Input 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createNewFolder();
                  if (e.key === 'Escape') setIsCreatingFolder(false);
                }}
              />
              <Button 
                onClick={createNewFolder}
                size="sm"
                className="bg-leaper-500 hover:bg-leaper-600 text-black"
              >
                Create
              </Button>
              <Button 
                onClick={() => setIsCreatingFolder(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
          
          <ScrollArea className="h-[calc(100vh-320px)] pr-4">
            {folders.length === 0 ? (
              <Card className="mb-4 cursor-pointer border border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-gray-500 mb-4">No folders yet</p>
                  <Button 
                    onClick={() => setIsCreatingFolder(true)}
                    variant="outline" 
                    className="border-leaper-200 bg-leaper-50 hover:bg-leaper-100 hover:border-leaper-500"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Create your first folder
                  </Button>
                </CardContent>
              </Card>
            ) : (
              folders.map((folder) => (
                <div key={folder.id} className="mb-4">
                  <div 
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-t-md cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleFolderExpanded(folder.id)}
                  >
                    <div className="flex items-center">
                      {folder.isExpanded ? 
                        <ChevronDown className="h-4 w-4 mr-2" /> : 
                        <ChevronRight className="h-4 w-4 mr-2" />
                      }
                      <Folder className="h-4 w-4 mr-2" />
                      <span className="font-medium">{folder.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          createNewNote(folder.id);
                        }}
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      {folder.id !== 'default' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFolder(folder.id);
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {folder.isExpanded && (
                    <div className="pl-6 border-l border-gray-200 ml-3">
                      {getNotesInFolder(folder.id).length === 0 ? (
                        <p className="text-xs text-gray-500 py-2">No notes in this folder</p>
                      ) : (
                        getNotesInFolder(folder.id).map((note) => (
                          <Card 
                            key={note.id}
                            className={`mb-2 cursor-pointer transition-all hover:shadow-md ${
                              currentNote && currentNote.id === note.id ? 'border-leaper-500 bg-leaper-50' : ''
                            }`}
                            onClick={() => setCurrentNote(note)}
                          >
                            <CardHeader className="p-3">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base truncate">{note.title}</CardTitle>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 w-6 p-0 text-gray-500"
                                    >
                                      <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M3 8c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zm5 0c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zm5-1c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/>
                                      </svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="bg-white">
                                    {folders.filter(f => f.id !== note.folderId).map(folder => (
                                      <DropdownMenuItem 
                                        key={folder.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveNoteToFolder(note.id, folder.id);
                                        }}
                                      >
                                        <Folder className="h-3 w-3 mr-2" />
                                        Move to {folder.name}
                                      </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNote(note.id);
                                      }}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash className="h-3 w-3 mr-2" />
                                      Delete Note
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
                    </div>
                  )}
                </div>
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
                  <div className="flex-grow">
                    <Input 
                      value={currentNote.title}
                      onChange={(e) => updateNote({ ...currentNote, title: e.target.value })}
                      className="text-lg font-semibold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {folders.find(f => f.id === currentNote.folderId)?.name || 'General'}
                    </p>
                  </div>
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
                  onClick={() => createNewNote(currentFolder || 'default')}
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
