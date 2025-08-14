import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSV, importCSVToTrip } from '@/lib/csvParser';
import { ImportResult } from '@/types/trip';

interface CSVImportDialogProps {
  onImportCSV: (csvContent: string) => Promise<ImportResult>;
}

export function CSVImportDialog({ onImportCSV }: CSVImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCsvContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!csvContent.trim()) return;

    try {
      setImporting(true);
      setResult(null);
      
      const importResult = await onImportCSV(csvContent);
      setResult(importResult);
      
      if (importResult.success) {
        setTimeout(() => {
          setOpen(false);
          setCsvContent('');
          setResult(null);
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        itemsImported: 0,
        errors: [error instanceof Error ? error.message : 'Import failed']
      });
    } finally {
      setImporting(false);
    }
  };

  const sampleCSV = `city,type,title,provider,dateFrom,dateTo,price,paid
Paris,flight,Flight to Paris,Air France,2024-03-15,2024-03-15,450,true
Paris,hotel,Hotel du Louvre,Marriott,2024-03-15,2024-03-18,350,false
Paris,activity,Louvre Museum,Paris Tourism,2024-03-16,,25,false
London,flight,Flight to London,British Airways,2024-03-18,2024-03-18,200,false
London,hotel,The Savoy,Savoy Group,2024-03-18,2024-03-20,500,false`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4" />
          ייבא CSV
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>ייבא מ-CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>העלה קובץ CSV</Label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="csvContent">או הדבק תוכן CSV</Label>
            <Textarea
              id="csvContent"
              placeholder="הדבק כאן את תוכן ה-CSV שלך..."
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          
          {result && (
            <Alert className={result.success ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                <AlertDescription>
                  {result.success ? (
                    <span>יובאו בהצלחה {result.itemsImported} פריטים!</span>
                  ) : (
                    <div>
                      <div className="font-medium mb-2">הייבוא נכשל עם {result.errors.length} שגיאות:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {result.errors.slice(0, 5).map((error, index) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                        {result.errors.length > 5 && (
                          <li className="text-sm">... ועוד {result.errors.length - 5} שגיאות</li>
                        )}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
          
          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm font-medium mb-2">פורמט CSV צפוי:</div>
            <pre className="text-xs font-mono bg-background p-2 rounded border overflow-x-auto">
              {sampleCSV}
            </pre>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={importing}
            >
              ביטול
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!csvContent.trim() || importing}
            >
              {importing ? 'מייבא...' : 'ייבא'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}