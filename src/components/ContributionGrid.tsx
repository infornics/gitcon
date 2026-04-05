import React from 'react';

interface Day {
  date: string;
  count: number;
}

interface ContributionGridProps {
  days: Day[];
  maxCount: number;
  skeleton?: boolean;
  onHover?: (day: Day, x: number, y: number) => void;
  onLeave?: () => void;
}

const levelForCount = (count: number, max: number) => {
  if (!count) return 0;
  const thresholds = [0.15, 0.38, 0.68];
  const ratio = max ? count / max : 0;
  if (ratio <= thresholds[0]) return 1;
  if (ratio <= thresholds[1]) return 2;
  if (ratio <= thresholds[2]) return 3;
  return 4;
};

const formatDate = (dateString: string) => {
  return new Date(dateString + 'T00:00:00Z').toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    timeZone: 'UTC' 
  });
};

export const ContributionGrid: React.FC<ContributionGridProps> = ({ 
  days, maxCount, skeleton, onHover, onLeave 
}) => {
  const handleMouseMove = (event: React.MouseEvent, day: Day) => {
    if (onHover) {
      onHover(day, event.clientX, event.clientY);
    }
  };

  function handleHover(event: React.MouseEvent | React.FocusEvent, day: Day) {
    if (onHover) {
      const clientX = 'clientX' in event ? event.clientX : (event.target as HTMLElement).getBoundingClientRect().left;
      const clientY = 'clientY' in event ? event.clientY : (event.target as HTMLElement).getBoundingClientRect().top;
      onHover(day, clientX, clientY);
    }
  }

  return (
    <div className={`calendar-grid ${skeleton ? 'skeleton' : ''}`} role="grid" aria-label="GitHub contribution calendar">
      {days.map((day, idx) => (
        <button
          key={`${day.date}-${idx}`}
          type="button"
          className={`day-cell lvl-${levelForCount(day.count, maxCount)}`}
          aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
          onMouseMove={(e) => !skeleton && handleMouseMove(e, day)}
          onMouseEnter={(e) => !skeleton && handleHover(e, day)}
          onMouseLeave={onLeave}
          onFocus={(e) => !skeleton && handleHover(e, day)}
          onBlur={onLeave}
        />
      ))}
    </div>
  );
};
