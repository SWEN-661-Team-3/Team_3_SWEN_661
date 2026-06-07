class ReminderPreferences {
  final bool sound;
  final bool vibration;
  final bool persistent;
  final bool repeat;
  final bool caregiverNotify;
  final bool quietHours;
  final String timing;

  const ReminderPreferences({
    this.sound = true,
    this.vibration = true,
    this.persistent = false,
    this.repeat = true,
    this.caregiverNotify = false,
    this.quietHours = true,
    this.timing = 'on-time',
  });

  ReminderPreferences copyWith({
    bool? sound,
    bool? vibration,
    bool? persistent,
    bool? repeat,
    bool? caregiverNotify,
    bool? quietHours,
    String? timing,
  }) {
    return ReminderPreferences(
      sound: sound ?? this.sound,
      vibration: vibration ?? this.vibration,
      persistent: persistent ?? this.persistent,
      repeat: repeat ?? this.repeat,
      caregiverNotify: caregiverNotify ?? this.caregiverNotify,
      quietHours: quietHours ?? this.quietHours,
      timing: timing ?? this.timing,
    );
  }

  Map<String, dynamic> toJson() => {
        'sound': sound,
        'vibration': vibration,
        'persistent': persistent,
        'repeat': repeat,
        'caregiverNotify': caregiverNotify,
        'quietHours': quietHours,
        'timing': timing,
      };

  factory ReminderPreferences.fromJson(Map<String, dynamic> json) {
    return ReminderPreferences(
      sound: json['sound'] as bool? ?? true,
      vibration: json['vibration'] as bool? ?? true,
      persistent: json['persistent'] as bool? ?? false,
      repeat: json['repeat'] as bool? ?? true,
      caregiverNotify: json['caregiverNotify'] as bool? ?? false,
      quietHours: json['quietHours'] as bool? ?? true,
      timing: json['timing'] as String? ?? 'on-time',
    );
  }

  @override
  String toString() => 'ReminderPreferences(sound=$sound, timing=$timing)';
}
