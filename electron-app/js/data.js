export const caregivers = [
  { id: '1', name: 'Sarah', relationship: 'Daughter', phone: '555-0101' },
  { id: '2', name: "Dr. Miller's Office", relationship: 'Doctor', phone: '555-0202' },
];

export const initialPlan = [
  {
    id: '1',
    title: 'Daily Vitamin & Heart Med',
    date: 'Today',
    time: '8:00 AM',
    location: '',
    notes: '',
    type: 'medication',
    status: 'done',
    actionLabel: 'View Meds',
  },
  {
    id: '2',
    title: 'Eye Doctor Checkup',
    date: 'Today',
    time: '10:30 AM',
    location: 'City Eye Clinic, 123 Vision Way',
    notes:
      'Remember to bring your current glasses and the list of eye drops you use. Dr. Smith will check your intraocular pressure.',
    type: 'appointment',
    status: 'todo',
    actionLabel: 'Get Directions',
  },
  {
    id: '3',
    title: 'Lunch and Afternoon Meds',
    date: 'Today',
    time: '12:30 PM',
    location: '',
    notes: '',
    type: 'medication',
    status: 'todo',
    actionLabel: 'Log Medication',
  },
  {
    id: '4',
    title: 'Walk in the Park',
    date: 'Today',
    time: '3:00 PM',
    location: '',
    notes: '',
    type: 'health-task',
    status: 'todo',
    actionLabel: 'Start Timer',
  },
  {
    id: '5',
    title: 'Blood Pressure Log',
    date: 'Today',
    time: '6:00 PM',
    location: '',
    notes: '',
    type: 'health-task',
    status: 'todo',
    actionLabel: 'Record Reading',
  },
  {
    id: '6',
    title: 'Nighttime Eye Drops',
    date: 'Today',
    time: '9:00 PM',
    location: '',
    notes: '',
    type: 'medication',
    status: 'todo',
    actionLabel: 'Log Meds',
  },
];

export const statusLabels = {
  done: { label: 'Done', icon: '✓' },
  todo: { label: 'Pending', icon: '◷' },
};

export const typeLabels = {
  medication: { label: 'Medication', icon: 'Rx' },
  appointment: { label: 'Appointment', icon: 'Cal' },
  'health-task': { label: 'Health task', icon: 'H' },
};
