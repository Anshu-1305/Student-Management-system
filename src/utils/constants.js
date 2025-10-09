export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const GRADE_SCALE = {
  'A+': { min: 95, max: 100 },
  'A': { min: 90, max: 94 },
  'B+': { min: 85, max: 89 },
  'B': { min: 80, max: 84 },
  'C+': { min: 75, max: 79 },
  'C': { min: 70, max: 74 },
  'D': { min: 60, max: 69 },
  'F': { min: 0, max: 59 }
};

export const calculateGrade = (marks, totalMarks) => {
  const percentage = (marks / totalMarks) * 100;
  
  for (const [grade, range] of Object.entries(GRADE_SCALE)) {
    if (percentage >= range.min && percentage <= range.max) {
      return grade;
    }
  }
  return 'F';
};