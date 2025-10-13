import axios from 'axios';
import { useEffect, useState } from 'react';

const StudentTimetable = ({ branch, section, regulation }) => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/timetable', {
          params: { branch, section, regulation }
        });
        setTimetable(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load timetable');
      }
      setLoading(false);
    };
    fetchTimetable();
  }, [branch, section, regulation]);

  if (loading) return <div className="text-center py-8">Loading timetable...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!timetable.length) return <div className="text-center py-8">No timetable found.</div>;

  // Build a map of day -> slots and gather all unique time slots
  const dayMap = {};
  const timeSet = new Set();
  timetable.forEach((d) => {
    dayMap[d.day] = d.slots;
    d.slots.forEach(s => timeSet.add(s.time));
  });

  const days = Object.keys(dayMap);
  const times = Array.from(timeSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <div className="overflow-auto rounded-lg border border-[#22c55e] bg-white p-4 shadow">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-[#22c55e]/10">
            <th className="px-4 py-2 text-left text-sm font-semibold text-[#166534]">Time</th>
            {days.map((day) => (
              <th key={day} className="px-4 py-2 text-left text-sm font-semibold text-[#166534]">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time} className="hover:bg-[#22c55e]/5">
              <td className="px-3 py-2 align-top text-sm font-medium text-gray-700">{time}</td>
              {days.map((day) => {
                const slot = (dayMap[day] || []).find(s => s.time === time);
                return (
                  <td key={`${day}-${time}`} className="px-3 py-2 align-top text-sm text-gray-800">
                    {slot ? (
                      <div>
                        <div className="font-semibold text-[#065f46]">{slot.subject}</div>
                        <div className="text-xs text-gray-600">{slot.faculty} • {slot.room}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">-</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTimetable;
