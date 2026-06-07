class AccessibilitySettings {
  final String textSize;
  final String contrast;
  final String theme;
  final String spacing;
  final String motion;
  final String screenReader;

  const AccessibilitySettings({
    this.textSize = 'large',
    this.contrast = 'standard',
    this.theme = 'light',
    this.spacing = 'standard',
    this.motion = 'reduced',
    this.screenReader = 'off',
  });

  AccessibilitySettings copyWith({
    String? textSize,
    String? contrast,
    String? theme,
    String? spacing,
    String? motion,
    String? screenReader,
  }) {
    return AccessibilitySettings(
      textSize: textSize ?? this.textSize,
      contrast: contrast ?? this.contrast,
      theme: theme ?? this.theme,
      spacing: spacing ?? this.spacing,
      motion: motion ?? this.motion,
      screenReader: screenReader ?? this.screenReader,
    );
  }

  Map<String, dynamic> toJson() => {
        'textSize': textSize,
        'contrast': contrast,
        'theme': theme,
        'spacing': spacing,
        'motion': motion,
        'screenReader': screenReader,
      };

  factory AccessibilitySettings.fromJson(Map<String, dynamic> json) {
    return AccessibilitySettings(
      textSize: json['textSize'] as String? ?? 'large',
      contrast: json['contrast'] as String? ?? 'standard',
      theme: json['theme'] as String? ?? 'light',
      spacing: json['spacing'] as String? ?? 'standard',
      motion: json['motion'] as String? ?? 'reduced',
      screenReader: json['screenReader'] as String? ?? 'off',
    );
  }

  List<String> get activeLabels {
    final labels = <String>[];
    if (textSize == 'extra-large') labels.add('Extra Large Text');
    if (textSize == 'large') labels.add('Large Text');
    if (contrast == 'high') labels.add('High Contrast Colors');
    if (theme == 'dark') labels.add('Dark Mode');
    if (spacing == 'wide') labels.add('Wide Spacing');
    if (motion == 'reduced') labels.add('Reduced Motion');
    if (screenReader == 'on') labels.add('Screen Reader Support');
    return labels;
  }

  @override
  String toString() => 'AccessibilitySettings($textSize, $contrast, $theme)';
}
