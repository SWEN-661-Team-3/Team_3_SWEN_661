import { buildTodaysPlanText } from '../planExport';

describe('planExport', () => {
  it("formats today's plan for a text file", () => {
    const planText = buildTodaysPlanText([
      {
        title: 'Eye Doctor Checkup',
        time: '10:30 AM',
        location: 'City Eye Clinic',
        notes: 'Bring glasses.',
        type: 'appointment',
      },
      {
        title: 'Nighttime Eye Drops',
        time: '9:00 PM',
        location: '',
        notes: '',
        type: 'medication',
      },
    ]);

    expect(planText).toBe(
      "Today's Plan\n"
      + 'Appointment - Eye Doctor Checkup\n'
      + '10:30 AM\n'
      + 'City Eye Clinic\n'
      + 'Bring glasses.\n\n'
      + 'Medication - Nighttime Eye Drops\n'
      + '9:00 PM',
    );
  });

  it('uses fallback labels and ignores non-string values', () => {
    const planText = buildTodaysPlanText([
      {
        title: '  Lab pickup  ',
        time: '  ',
        location: null,
        notes: 42,
        type: '  lab-work  ',
      },
      {
        title: 123,
        time: undefined,
        location: '  Home  ',
        notes: '',
        type: undefined,
      },
    ]);

    expect(planText).toBe(
      "Today's Plan\n"
      + 'lab-work - Lab pickup\n\n'
      + 'Reminder - \n'
      + 'Home',
    );
  });
});
