import { caregivers, initialPlan, statusLabels, typeLabels, typeOptions } from '../data';

describe('data module', () => {
  describe('caregivers', () => {
    it('exports an array of caregivers', () => {
      expect(Array.isArray(caregivers)).toBe(true);
      expect(caregivers.length).toBeGreaterThan(0);
    });

    it('each caregiver has required fields', () => {
      caregivers.forEach((c) => {
        expect(c).toHaveProperty('id');
        expect(c).toHaveProperty('name');
        expect(c).toHaveProperty('relationship');
        expect(c).toHaveProperty('phone');
      });
    });

    it('uses supported availability statuses', () => {
      caregivers.forEach((c) => {
        expect(['available', 'away', 'offline']).toContain(c.availability);
      });
    });
  });

  describe('initialPlan', () => {
    it('exports an array of plan items', () => {
      expect(Array.isArray(initialPlan)).toBe(true);
      expect(initialPlan.length).toBe(6);
    });

    it('each item has required fields', () => {
      initialPlan.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('time');
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('status');
      });
    });

    it('contains at least one done item', () => {
      const done = initialPlan.filter((i) => i.status === 'done');
      expect(done.length).toBeGreaterThan(0);
    });

    it('contains at least one todo item', () => {
      const todo = initialPlan.filter((i) => i.status === 'todo');
      expect(todo.length).toBeGreaterThan(0);
    });

    it('has valid types', () => {
      const validTypes = ['medication', 'appointment', 'health-task'];
      initialPlan.forEach((item) => {
        expect(validTypes).toContain(item.type);
      });
    });
  });

  describe('statusLabels', () => {
    it('has done and todo labels', () => {
      expect(statusLabels.done).toEqual({ label: 'Done', icon: '\u2713' });
      expect(statusLabels.todo).toEqual({ label: 'Pending', icon: '\u25F7' });
    });
  });

  describe('typeLabels', () => {
    it('has medication, appointment, and health-task labels', () => {
      expect(typeLabels.medication.label).toBe('Medication');
      expect(typeLabels.appointment.label).toBe('Appointment');
      expect(typeLabels['health-task'].label).toBe('Health Task');
    });
  });

  describe('typeOptions', () => {
    it('exports an array of options for select inputs', () => {
      expect(typeOptions.length).toBe(3);
      typeOptions.forEach((opt) => {
        expect(opt).toHaveProperty('value');
        expect(opt).toHaveProperty('label');
      });
    });
  });
});
