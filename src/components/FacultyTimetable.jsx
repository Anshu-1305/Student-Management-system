import axios from 'axios';
import { useEffect, useState } from 'react';

const FacultyTimetable = ({ facultyName }) => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/timetable');
        // Filter slots by faculty
        const all = res.data;
        // Flatten day/slots to entries by day
        const filtered = all.map(d => ({ day: d.day, slots: d.slots.filter(s => s.faculty === facultyName) })).filter(d => d.slots.length);
        setTimetable(filtered);
      } catch (err) {
        setError('Failed to load timetable');
      }
      setLoading(false);
    };
    fetch();
  }, [facultyName]);

  if (loading) return <div className="text-center py-8">Loading faculty timetable...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!timetable.length) return <div className="text-center py-8">No timetable entries for this faculty.</div>;

  return (
    <div className="space-y-6">
      {timetable.map((d, idx) => (
        <div key={idx} className="p-4 bg-white border border-[#22c55e] rounded-lg shadow">
          <h4 className="text-lg font-semibold text-[#22c55e] mb-2">{d.day}</h4>
          <ul className="space-y-2">
            {d.slots.map((s, i) => (
              <li key={i} className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{s.time} — {s.subject}</div>
                  <div className="text-sm text-gray-600">Class: {s.class || `${s.branch}-${s.section}`} • Room: {s.room}</div>
                </div>
                <div className="text-sm text-gray-500">{s.room}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FacultyTimetable;
