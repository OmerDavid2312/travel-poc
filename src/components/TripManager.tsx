import React, { useState, useEffect } from 'react';
import { useTripContext } from '@/context/TripContext';
import { TripHeader } from './TripHeader';
import { CityCard } from './CityCard';
import { CreateTripDialog } from './CreateTripDialog';
import { AddCityDialog } from './AddCityDialog';
import { AddItemDialog } from './AddItemDialog';
import { CSVImportDialog } from './CSVImportDialog';
import { AddNotesDialog } from './AddNotesDialog';
import { TripExpenseSummary } from './TripExpenseSummary';
import { MoneySavingTooltip } from './MoneySavingTooltip';
import { TripItem } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { parseCSV, importCSVToTrip } from '@/lib/csvParser';
import { Plane, MapPin, Building, Hotel } from 'lucide-react';
import heroImage from '@/assets/hero-travel.jpg';

export function TripManager() {
  const {
    currentTrip,
    budget,
    allTrips,
    loading,
    createTrip,
    loadTrip,
    addCity,
    deleteCity,
    addItem,
    updateItem,
    deleteItem,
    toggleItemPaid
  } = useTripContext();

  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ cityId: string; item: TripItem } | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [showMoneySavingTip, setShowMoneySavingTip] = useState(false);

  const handleCreateTrip = async (title: string, startDate: string, endDate: string, currency: string) => {
    await createTrip(title, startDate, endDate, currency);
  };

  const handleAddCity = async (name: string, startDate: string, endDate: string) => {
    await addCity(name, startDate, endDate);
  };

  const handleAddItemClick = (cityId: string) => {
    setSelectedCityId(cityId);
    setEditingItem(null);
    setAddItemDialogOpen(true);
  };

  const handleEditItem = (cityId: string, item: TripItem) => {
    setSelectedCityId(cityId);
    setEditingItem({ cityId, item });
    setAddItemDialogOpen(true);
  };

  const handleAddItem = async (item: Omit<TripItem, 'id'>) => {
    if (editingItem) {
      await updateItem(editingItem.cityId, editingItem.item.id, item);
    } else {
      await addItem(selectedCityId, item);
    }
    setEditingItem(null);
  };

  const handleDeleteItem = async (cityId: string, itemId: string) => {
    await deleteItem(cityId, itemId);
  };

  const handleTogglePaid = async (cityId: string, itemId: string) => {
    await toggleItemPaid(cityId, itemId);
  };

  const handleDeleteCity = async (cityId: string) => {
    await deleteCity(cityId);
  };

  const handleCSVImport = async (csvContent: string) => {
    if (!currentTrip) {
      throw new Error('No trip selected');
    }

    const rows = parseCSV(csvContent);
    const result = importCSVToTrip(currentTrip, rows);
    
    if (result.itemsImported > 0) {
      // Trip has been modified, need to save it
      // This will trigger through the context
      window.location.reload(); // Simple refresh to show imported data
    }
    
    return result;
  };

  const unpaidItems = currentTrip?.cities.flatMap(city => 
    city.items.filter(item => !item.paid).map(item => ({
      ...item,
      cityName: city.name,
      cityId: city.id
    }))
  ) || [];

  // Show money saving tip randomly when trip loads
  useEffect(() => {
    if (currentTrip) {
      // 80% chance to show the tip (increased for testing)
      const shouldShow = Math.random() < 0.8;
      if (shouldShow) {
        // Delay the tip by 1 second after trip loads (reduced for testing)
        const timer = setTimeout(() => {
          setShowMoneySavingTip(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentTrip]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card-elevated">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="relative container mx-auto px-4 py-24">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                מנהל הטיולים
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                ארגן את הנסיעות שלך בסטייל. נהל ערים, עקוב אחר הוצאות ושמור על התקציב שלך במסלול.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <CreateTripDialog onCreateTrip={handleCreateTrip} />
                {allTrips.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    או בחר מתוך {allTrips.length} טיול{allTrips.length > 1 ? 'ים' : ''} קיים{allTrips.length > 1 ? 'ים' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-flight/10 text-flight rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plane className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">מעקב אחר טיסות</h3>
              <p className="text-sm text-muted-foreground">
                עקוב אחר הזמנות טיסות, חברות תעופה ותאריכי נסיעה בקלות.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-hotel/10 text-hotel rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">ניהול בתי מלון</h3>
              <p className="text-sm text-muted-foreground">
                עקוב אחר מקומות לינה ופרטי הזמנות.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-activity/10 text-activity rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">תכנון פעילויות</h3>
              <p className="text-sm text-muted-foreground">
                ארגן פעילויות ועקוב אחר כל הוצאות הנסיעה שלך.
              </p>
            </Card>
          </div>

          {/* Recent Trips */}
          {allTrips.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">הטיולים האחרונים שלך</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTrips.slice(0, 6).map(trip => (
                  <Card 
                    key={trip.id} 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => loadTrip(trip.id)}
                  >
                    <h3 className="font-medium mb-2">{trip.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {trip.cities.length} ערים
                      </span>
                      <Button size="sm" variant="outline">
                        פתח
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Money Saving Tooltip */}
      <MoneySavingTooltip 
        isVisible={showMoneySavingTip} 
        onClose={() => setShowMoneySavingTip(false)} 
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Trip Header */}
        {budget && <TripHeader trip={currentTrip} budget={budget} />}
        
        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <AddCityDialog onAddCity={handleAddCity} />
          <AddNotesDialog />
          <CSVImportDialog onImportCSV={handleCSVImport} />
          <Button 
            variant="outline" 
            onClick={() => setShowMoneySavingTip(true)}
            className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
          >
            💡 טיפ לחיסכון
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            חזרה לטיולים
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentTrip.cities.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-lg font-medium mb-2">עדיין לא נוספו ערים</h3>
                <p className="text-muted-foreground mb-6">
                  התחל לתכנן את הטיול שלך על ידי הוספת היעד הראשון שלך.
                </p>
                <AddCityDialog onAddCity={handleAddCity} />
              </Card>
            ) : (
              currentTrip.cities.map(city => (
                <CityCard
                  key={city.id}
                  city={city}
                  currency={currentTrip.currency}
                  tripName={currentTrip.title}
                  onAddItem={handleAddItemClick}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onTogglePaid={handleTogglePaid}
                  onDeleteCity={handleDeleteCity}
                />
              ))
            )}
          </div>

          {/* Sidebar - Budget Overview */}
          <div className="space-y-6">
            {/* Trip Expense Summary */}
            <TripExpenseSummary trip={currentTrip} />
            
            {unpaidItems.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">לתשלום ({unpaidItems.length} פריטים)</h3>
                <div className="space-y-2">
                  {unpaidItems.slice(0, 5).map(item => (
                    <div key={`${item.cityId}-${item.id}`} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {item.type === 'hotel' && <Hotel className="h-4 w-4 text-blue-600" />}
                          {item.type === 'flight' && <Plane className="h-4 w-4 text-purple-600" />}
                          {item.type === 'activity' && <MapPin className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="truncate">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-muted-foreground">{item.cityName}</div>
                        </div>
                      </div>
                      <div className="text-warning font-medium flex-shrink-0">
                        {new Intl.NumberFormat('he-IL', {
                          style: 'currency',
                          currency: currentTrip.currency,
                        }).format(item.price)}
                      </div>
                    </div>
                  ))}
                  {unpaidItems.length > 5 && (
                    <div className="text-center text-muted-foreground text-sm pt-2">
                      ... ועוד {unpaidItems.length - 5} פריטים
                    </div>
                  )}
                </div>
              </Card>
            )}

            {budget && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">תקציב לפי עיר</h3>
                <div className="space-y-3">
                  {Object.values(budget.byCity).map(cityBudget => (
                    <div key={cityBudget.cityName} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{cityBudget.cityName}</span>
                        <span className="text-sm">
                          {new Intl.NumberFormat('he-IL', {
                            style: 'currency',
                            currency: currentTrip.currency,
                          }).format(cityBudget.planned)}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-success h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(100, (cityBudget.paid / cityBudget.planned) * 100)}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>שולם: {new Intl.NumberFormat('he-IL', {
                          style: 'currency',
                          currency: currentTrip.currency,
                        }).format(cityBudget.paid)}</span>
                        <span>{Math.round((cityBudget.paid / cityBudget.planned) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Add/Edit Item Dialog */}
        <AddItemDialog
          open={addItemDialogOpen}
          onOpenChange={setAddItemDialogOpen}
          onAddItem={handleAddItem}
          editItem={editingItem?.item}
        />
      </div>
    </div>
  );
}