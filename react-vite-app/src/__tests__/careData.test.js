import { caregivers, initialPlan, statusLabels, typeLabels, typeOptions } from '../data/careData';

describe('careData', () => {
  describe('caregivers', () => {
    it('contains three caregivers', () => {
      expect(caregivers).toHaveLength(3);
    });

    it('each caregiver has the required fields', () => {
      const requiredFields = ['id', 'name', 'relationship', 'role', 'availability', 'phone', 'notes', 'initials', 'colorIndex'];
      caregivers.forEach((caregiver) => {
        requiredFields.forEach((field) => {
          expect(caregiver).toHaveProperty(field);
        });
      });
    });

    it('has valid availability values', () => {
      const validValues = ['available', 'away', 'offline'];
      caregivers.forEach((c) => {
        expect(validValues).toContain(c.availability);
      });
    });
  });

  describe('initialPlan', () => {
    it('contains six tasks', () => {
      expect(initialPlan).toHaveLength(6);
    });

    it('each task has the required fields', () => {
      const requiredFields = ['id', 'title', 'date', 'time', 'type', 'status', 'actionLabel'];
      initialPlan.forEach((task) => {
        requiredFields.forEach((field) => {
          expect(task).toHaveProperty(field);
        });
      });
    });

    it('tasks have valid status values', () => {
      initialPlan.forEach((task) => {
        expect(['done', 'todo']).toContain(task.status);
      });
    });

    it('tasks have valid type values', () => {
      const validTypes = ['medication', 'appointment', 'health-task'];
      initialPlan.forEach((task) => {
        expect(validTypes).toContain(task.type);
      });
    });

    it('first task is marked done', () => {
      expect(initialPlan[0].status).toBe('done');
    });
  });

  describe('statusLabels', () => {
    it('has entries for done and todo', () => {
      expect(statusLabels.done).toEqual({ label: 'Done', icon: '\u2713' });
      expect(statusLabels.todo).toEqual({ label: 'Pending', icon: '\u25F7' });
    });
  });

  describe('typeLabels', () => {
    it('has entries for all task types', () => {
      expect(typeLabels.medication).toEqual({ label: 'Medication', icon: 'Rx' });
      expect(typeLabels.appointment).toEqual({ label: 'Appointment', icon: 'Cal' });
      expect(typeLabels['health-task']).toEqual({ label: 'Health Task', icon: 'H' });
    });
  });

  describe('typeOptions', () => {
    it('has three options for the type select', () => {
      expect(typeOptions).toHaveLength(3);
    });

    it('each option has value and label', () => {
      typeOptions.forEach((option) => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
      });
    });
  });
});
