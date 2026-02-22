import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const CalendarModule = ({ events = [], selectedDate, onDateSelect }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calendarDays = [];
  for (let i = 0; i < offset; i++) calendarDays.push(null);
  for (let i = 1; i <= days; i++) calendarDays.push(i);

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  const getDayEvents = (day) => {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className="calendar-module fade-in">
      <div className="calendar-header">
        <div className="month-display">
          <h3>{monthNames[month]} {year}</h3>
        </div>
        <div className="calendar-nav">
          <button type="button" onClick={handlePrevMonth} className="nav-btn"><ChevronLeft size={18} /></button>
          <button type="button" onClick={handleNextMonth} className="nav-btn"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
          <div key={`${d}-${idx}`} className="weekday-label">{d}</div>
        ))}
        {calendarDays.map((day, i) => {
          const dayEvents = day ? getDayEvents(day) : [];
          const isPickable = day !== null;

          return (
            <div
              key={i}
              className={`calendar-cell ${!isPickable ? 'empty' : 'day'} ${isSelected(day) ? 'selected' : ''} ${isToday(day) ? 'today' : ''}`}
              onClick={() => isPickable && onDateSelect && onDateSelect(new Date(year, month, day))}
            >
              <span className="day-number">{day}</span>
              {dayEvents.length > 0 && (
                <div className="event-dots">
                  {dayEvents.slice(0, 3).map((_, idx) => (
                    <div key={idx} className="dot"></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
                .calendar-module {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    margin-bottom: 0.5rem;
                }
                .month-display h3 {
                    font-size: 1rem;
                    font-weight: 800;
                    color: var(--text-main);
                }
                .calendar-nav { display: flex; gap: 0.25rem; }
                .nav-btn {
                    padding: 0.4rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .nav-btn:hover { background: #f1f5f9; color: var(--primary); }

                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 2px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    padding: 2px;
                }
                .weekday-label {
                    text-align: center;
                    padding: 0.75rem 0;
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    background: white;
                }
                .calendar-cell {
                    aspect-ratio: 1;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.875rem;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.1s;
                    user-select: none;
                }
                .calendar-cell.empty { cursor: default; }
                .calendar-cell.day:hover { background: #f0fdfa; color: var(--primary); z-index: 1; }
                
                .calendar-cell.today { font-weight: 800; color: var(--primary); }
                .calendar-cell.today::after {
                    content: '';
                    position: absolute;
                    bottom: 6px;
                    width: 4px;
                    height: 4px;
                    background: var(--primary);
                    border-radius: 50%;
                }
                
                .calendar-cell.selected {
                    background: var(--primary);
                    color: white !important;
                    border-radius: 6px;
                    font-weight: 800;
                    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
                }
                .calendar-cell.selected::after { background: white; }

                .event-dots {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    display: flex;
                    gap: 2px;
                }
                .dot {
                    width: 4px;
                    height: 4px;
                    background: #cbd5e1;
                    border-radius: 50%;
                }
                .calendar-cell.selected .dot { background: rgba(255, 255, 255, 0.5); }
            `}</style>
    </div>
  );
};

export default CalendarModule;
