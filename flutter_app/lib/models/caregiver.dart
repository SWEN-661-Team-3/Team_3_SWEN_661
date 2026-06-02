class Caregiver {
  final String id;
  final String name;
  final String relationship;
  final String phone;
  final List<String> permissions;

  const Caregiver({
    required this.id,
    required this.name,
    required this.relationship,
    this.phone = '',
    this.permissions = const ['appointments', 'reminders', 'help'],
  });

  Caregiver copyWith({
    String? id,
    String? name,
    String? relationship,
    String? phone,
    List<String>? permissions,
  }) {
    return Caregiver(
      id: id ?? this.id,
      name: name ?? this.name,
      relationship: relationship ?? this.relationship,
      phone: phone ?? this.phone,
      permissions: permissions ?? this.permissions,
    );
  }

  @override
  String toString() => 'Caregiver($name, $relationship)';
}
