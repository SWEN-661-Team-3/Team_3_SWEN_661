import 'package:flutter/foundation.dart';
import '../models/accessibility_settings.dart';
import '../models/activity_entry.dart';
import '../models/appointment.dart';
import '../models/caregiver.dart';
import '../models/reminder.dart';
import '../models/reminder_preferences.dart';
import '../services/preferences_service.dart';

class AppState extends ChangeNotifier {
  final PreferencesService _prefs;

  AppState({PreferencesService? preferencesService})
      : _prefs = preferencesService ?? PreferencesService();

  bool _initialized = false;
  bool get initialized => _initialized;

  bool _isOnboarded = false;
  bool get isOnboarded => _isOnboarded;

  bool _isOffline = false;
  bool get isOffline => _isOffline;

  AccessibilitySettings _settings = const AccessibilitySettings();
  AccessibilitySettings get settings => _settings;

  ReminderPreferences _reminderPrefs = const ReminderPreferences();
  ReminderPreferences get reminderPrefs => _reminderPrefs;

  List<Caregiver> _caregivers = const [
    Caregiver(id: '1', name: 'Sarah', relationship: 'Daughter', phone: '555-0101'),
    Caregiver(id: '2', name: "Dr. Miller's Office", relationship: 'Doctor', phone: '555-0202'),
  ];
  List<Caregiver> get caregivers => _caregivers;

  List<Appointment> _todaysPlan = const [
    Appointment(
      id: '1', title: 'Daily Vitamin & Heart Med', date: 'Today',
      time: '8:00 AM', type: 'medication', status: 'done',
      actionLabel: 'View Meds',
    ),
    Appointment(
      id: '2', title: 'Eye Doctor Checkup', date: 'Today',
      time: '10:30 AM', location: 'City Eye Clinic, 123 Vision Way',
      type: 'appointment', status: 'todo', actionLabel: 'Get Directions',
      notes: 'Remember to bring your current glasses and the list of eye drops you use. Dr. Smith will check your intraocular pressure.',
    ),
    Appointment(
      id: '3', title: 'Lunch & Afternoon Meds', date: 'Today',
      time: '12:30 PM', type: 'medication', status: 'todo',
      actionLabel: 'Log Medication',
    ),
    Appointment(
      id: '4', title: 'Walk in the Park', date: 'Today',
      time: '3:00 PM', type: 'health-task', status: 'todo',
      actionLabel: 'Start Timer',
    ),
    Appointment(
      id: '5', title: 'Blood Pressure Log', date: 'Today',
      time: '6:00 PM', type: 'health-task', status: 'todo',
      actionLabel: 'Record Reading',
    ),
    Appointment(
      id: '6', title: 'Nighttime Eye Drops', date: 'Today',
      time: '9:00 PM', type: 'medication', status: 'todo',
      actionLabel: 'Log Meds',
    ),
  ];
  List<Appointment> get todaysPlan => _todaysPlan;

  List<Reminder> _reminders = const [
    Reminder(
      id: '1', title: 'Afternoon Medication', dueTime: '12:30 PM',
      type: 'medication',
      instructions: 'Take one white pill of your blood pressure medicine with a full glass of water. It is best to take this after your light morning snack.',
      relatedAppointment: 'Follow-up: Heart Clinic',
      relatedAppointmentTime: 'Next Tuesday at 10:30 AM',
    ),
    Reminder(
      id: '2', title: 'Hydration Check', dueTime: 'Every 2 hours',
      type: 'hydration',
    ),
  ];
  List<Reminder> get reminders => _reminders;

  // ignore: prefer_final_fields
  List<ActivityEntry> _activityLog = _buildDefaultActivityLog();
  List<ActivityEntry> get activityLog => _activityLog;

  int get completedTaskCount =>
      _todaysPlan.where((a) => a.status == 'done').length;
  int get totalTaskCount => _todaysPlan.length;

  // -- Initialization --

  Future<void> init() async {
    _settings = await _prefs.loadAccessibilitySettings();
    _reminderPrefs = await _prefs.loadReminderPreferences();
    _isOnboarded = await _prefs.loadOnboarded();
    _initialized = true;
    notifyListeners();
  }

  // -- Mutations --

  Future<void> updateSettings(AccessibilitySettings settings) async {
    _settings = settings;
    await _prefs.saveAccessibilitySettings(settings);
    notifyListeners();
  }

  Future<void> updateReminderPrefs(ReminderPreferences prefs) async {
    _reminderPrefs = prefs;
    await _prefs.saveReminderPreferences(prefs);
    notifyListeners();
  }

  Future<void> markOnboarded() async {
    _isOnboarded = true;
    await _prefs.saveOnboarded(true);
    notifyListeners();
  }

  void addCaregiver(Caregiver caregiver) {
    _caregivers = [..._caregivers, caregiver];
    notifyListeners();
  }

  void completeTask(String id) {
    _todaysPlan = _todaysPlan
        .map((a) => a.id == id ? a.copyWith(status: 'done') : a)
        .toList();
    notifyListeners();
  }

  void snoozeReminder(String id) {
    _reminders = _reminders
        .map((r) => r.id == id ? r.copyWith(status: 'snoozed') : r)
        .toList();
    notifyListeners();
  }

  void dismissReminder(String id) {
    _reminders = _reminders
        .map((r) => r.id == id ? r.copyWith(status: 'done') : r)
        .toList();
    notifyListeners();
  }

  void toggleOffline() {
    _isOffline = !_isOffline;
    notifyListeners();
  }

  // -- Helpers --

  static List<ActivityEntry> _buildDefaultActivityLog() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    return [
      ActivityEntry(
        id: '1', title: 'Blood Pressure Medicine', time: '9:00 AM',
        type: ActivityType.medication, status: ActivityStatus.done, date: today,
      ),
      ActivityEntry(
        id: '2', title: 'Heart Clinic Follow-up', time: '10:30 AM',
        type: ActivityType.appointment, status: ActivityStatus.done, date: today,
      ),
      ActivityEntry(
        id: '3', title: 'Emergency Help Request', time: '2:15 PM',
        type: ActivityType.alert, status: ActivityStatus.sent, date: today,
      ),
      ActivityEntry(
        id: '4', title: 'Vitamin D Supplement', time: '6:00 PM',
        type: ActivityType.medication, status: ActivityStatus.missed, date: today,
      ),
      ActivityEntry(
        id: '5', title: 'Blood Pressure Medicine', time: '9:00 AM',
        type: ActivityType.medication, status: ActivityStatus.done, date: yesterday,
      ),
      ActivityEntry(
        id: '6', title: 'Evening Medication', time: '8:00 PM',
        type: ActivityType.medication, status: ActivityStatus.done, date: yesterday,
      ),
    ];
  }
}
