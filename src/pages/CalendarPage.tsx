
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  id: string;
  title: string;
  date: Date;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
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

  const addEvent = () => {
    if (!date || !newEventTitle.trim()) return;
    
    const newEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: date
    };
    
    setEvents([...events, newEvent]);
    setNewEventTitle("");
    setIsDialogOpen(false);
    
    toast({
      title: "Event added",
      description: `${newEventTitle} has been added to your calendar.`,
    });
  };
  
  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    
    toast({
      title: "Event removed",
      description: "The event has been removed from your calendar.",
    });
  };
  
  const getDayEvents = (day: Date | undefined) => {
    if (!day) return [];
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  // Function to highlight days with events
  const isDayWithEvent = (day: Date) => {
    return events.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };
  
  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="w-full lg:w-1/2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Calendar</CardTitle>
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
            </CardContent>
          </Card>
        </div>
        
        {/* Events Panel */}
        <div className="w-full lg:w-1/2">
          <Card className="h-full">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <div>
                <CardTitle>
                  Events for {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </CardTitle>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                size="sm"
                className="bg-leaper-500 hover:bg-leaper-600 text-black"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getDayEvents(date).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No events for this day</p>
                  </div>
                ) : (
                  getDayEvents(date).map(event => (
                    <div 
                      key={event.id} 
                      className="p-3 bg-white border rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <span>{event.title}</span>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                        onClick={() => removeEvent(event.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date
              </label>
              <div className="col-span-3">
                <Input
                  id="date"
                  value={date ? date.toLocaleDateString() : ''}
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
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
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={addEvent}
              className="bg-leaper-500 hover:bg-leaper-600 text-black"
            >
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
