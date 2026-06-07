enum ActivityType { medication, appointment, alert }

enum ActivityStatus { done, missed, sent, todo }

class ActivityEntry {
  final String id;
  final String title;
  final String time;
  final ActivityType type;
  final ActivityStatus status;
  final DateTime date;

  const ActivityEntry({
    required this.id,
    required this.title,
    required this.time,
    required this.type,
    required this.status,
    required this.date,
  });

  @override
  String toString() => 'ActivityEntry($title, $time, $status)';
}
