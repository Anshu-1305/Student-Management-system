import React, { useState } from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';

const ModernTimetable = () => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const timeSlots = [
    '09:20 – 10:20',
    '10:20 – 11:20', 
    '11:20 – 12:20',
    '12:20 – 01:00',
    '01:00 – 02:00',
    '02:00 – 03:00',
    '03:00 – 04:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const timetableData = {
    'Monday': [
      { subject: 'Cryptography & Network Security', code: 'CS701PC', type: 'theory', room: 'Classroom' },
      { subject: 'Professional Elective - V', code: 'PE-V', type: 'theory', room: 'Classroom' },
      { subject: 'Professional Elective - IV', code: 'PE-IV', type: 'theory', room: 'Classroom' },
      { subject: 'LUNCH', type: 'break' },
      { subject: 'Compiler Design', code: 'CS702PC', type: 'theory', room: 'Classroom' },
      { subject: 'CRT / Aptitude & Reasoning', code: 'CRT', type: 'crt', room: 'Classroom' },
      { subject: 'CRT / Aptitude & Reasoning', code: 'CRT', type: 'crt', room: 'Classroom' }
    ],
    'Tuesday': [
      { subject: 'C&NS LAB', code: 'CS701PC', type: 'lab', room: 'B1-S19' },
      { subject: 'C&NS LAB', code: 'CS701PC', type: 'lab', room: 'B1-S19' },
      { subject: 'Open Elective - II', code: 'OE-II', type: 'theory', room: 'Classroom' },
      { subject: 'LUNCH', type: 'break' },
      { subject: 'Open Elective - II', code: 'OE-II', type: 'theory', room: 'Classroom' },
      { subject: 'Cryptography & Network Security', code: 'CS701PC', type: 'theory', room: 'Classroom' },
      { subject: 'Sports', code: 'SPORTS', type: 'sports', room: 'Ground' }
    ],
    'Wednesday': [
      { subject: 'CD LAB', code: 'CS702PC', type: 'lab', room: '107' },
      { subject: 'CD LAB', code: 'CS702PC', type: 'lab', room: '107' },
      { subject: 'Cryptography & Network Security', code: 'CS701PC', type: 'theory', room: 'Classroom' },
      { subject: 'LUNCH', type: 'break' },
      { subject: 'Compiler Design', code: 'CS702PC', type: 'theory', room: 'Classroom' },
      { subject: 'CRT / Logical & Technical', code: 'CRT', type: 'crt', room: 'Classroom' },
      { subject: 'CRT / Logical & Technical', code: 'CRT', type: 'crt', room: 'Classroom' }
    ],
    'Thursday': [
      { subject: 'Professional Elective - IV', code: 'PE-IV', type: 'theory', room: 'Classroom' },
      { subject: 'Cryptography & Network Security', code: 'CS701PC', type: 'theory', room: 'Classroom' },
      { subject: 'Compiler Design', code: 'CS702PC', type: 'theory', room: 'Classroom' },
      { subject: 'LUNCH', type: 'break' },
      { subject: 'Cryptography & Network Security', code: 'CS701PC', type: 'theory', room: 'Classroom' },
      { subject: 'Compiler Design', code: 'CS702PC', type: 'theory', room: 'Classroom' },
      { subject: 'Project Stage - I', code: 'CS705PC', type: 'project', room: 'Classroom' }
    ],
    'Friday': [
      { subject: 'Professional Elective - V', code: 'PE-V', type: 'theory', room: 'Classroom' },
      { subject: 'Compiler Design', code: 'CS702PC', type: 'theory', room: 'Classroom' },
      { subject: 'Cryptography & Network Security', code: 'CS701PC', type: 'theory', room: 'Classroom' },
      { subject: 'LUNCH', type: 'break' },
      { subject: 'Project Stage - I', code: 'CS705PC', type: 'project', room: 'Classroom' },
      { subject: 'CRT / Soft Skills', code: 'CRT', type: 'crt', room: 'Classroom' },
      { subject: 'CRT / Soft Skills', code: 'CRT', type: 'crt', room: 'Classroom' }
    ],
    'Saturday': [
      { subject: 'Compiler Design', code: 'CS702PC', type: 'theory', room: 'Classroom' },
      { subject: 'Cryptography & Network Security', code: 'CS701PC', type: 'theory', room: 'Classroom' },
      { subject: 'Professional Elective - V', code: 'PE-V', type: 'theory', room: 'Classroom' },
      { subject: 'LUNCH', type: 'break' },
      { subject: 'Remedial Class', code: 'REMEDIAL', type: 'remedial', room: 'Classroom' },
      { subject: 'Project Stage - I', code: 'CS705PC', type: 'project', room: 'Classroom' },
      { subject: 'Project Stage - I', code: 'CS705PC', type: 'project', room: 'Classroom' }
    ]
  };

  const getSubjectColor = (type) => {
    switch (type) {
      case 'theory':
        return 'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] hover:from-[#388E3C] hover:to-[#2E7D32]';
      case 'lab':
        return 'bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] hover:from-[#66BB6A] hover:to-[#4CAF50]';
      case 'project':
        return 'bg-gradient-to-br from-[#66BB6A] to-[#4CAF50] hover:from-[#81C784] hover:to-[#66BB6A]';
      case 'crt':
        return 'bg-gradient-to-br from-[#81C784] to-[#66BB6A] hover:from-[#A5D6A7] hover:to-[#81C784]';
      case 'sports':
        return 'bg-gradient-to-br from-[#A5D6A7] to-[#81C784] hover:from-[#C8E6C9] hover:to-[#A5D6A7]';
      case 'remedial':
        return 'bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] hover:from-[#E8F5E8] hover:to-[#C8E6C9]';
      case 'break':
        return 'bg-gradient-to-br from-[#E8F5E8] to-[#C8E6C9] hover:from-[#F1F8E9] hover:to-[#E8F5E8]';
      default:
        return 'bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] hover:from-[#388E3C] hover:to-[#2E7D32]';
    }
  };

  const getTextColor = (type) => {
    return (type === 'break' || type === 'sports' || type === 'remedial') ? 'text-black' : 'text-white';
  };

  return (
    <div className="p-6 min-h-screen" style={{backgroundColor: '#FFFFFF'}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="floating-circle absolute top-4 left-1/4 w-16 h-16 bg-gradient-to-br from-[#A5D6A7] to-[#81C784] rounded-full opacity-20 animate-float"></div>
            <div className="floating-circle absolute top-8 right-1/3 w-12 h-12 bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] rounded-full opacity-30 animate-float-delayed"></div>
            <div className="floating-circle absolute bottom-4 left-1/3 w-20 h-20 bg-gradient-to-br from-[#E8F5E8] to-[#C8E6C9] rounded-full opacity-15 animate-float-slow"></div>
          </div>
          
          {/* Main Header */}
          <div className="relative z-10 bg-gradient-to-r from-white via-[#F1F8E9] to-white p-8 rounded-2xl shadow-lg border border-[#A5D6A7] animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin-slow mr-4">
                <Calendar className="h-12 w-12 text-[#2E7D32] drop-shadow-lg" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] bg-clip-text text-transparent animate-slide-in">
                IV Year I Semester
              </h1>
              <div className="animate-spin-slow ml-4">
                <Calendar className="h-12 w-12 text-[#2E7D32] drop-shadow-lg" />
              </div>
            </div>
            
            <div className="animate-slide-up">
              <div className="inline-block bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white px-6 py-2 rounded-full shadow-md animate-pulse-gentle">
                <span className="font-medium">Computer Science Engineering - CSE-B</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-6 animate-fade-in-delayed">
              <div className="bg-white border border-[#A5D6A7] rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center text-[#2E7D32]">
                  <Clock className="h-5 w-5 mr-2 animate-tick" />
                  <span className="font-semibold">College Timings: </span>
                  <span className="ml-2 font-bold text-[#1B5E20]">9:20 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-[#2E7D32] rounded-full animate-ping"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-[#4CAF50] rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#66BB6A] rounded-full animate-ping animation-delay-2000"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 p-4 bg-white border border-[#A5D6A7] rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-black mb-3">Subject Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded mr-2"></div>
              <span className="text-sm text-[#333333]">Theory</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] rounded mr-2"></div>
              <span className="text-sm text-[#333333]">Lab</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-[#66BB6A] to-[#4CAF50] rounded mr-2"></div>
              <span className="text-sm text-[#333333]">Project</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-[#81C784] to-[#66BB6A] rounded mr-2"></div>
              <span className="text-sm text-[#333333]">CRT</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-[#A5D6A7] to-[#81C784] rounded mr-2"></div>
              <span className="text-sm text-[#333333]">Sports</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] rounded mr-2"></div>
              <span className="text-sm text-[#333333]">Remedial</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-[#E8F5E8] to-[#C8E6C9] rounded mr-2"></div>
              <span className="text-sm text-[#333333]">Break</span>
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-white border border-[#A5D6A7] rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              {/* Header Row */}
              <thead>
                <tr style={{background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)'}}>
                  <th className="p-4 text-left text-white font-semibold border-r" style={{borderColor: '#1B5E20'}}>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Day / Time
                    </div>
                  </th>
                  {timeSlots.map((time, index) => (
                    <th key={index} className="p-4 text-center text-white font-semibold border-r last:border-r-0" style={{borderColor: '#1B5E20'}}>
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 mb-1" />
                        <span className="text-sm">{time}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {days.map((day, dayIndex) => (
                  <tr key={day} className="border-b border-[#A5D6A7] hover:bg-[#F1F8E9] transition-colors duration-200">
                    <td className="p-4 font-semibold text-black border-r" style={{backgroundColor: '#A5D6A7', borderColor: '#81C784'}}>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: '#2E7D32'}}></div>
                        {day}
                      </div>
                    </td>
                    {timetableData[day].map((period, periodIndex) => (
                      <td 
                        key={periodIndex} 
                        className="p-2 border-r border-[#A5D6A7] last:border-r-0"
                        onMouseEnter={() => setHoveredCell(`${day}-${periodIndex}`)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className={`
                          ${getSubjectColor(period.type)} 
                          ${getTextColor(period.type)}
                          p-3 rounded-lg text-center transition-all duration-300 transform
                          ${hoveredCell === `${day}-${periodIndex}` ? 'scale-105 shadow-lg glow' : 'hover:scale-102'}
                          cursor-pointer min-h-[80px] flex flex-col justify-center
                        `}>
                          <div className="font-semibold text-sm mb-1 leading-tight">
                            {period.subject}
                          </div>
                          {period.code && period.type !== 'break' && (
                            <div className="text-xs opacity-90 mb-1">
                              {period.code}
                            </div>
                          )}
                          {period.room && period.type !== 'break' && (
                            <div className="flex items-center justify-center text-xs opacity-80">
                              <MapPin className="h-3 w-3 mr-1" />
                              {period.room}
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-[#333333]">
          <p>Academic Year 2024-25 | Computer Science Engineering Department</p>
          <p className="mt-1">Lunch Break: 12:20 PM - 1:00 PM</p>
        </div>
      </div>

      <style jsx>{`
        .glow {
          box-shadow: 0 0 20px rgba(46, 125, 50, 0.5);
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(46, 125, 50, 0.6);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(8px) rotate(-1deg); }
          66% { transform: translateY(-12px) rotate(1deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slide-in {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-delayed {
          0%, 50% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes tick {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(6deg); }
          75% { transform: rotate(-6deg); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-slide-in { animation: slide-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 1s ease-out 0.3s both; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-delayed { animation: fade-in-delayed 2s ease-out; }
        .animate-pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }
        .animate-tick { animation: tick 2s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        @media (max-width: 768px) {
          .min-w-\\[800px\\] {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernTimetable;