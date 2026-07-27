import { validateCaregiver, validateReminder } from '../utils/formValidation';

describe('validateReminder', () => {
  const validReminder = {
    title: 'Eye appointment',
    date: 'Today',
    time: '10:30 AM',
    type: 'appointment',
    location: 'Clinic',
    notes: 'Bring glasses',
  };

  it('returns no errors for a valid reminder', () => {
    expect(validateReminder(validReminder)).toEqual({});
  });

  it('returns field-specific errors for blank, malformed, and missing values', () => {
    const errors = validateReminder({
      ...validReminder,
      title: '   ',
      date: 'not a date',
      time: '25:00',
      location: ' ',
    });

    expect(errors).toEqual(expect.objectContaining({
      title: expect.stringMatching(/title/i),
      date: expect.stringMatching(/valid date/i),
      time: expect.stringMatching(/time/i),
      location: expect.stringMatching(/location/i),
    }));
  });

  it('enforces sensible title and notes limits', () => {
    const errors = validateReminder({
      ...validReminder,
      title: 'a'.repeat(121),
      notes: 'b'.repeat(1001),
    });

    expect(errors.title).toMatch(/120/);
    expect(errors.notes).toMatch(/1000/);
  });
});

describe('validateCaregiver', () => {
  const validCaregiver = {
    name: 'Sarah Johnson',
    relationship: 'Helper',
    phone: '(555) 234-5678',
    email: 'sarah@example.com',
  };

  it('returns no errors for a valid caregiver', () => {
    expect(validateCaregiver(validCaregiver)).toEqual({});
  });

  it('rejects whitespace-only required fields, implausible phone numbers, and invalid optional email', () => {
    const errors = validateCaregiver({
      name: ' ',
      relationship: '  ',
      phone: '123',
      email: 'not-an-email',
    });

    expect(errors).toEqual(expect.objectContaining({
      name: expect.stringMatching(/name/i),
      relationship: expect.stringMatching(/relationship/i),
      phone: expect.stringMatching(/7 digits/i),
      email: expect.stringMatching(/valid email/i),
    }));
  });

  it('allows a blank optional email address', () => {
    expect(validateCaregiver({ ...validCaregiver, email: '   ' })).toEqual({});
  });
});
