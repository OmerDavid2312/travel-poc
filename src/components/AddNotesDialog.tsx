import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Trash2, StickyNote, Plus, Check, X } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';
import { TripNote } from '@/types/trip';

export function AddNotesDialog() {
  const { currentTrip, addNote, updateNote, deleteNote, toggleNoteCompleted } = useTripContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingNote, setEditingNote] = useState<TripNote | null>(null);

  const notes = currentTrip?.notes || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    if (editingNote) {
      await updateNote(editingNote.id, {
        title: title.trim(),
        description: description.trim() || undefined
      });
    } else {
      await addNote({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false
      });
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setEditingNote(null);
  };

  const handleEdit = (note: TripNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setDescription(note.description || '');
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (noteId: string) => {
    await deleteNote(noteId);
  };

  const handleToggleCompleted = async (noteId: string) => {
    await toggleNoteCompleted(noteId);
  };

  if (!currentTrip) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <StickyNote className="h-4 w-4" />
          הערות טיול
          {notes.length > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {notes.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>הערות טיול - {currentTrip.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add/Edit Note Form */}
          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {editingNote ? 'ערוך הערה' : 'הוסף הערה חדשה'}
                </h3>
                {editingNote && (
                  <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="noteTitle">כותרת *</Label>
                <Input
                  id="noteTitle"
                  placeholder="לדוגמה: לזכור לקנות מתנות, לבדוק מזג אוויר..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="noteDescription">תיאור (אופציונלי)</Label>
                <Textarea
                  id="noteDescription"
                  placeholder="פרטים נוספים על ההערה..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                {editingNote && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    ביטול
                  </Button>
                )}
                <Button type="submit">
                  <Plus className="h-4 w-4" />
                  {editingNote ? 'עדכן הערה' : 'הוסף הערה'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Notes List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">רשימת הערות ({notes.length})</h3>
            
            {notes.length === 0 ? (
              <Card className="p-8 text-center">
                <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">אין הערות עדיין</h4>
                <p className="text-muted-foreground">
                  התחל להוסיף הערות כדי לעקוב אחר המשימות שלך לטיול
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <Card key={note.id} className={`p-4 ${note.completed ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={note.completed}
                        onCheckedChange={() => handleToggleCompleted(note.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${note.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {note.title}
                        </h4>
                        {note.description && (
                          <p className={`text-sm mt-1 ${note.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                            {note.description}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          נוצר: {new Date(note.createdAt).toLocaleDateString('he-IL')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(note)}
                          className="h-8 w-8 p-0"
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(note.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {notes.length > 0 && (
            <Card className="p-4 bg-muted">
              <div className="flex justify-between text-sm">
                <span>סה"כ הערות: {notes.length}</span>
                <span>הושלמו: {notes.filter(n => n.completed).length}</span>
                <span>נותרו: {notes.filter(n => !n.completed).length}</span>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
