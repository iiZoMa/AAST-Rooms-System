const fs = require('fs');

const COLLEGES = [
  'College of Engineering and Technology',
  'College of Computing and Information Technology',
  'College of Management and Technology',
  'College of International Transport and Logistics',
  'College of Archaeology and Cultural Heritage'
];

const A_ROOMS = Array.from({ length: 5 }, (_, floorIndex) => 
  Array.from({ length: 10 }, (_, roomIndex) => `A-${floorIndex + 1}${String(roomIndex + 1).padStart(2, '0')}`)
).flat();

const B_LABS = Array.from({ length: 10 }, (_, roomIndex) => `B-1${String(roomIndex + 1).padStart(2, '0')}`);

const subjects = [
  ['Mathematics 101', 'Physics I', 'Thermodynamics', 'Engineering Drawing', 'Circuits', 'Mechanics'],
  ['Programming I', 'Data Structures', 'Database Systems', 'Algorithms', 'Operating Systems', 'Networks'],
  ['Accounting I', 'Management Principles', 'Marketing', 'Economics', 'Finance', 'HR Management'],
  ['Logistics Mgmt', 'Supply Chain', 'Transport Systems', 'Maritime Law', 'Customs', 'Warehousing'],
  ['Ancient History', 'Excavation Tech', 'Museum Studies', 'Heritage Conservation', 'Egyptology', 'Artifacts']
];

const DAYS = [0, 1, 2, 3, 4, 6]; // Sunday to Thursday, Saturday

const fixedSchedule = [];
let idCounter = 1;

for (let c = 0; c < 5; c++) {
  const college = COLLEGES[c];
  const colSubjects = subjects[c];
  
  // Allocate rooms for this college
  // College 0: Floor 1 (A-101 to A-110) + B-101, B-102
  const myRooms = [
    ...A_ROOMS.slice(c * 10, (c + 1) * 10),
    ...B_LABS.slice(c * 2, (c + 1) * 2)
  ];

  // Distribute over days and slots
  for (const day of DAYS) {
    for (let slot = 1; slot <= 6; slot++) {
      // Create 2-3 classes per slot per college
      const numClasses = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < numClasses; i++) {
        const room = myRooms[Math.floor(Math.random() * myRooms.length)];
        const subject = colSubjects[Math.floor(Math.random() * colSubjects.length)];
        
        // Prevent double booking in fixed schedule generation
        if (!fixedSchedule.some(fs => fs.dayOfWeek === day && fs.slotId === slot && fs.roomName === room)) {
          fixedSchedule.push({
            id: `fs${idCounter++}`,
            dayOfWeek: day,
            slotId: slot,
            roomName: room,
            subject: subject,
            college: college
          });
        }
      }
    }
  }
}

fs.writeFileSync('generated_schedule.json', JSON.stringify({ fixedSchedule, A_ROOMS, B_LABS }, null, 2));
