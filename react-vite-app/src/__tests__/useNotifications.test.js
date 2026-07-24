import { renderHook, act } from '@testing-library/react';
import useNotifications from '../hooks/useNotifications';

describe('useNotifications', () => {
  let originalNotification;

  beforeEach(() => {
    originalNotification = window.Notification;
    window.Notification = jest.fn(function (title, options) {
      this.title = title;
      this.body = options?.body;
    });
    window.Notification.permission = 'default';
    window.Notification.requestPermission = jest.fn(() =>
      Promise.resolve('granted'),
    );
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {},
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    window.Notification = originalNotification;
    jest.restoreAllMocks();
  });

  it('returns the expected shape', () => {
    const { result } = renderHook(() => useNotifications([]));
    expect(result.current).toHaveProperty('supported');
    expect(result.current).toHaveProperty('enabled');
    expect(result.current).toHaveProperty('permission');
    expect(result.current).toHaveProperty('toggle');
    expect(typeof result.current.toggle).toBe('function');
  });

  it('starts disabled', () => {
    const { result } = renderHook(() => useNotifications([]));
    expect(result.current.enabled).toBe(false);
  });

  it('reports supported when Notification and serviceWorker exist', () => {
    const { result } = renderHook(() => useNotifications([]));
    expect(result.current.supported).toBe(true);
  });

  it('requests permission and enables on toggle', async () => {
    window.Notification.permission = 'default';
    window.Notification.requestPermission = jest.fn(() =>
      Promise.resolve('granted'),
    );

    const { result } = renderHook(() => useNotifications([]));

    await act(async () => {
      result.current.toggle();
    });

    expect(window.Notification.requestPermission).toHaveBeenCalled();
    expect(result.current.enabled).toBe(true);
  });

  it('disables on second toggle', async () => {
    window.Notification.permission = 'default';
    window.Notification.requestPermission = jest.fn(() =>
      Promise.resolve('granted'),
    );

    const { result } = renderHook(() => useNotifications([]));

    await act(async () => {
      result.current.toggle();
    });
    expect(result.current.enabled).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.enabled).toBe(false);
  });

  it('does not enable if permission is denied', async () => {
    window.Notification.requestPermission = jest.fn(() =>
      Promise.resolve('denied'),
    );

    const { result } = renderHook(() => useNotifications([]));

    await act(async () => {
      result.current.toggle();
    });

    expect(result.current.enabled).toBe(false);
    expect(result.current.permission).toBe('denied');
  });

  it('schedules notifications for upcoming tasks when enabled', async () => {
    jest.useFakeTimers();
    window.Notification.permission = 'default';
    window.Notification.requestPermission = jest.fn(() => {
      window.Notification.permission = 'granted';
      return Promise.resolve('granted');
    });

    const now = new Date();
    const futureHour = now.getHours() + 1;
    const period = futureHour >= 12 ? 'PM' : 'AM';
    const displayHour = futureHour > 12 ? futureHour - 12 : futureHour;
    const timeStr = `${displayHour}:00 ${period}`;

    const tasks = [
      { id: '1', title: 'Take Medicine', time: timeStr, status: 'todo' },
    ];

    const { result } = renderHook(() => useNotifications(tasks));

    await act(async () => {
      result.current.toggle();
    });

    expect(result.current.enabled).toBe(true);
    jest.useRealTimers();
  });
});
