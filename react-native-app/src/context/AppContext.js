import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createAccessibilitySettings } from '../models/AccessibilitySettings';
import { createReminderPreferences } from '../models/ReminderPreferences';
import { ActivityType, ActivityStatus } from '../models/ActivityEntry';
import * as Prefs from '../services/PreferencesService';

export const ACTION_TYPES = {
  INIT: 'INIT',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_REMINDER_PREFS: 'UPDATE_REMINDER_PREFS',
  MARK_ONBOARDED: 'MARK_ONBOARDED',
  ADD_CAREGIVER: 'ADD_CAREGIVER',
  COMPLETE_TASK: 'COMPLETE_TASK',
  SNOOZE_REMINDER: 'SNOOZE_REMINDER',
  DISMISS_REMINDER: 'DISMISS_REMINDER',
  TOGGLE_OFFLINE: 'TOGGLE_OFFLINE',
};

function buildDefaultActivityLog() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    { id: '1', title: 'Blood Pressure Medicine', time: '9:00 AM', type: ActivityType.MEDICATION, status: ActivityStatus.DONE, date: today },
    { id: '2', title: 'Heart Clinic Follow-up', time: '10:30 AM', type: ActivityType.APPOINTMENT, status: ActivityStatus.DONE, date: today },
    { id: '3', title: 'Emergency Help Request', time: '2:15 PM', type: ActivityType.ALERT, status: ActivityStatus.SENT, date: today },
    { id: '4', title: 'Vitamin D Supplement', time: '6:00 PM', type: ActivityType.MEDICATION, status: ActivityStatus.MISSED, date: today },
    { id: '5', title: 'Blood Pressure Medicine', time: '9:00 AM', type: ActivityType.MEDICATION, status: ActivityStatus.DONE, date: yesterday },
    { id: '6', title: 'Evening Medication', time: '8:00 PM', type: ActivityType.MEDICATION, status: ActivityStatus.DONE, date: yesterday },
  ];
}

export const initialState = {
  initialized: false,
  isOnboarded: false,
  isOffline: false,
  settings: createAccessibilitySettings(),
  reminderPrefs: createReminderPreferences(),
  caregivers: [
    { id: '1', name: 'Sarah', relationship: 'Daughter', phone: '555-0101', permissions: ['appointments', 'reminders', 'help'] },
    { id: '2', name: "Dr. Miller's Office", relationship: 'Doctor', phone: '555-0202', permissions: ['appointments', 'reminders', 'help'] },
  ],
  todaysPlan: [
    { id: '1', title: 'Daily Vitamin & Heart Med', date: 'Today', time: '8:00 AM', location: '', notes: '', type: 'medication', status: 'done', actionLabel: 'View Meds' },
    { id: '2', title: 'Eye Doctor Checkup', date: 'Today', time: '10:30 AM', location: 'City Eye Clinic, 123 Vision Way', notes: 'Remember to bring your current glasses and the list of eye drops you use. Dr. Smith will check your intraocular pressure.', type: 'appointment', status: 'todo', actionLabel: 'Get Directions' },
    { id: '3', title: 'Lunch & Afternoon Meds', date: 'Today', time: '12:30 PM', location: '', notes: '', type: 'medication', status: 'todo', actionLabel: 'Log Medication' },
    { id: '4', title: 'Walk in the Park', date: 'Today', time: '3:00 PM', location: '', notes: '', type: 'health-task', status: 'todo', actionLabel: 'Start Timer' },
    { id: '5', title: 'Blood Pressure Log', date: 'Today', time: '6:00 PM', location: '', notes: '', type: 'health-task', status: 'todo', actionLabel: 'Record Reading' },
    { id: '6', title: 'Nighttime Eye Drops', date: 'Today', time: '9:00 PM', location: '', notes: '', type: 'medication', status: 'todo', actionLabel: 'Log Meds' },
  ],
  reminders: [
    { id: '1', title: 'Afternoon Medication', dueTime: '12:30 PM', type: 'medication', instructions: 'Take one white pill of your blood pressure medicine with a full glass of water. It is best to take this after your light morning snack.', relatedAppointment: 'Follow-up: Heart Clinic', relatedAppointmentTime: 'Next Tuesday at 10:30 AM', status: 'pending' },
    { id: '2', title: 'Hydration Check', dueTime: 'Every 2 hours', type: 'hydration', instructions: null, relatedAppointment: null, relatedAppointmentTime: null, status: 'pending' },
  ],
  activityLog: buildDefaultActivityLog(),
};

export function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.INIT:
      return {
        ...state,
        initialized: true,
        settings: action.payload.settings,
        reminderPrefs: action.payload.reminderPrefs,
        isOnboarded: action.payload.isOnboarded,
      };
    case ACTION_TYPES.UPDATE_SETTINGS:
      return { ...state, settings: action.payload };
    case ACTION_TYPES.UPDATE_REMINDER_PREFS:
      return { ...state, reminderPrefs: action.payload };
    case ACTION_TYPES.MARK_ONBOARDED:
      return { ...state, isOnboarded: true };
    case ACTION_TYPES.ADD_CAREGIVER:
      return { ...state, caregivers: [...state.caregivers, action.payload] };
    case ACTION_TYPES.COMPLETE_TASK:
      return {
        ...state,
        todaysPlan: state.todaysPlan.map((a) =>
          a.id === action.payload ? { ...a, status: 'done' } : a
        ),
      };
    case ACTION_TYPES.SNOOZE_REMINDER:
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload ? { ...r, status: 'snoozed' } : r
        ),
      };
    case ACTION_TYPES.DISMISS_REMINDER:
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload ? { ...r, status: 'done' } : r
        ),
      };
    case ACTION_TYPES.TOGGLE_OFFLINE:
      return { ...state, isOffline: !state.isOffline };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function init() {
      const [settings, reminderPrefs, isOnboarded] = await Promise.all([
        Prefs.loadAccessibilitySettings(),
        Prefs.loadReminderPreferences(),
        Prefs.loadOnboarded(),
      ]);
      dispatch({ type: ACTION_TYPES.INIT, payload: { settings, reminderPrefs, isOnboarded } });
    }
    init();
  }, []);

  const actions = {
    updateSettings: async (settings) => {
      dispatch({ type: ACTION_TYPES.UPDATE_SETTINGS, payload: settings });
      await Prefs.saveAccessibilitySettings(settings);
    },
    updateReminderPrefs: async (prefs) => {
      dispatch({ type: ACTION_TYPES.UPDATE_REMINDER_PREFS, payload: prefs });
      await Prefs.saveReminderPreferences(prefs);
    },
    markOnboarded: async () => {
      dispatch({ type: ACTION_TYPES.MARK_ONBOARDED });
      await Prefs.saveOnboarded(true);
    },
    addCaregiver: (caregiver) => {
      dispatch({ type: ACTION_TYPES.ADD_CAREGIVER, payload: caregiver });
    },
    completeTask: (id) => {
      dispatch({ type: ACTION_TYPES.COMPLETE_TASK, payload: id });
    },
    snoozeReminder: (id) => {
      dispatch({ type: ACTION_TYPES.SNOOZE_REMINDER, payload: id });
    },
    dismissReminder: (id) => {
      dispatch({ type: ACTION_TYPES.DISMISS_REMINDER, payload: id });
    },
    toggleOffline: () => {
      dispatch({ type: ACTION_TYPES.TOGGLE_OFFLINE });
    },
  };

  return (
    <AppContext.Provider value={{ state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}

export function getCompletedCount(todaysPlan) {
  return todaysPlan.filter((a) => a.status === 'done').length;
}
