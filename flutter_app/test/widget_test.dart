import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/main.dart';

void main() {
  testWidgets('Hello World displays correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('Hello World!'), findsOneWidget);
    expect(find.text('SWEN 661 - Team 3'), findsOneWidget);
    expect(find.text('SWEN 661 - Flutter App'), findsOneWidget);
  });
}
