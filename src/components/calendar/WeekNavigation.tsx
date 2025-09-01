import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface WeekNavigationProps {
  currentWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onGoToToday: () => void;
}

export function WeekNavigation({ 
  currentWeek, 
  onPreviousWeek, 
  onNextWeek, 
  onGoToToday 
}: WeekNavigationProps) {
  
  const getWeekStart = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(date.setDate(diff));
  };

  const getWeekEnd = (startDate: Date): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return endDate;
  };

  const weekStart = getWeekStart(new Date(currentWeek));
  const weekEnd = getWeekEnd(weekStart);

  const formatWeekRange = () => {
    const startStr = weekStart.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
    const endStr = weekEnd.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    return `${startStr} - ${endStr}`;
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const todayWeekStart = getWeekStart(new Date(today));
    return todayWeekStart.toDateString() === weekStart.toDateString();
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={onGoToToday} 
          className="text-sm"
          disabled={isCurrentWeek()}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Today
        </Button>
      </div>

      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onPreviousWeek}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="mx-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {formatWeekRange()}
          </h2>
          {isCurrentWeek() && (
            <span className="text-xs text-muted-foreground">Current Week</span>
          )}
        </div>
        
        <Button variant="ghost" size="sm" onClick={onNextWeek}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-20" /> {/* Spacer for alignment */}
    </div>
  );
}