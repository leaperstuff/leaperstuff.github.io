
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, X, Clock, CalendarIcon, Tag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time?: string;
  category: string;
  color: string;
}

const EVENT_CATEGORIES = [
  { name: "Work", color: "#FF5733" },
  { name: "Personal", color: "#33FF57" },
  { name: "Family", color: "#3357FF" },
  { name: "Health", color: "#FF33F5" },
  { name: "Other", color: "#F5B041" }
];

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewingEvent, setIsViewingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventCategory, setNewEventCategory] = useState("Other");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  // Load events on component mount
  React.useEffect(() => {
    const savedEvents = localStorage.getItem('leaperEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      setEvents(parsedEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date)
      })));
    }
  }, []);

  // Save events to localStorage
  React.useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('leaperEvents', JSON.stringify(events));
    }
  }, [events]);

  const resetNewEventForm = () => {
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventTime("");
    setNewEventCategory("Other");
  };

  const addEvent = () => {
    if (!date || !newEventTitle.trim()) return;
    
    const newEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      description: newEventDescription,
      date: date,
      time: newEventTime,
      category: newEventCategory,
      color: EVENT_CATEGORIES.find(cat => cat.name === newEventCategory)?.color || "#F5B041"
    };
    
    setEvents([...events, newEvent]);
    resetNewEventForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Event added",
      description: `${newEventTitle} has been added to your calendar.`,
    });
  };

  const updateEvent = () => {
    if (!selectedEvent) return;
    
    const updatedEvent = {
      ...selectedEvent,
      title: newEventTitle,
      description: newEventDescription,
      time: newEventTime,
      category: newEventCategory,
      color: EVENT_CATEGORIES.find(cat => cat.name === newEventCategory)?.color || "#F5B041"
    };
    
    setEvents(events.map(event => event.id === selectedEvent.id ? updatedEvent : event));
    
    resetNewEventForm();
    setSelectedEvent(null);
    setIsViewingEvent(false);
    
    toast({
      title: "Event updated",
      description: "The event has been updated successfully.",
    });
  };
  
  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent(null);
      setIsViewingEvent(false);
    }
    
    toast({
      title: "Event removed",
      description: "The event has been removed from your calendar.",
    });
  };
  
  const getDayEvents = (day: Date | undefined) => {
    if (!day) return [];
    const dayEvents = events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
    
    if (filter === "all") {
      return dayEvents;
    }
    
    return dayEvents.filter(event => event.category === filter);
  };
  
  // Function to highlight days with events
  const isDayWithEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear() &&
      (filter === "all" || event.category === filter)
    );
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setNewEventTitle(event.title);
    setNewEventDescription(event.description || "");
    setNewEventTime(event.time || "");
    setNewEventCategory(event.category);
    setIsViewingEvent(true);
  };
  
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="w-full lg:w-1/2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Calendar</CardTitle>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {EVENT_CATEGORIES.map(category => (
                      <SelectItem key={category.name} value={category.name}>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiersClassNames={{
                  selected: 'bg-leaper-500 text-black hover:bg-leaper-600',
                }}
                modifiers={{
                  highlighted: (date) => isDayWithEvent(date)
                }}
                modifiersStyles={{
                  highlighted: { 
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 2px #ffd500', 
                  }
                }}
              />
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={() => {
                    setSelectedEvent(null);
                    resetNewEventForm();
                    setIsDialogOpen(true);
                  }}
                  className="bg-leaper-500 hover:bg-leaper-600 text-black"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Events Panel */}
        <div className="w-full lg:w-1/2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Events for {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </CardTitle>
                  <CardDescription>
                    {getDayEvents(date).length} event{getDayEvents(date).length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedEvent(null);
                    resetNewEventForm();
                    setIsDialogOpen(true);
                  }}
                  size="sm"
                  className="bg-leaper-500 hover:bg-leaper-600 text-black"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="space-y-4">
                  {getDayEvents(date).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No events for this day</p>
                    </div>
                  ) : (
                    getDayEvents(date)
                      .sort((a, b) => {
                        if (!a.time) return 1;
                        if (!b.time) return -1;
                        return a.time.localeCompare(b.time);
                      })
                      .map(event => (
                      <Card 
                        key={event.id} 
                        className="p-0 border shadow-sm hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleViewEvent(event)}
                      >
                        <div className="flex">
                          <div 
                            className="w-2 h-auto" 
                            style={{ backgroundColor: event.color }}
                          ></div>
                          <div className="p-3 flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                {event.description && (
                                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{event.description}</p>
                                )}
                              </div>
                              <Button 
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeEvent(event.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center mt-2 space-x-2">
                              {event.time && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {event.time}
                                </div>
                              )}
                              <Badge 
                                variant="outline" 
                                className="text-xs" 
                                style={{ 
                                  borderColor: event.color,
                                  color: event.color
                                }}
                              >
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add/Edit Event Dialog */}
      <Dialog 
        open={isDialogOpen || isViewingEvent} 
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setIsViewingEvent(false);
            setSelectedEvent(null);
            resetNewEventForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isViewingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-sm">
                Date
              </label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm">
                Event Title
              </label>
              <Input
                id="title"
                className="col-span-3"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm">
                Description
              </label>
              <Textarea
                id="description"
                className="col-span-3"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Enter event description (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right text-sm">
                Time
              </label>
              <Input
                id="time"
                className="col-span-3"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                placeholder="e.g. 3:30 PM (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm">
                <Tag className="h-4 w-4" />
              </label>
              <div className="col-span-3">
                <Select value={newEventCategory} onValueChange={setNewEventCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map(category => (
                      <SelectItem key={category.name} value={category.name}>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setIsViewingEvent(false);
                setSelectedEvent(null);
                resetNewEventForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={isViewingEvent ? updateEvent : addEvent}
              className="bg-leaper-500 hover:bg-leaper-600 text-black"
            >
              {isViewingEvent ? "Update" : "Add"} Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
