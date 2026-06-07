import 'dart:io';

void main() {
  final lcovFile = File('coverage/lcov.info');
  if (!lcovFile.existsSync()) {
    print('Run "flutter test --coverage" first.');
    exit(1);
  }

  final lines = lcovFile.readAsLinesSync();
  final records = <Map<String, dynamic>>[];
  Map<String, dynamic>? current;
  int totalLF = 0, totalLH = 0;

  for (final line in lines) {
    if (line.startsWith('SF:')) {
      current = {'file': line.substring(3), 'lf': 0, 'lh': 0, 'lines': <int, int>{}};
    } else if (line.startsWith('DA:') && current != null) {
      final parts = line.substring(3).split(',');
      final lineNum = int.parse(parts[0]);
      final hits = int.parse(parts[1]);
      (current['lines'] as Map<int, int>)[lineNum] = hits;
    } else if (line.startsWith('LF:') && current != null) {
      current['lf'] = int.parse(line.substring(3));
    } else if (line.startsWith('LH:') && current != null) {
      current['lh'] = int.parse(line.substring(3));
    } else if (line == 'end_of_record' && current != null) {
      totalLF += current['lf'] as int;
      totalLH += current['lh'] as int;
      records.add(current);
      current = null;
    }
  }

  records.sort((a, b) => (a['file'] as String).compareTo(b['file'] as String));
  final pct = totalLF > 0 ? (totalLH / totalLF * 100).toStringAsFixed(1) : '0.0';

  final buf = StringBuffer();
  buf.writeln('<!DOCTYPE html><html><head><meta charset="utf-8">');
  buf.writeln('<title>CareConnect Coverage Report</title>');
  buf.writeln('<style>');
  buf.writeln('body{font-family:system-ui,sans-serif;margin:24px;background:#f8f9fa}');
  buf.writeln('h1{color:#1a1a2e}');
  buf.writeln('.summary{font-size:20px;margin:16px 0;padding:16px;background:#fff;border-radius:8px;border:1px solid #dee2e6}');
  buf.writeln('table{border-collapse:collapse;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)}');
  buf.writeln('th{background:#1a1a2e;color:#fff;padding:12px 16px;text-align:left}');
  buf.writeln('td{padding:10px 16px;border-bottom:1px solid #eee}');
  buf.writeln('tr:hover{background:#f5f5f5}');
  buf.writeln('.bar{height:16px;border-radius:4px;background:#e9ecef;position:relative;min-width:100px}');
  buf.writeln('.fill{height:100%;border-radius:4px;position:absolute;top:0;left:0}');
  buf.writeln('.high{background:#28a745}.med{background:#ffc107}.low{background:#dc3545}');
  buf.writeln('.pct{font-weight:bold}');
  buf.writeln('</style></head><body>');
  buf.writeln('<h1>CareConnect Test Coverage Report</h1>');
  buf.writeln('<div class="summary">Overall: <span class="pct">$pct%</span> ($totalLH / $totalLF lines)</div>');
  buf.writeln('<table><tr><th>File</th><th>Lines</th><th>Hit</th><th>Coverage</th><th></th></tr>');

  for (final r in records) {
    final lf = r['lf'] as int;
    final lh = r['lh'] as int;
    final fp = lf > 0 ? (lh / lf * 100).toStringAsFixed(1) : '0.0';
    final cls = double.parse(fp) >= 80 ? 'high' : (double.parse(fp) >= 50 ? 'med' : 'low');
    buf.writeln('<tr><td>${r['file']}</td><td>$lf</td><td>$lh</td>');
    buf.writeln('<td class="pct">$fp%</td>');
    buf.writeln('<td><div class="bar"><div class="fill $cls" style="width:$fp%"></div></div></td></tr>');
  }

  buf.writeln('</table></body></html>');

  final outDir = Directory('coverage/html');
  if (!outDir.existsSync()) outDir.createSync(recursive: true);
  File('coverage/html/index.html').writeAsStringSync(buf.toString());
  print('Coverage report: coverage/html/index.html ($pct%)');
}
