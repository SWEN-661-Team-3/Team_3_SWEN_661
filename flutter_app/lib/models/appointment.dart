class Appointment {
  final String id;
  final String title;
  final String date;
  final String time;
  final String location;
  final String notes;
  final String type;
  final String status;
  final String? actionLabel;

  const Appointment({
    required this.id,
    required this.title,
    required this.date,
    required this.time,
    this.location = '',
    this.notes = '',
    this.type = 'appointment',
    this.status = 'todo',
    this.actionLabel,
  });

  Appointment copyWith({
    String? id,
    String? title,
    String? date,
    String? time,
    String? location,
    String? notes,
    String? type,
    String? status,
    String? actionLabel,
  }) {
    return Appointment(
      id: id ?? this.id,
      title: title ?? this.title,
      date: date ?? this.date,
      time: time ?? this.time,
      location: location ?? this.location,
      notes: notes ?? this.notes,
      type: type ?? this.type,
      status: status ?? this.status,
      actionLabel: actionLabel ?? this.actionLabel,
    );
  }

  @override
  String toString() => 'Appointment($title, $time, $status)';
}
