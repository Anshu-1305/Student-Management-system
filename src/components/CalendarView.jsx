import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Video, Clock } from 'lucide-react';

const CalendarView = ({ classes = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getClassesForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return classes.filter(c => c.date === dateStr);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white dark:bg-black border border-[#22c55e] rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-[#22c55e]/10 rounded-lg">
            <ChevronLeft className="h-4 w-4 text-[#22c55e]" />
          </button>
          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-[#22c55e]/10 rounded-lg">
            <ChevronRight className="h-4 w-4 text-[#22c55e]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-[#22c55e]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="p-2 h-20"></div>
        ))}
        
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayClasses = getClassesForDate(day);
          const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
          
          return (
            <div key={day} className={`p-1 h-20 border border-[#A5D6A7]/30 rounded ${isToday ? 'bg-[#22c55e]/10' : ''}`}>
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[#22c55e]' : 'text-black dark:text-white'}`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayClasses.slice(0, 2).map(classItem => (
                  <div key={classItem.id} className="bg-[#22c55e] text-white text-xs p-1 rounded flex items-center">
                    <Video className="h-2 w-2 mr-1" />
                    <span className="truncate">{classItem.time}</span>
                  </div>
                ))}
                {dayClasses.length > 2 && (
                  <div className="text-xs text-[#22c55e]">+{dayClasses.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;