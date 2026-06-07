class Reminder {
  final String id;
  final String title;
  final String dueTime;
  final String type;
  final String? instructions;
  final String? relatedAppointment;
  final String? relatedAppointmentTime;
  final String status;

  const Reminder({
    required this.id,
    required this.title,
    required this.dueTime,
    this.type = 'medication',
    this.instructions,
    this.relatedAppointment,
    this.relatedAppointmentTime,
    this.status = 'pending',
  });

  Reminder copyWith({
    String? id,
    String? title,
    String? dueTime,
    String? type,
    String? instructions,
    String? relatedAppointment,
    String? relatedAppointmentTime,
    String? status,
  }) {
    return Reminder(
      id: id ?? this.id,
      title: title ?? this.title,
      dueTime: dueTime ?? this.dueTime,
      type: type ?? this.type,
      instructions: instructions ?? this.instructions,
      relatedAppointment: relatedAppointment ?? this.relatedAppointment,
      relatedAppointmentTime: relatedAppointmentTime ?? this.relatedAppointmentTime,
      status: status ?? this.status,
    );
  }

  @override
  String toString() => 'Reminder($title, $dueTime, $status)';
}
