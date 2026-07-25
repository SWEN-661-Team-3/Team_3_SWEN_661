import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import { getCarePlan } from '../services/carePlanService';
import { getCareTeam } from '../services/careTeamService';
import { getSettings } from '../services/settingsService';
import { initialPlan, caregivers } from '../data/careData';
import { defaultSettings } from '../services/settingsService';

jest.mock('../services/carePlanService', () => ({ getCarePlan: jest.fn() }));
jest.mock('../services/careTeamService', () => ({ getCareTeam: jest.fn() }));
jest.mock('../services/settingsService', () => ({
  defaultSettings: { largeText: false, highContrast: false, darkTheme: false, reduceMotion: true },
  getSettings: jest.fn(),
}));

function renderApp(route = '/today') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function resolveInitialData({ plan = initialPlan, team = caregivers, settings = defaultSettings } = {}) {
  getCarePlan.mockResolvedValue(plan.map((item) => ({ ...item })));
  getCareTeam.mockResolvedValue(team.map((item) => ({ ...item })));
  getSettings.mockResolvedValue({ ...settings });
}

describe('initial application data states', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a route-appropriate status while the Today plan is loading', () => {
    getCarePlan.mockImplementation(() => new Promise(() => {}));
    getCareTeam.mockImplementation(() => new Promise(() => {}));
    getSettings.mockImplementation(() => new Promise(() => {}));

    renderApp('/today');
    expect(screen.getByRole('status')).toHaveTextContent("Loading today's plan...");
  });

  it.each([
    ['/care-team', 'Loading care team...'],
    ['/settings', 'Loading settings...'],
    ['/emergency', 'Loading emergency contacts...'],
  ])('uses a route-appropriate status for %s', (route, message) => {
    getCarePlan.mockImplementation(() => new Promise(() => {}));
    getCareTeam.mockImplementation(() => new Promise(() => {}));
    getSettings.mockImplementation(() => new Promise(() => {}));

    renderApp(route);
    expect(screen.getByRole('status')).toHaveTextContent(message);
  });

  it('renders empty care-plan and care-team states when the services return no records', async () => {
    resolveInitialData({ plan: [], team: [] });

    renderApp('/today');
    expect(await screen.findByRole('heading', { name: 'No reminders yet', level: 2 })).toBeInTheDocument();

    renderApp('/care-team');
    expect(await screen.findByRole('heading', { name: 'No care-team members yet', level: 2 })).toBeInTheDocument();
  });

  it('shows a retryable global error and loads after retry', async () => {
    const user = userEvent.setup();
    getCarePlan.mockRejectedValueOnce(new Error('Service unavailable'));
    getCareTeam.mockResolvedValue(caregivers.map((item) => ({ ...item })));
    getSettings.mockResolvedValue({ ...defaultSettings });

    renderApp('/today');
    expect(await screen.findByRole('alert')).toHaveTextContent('CareConnect could not load your session data.');

    getCarePlan.mockResolvedValue(initialPlan.map((item) => ({ ...item })));
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(await screen.findByRole('heading', { name: "Today's Plan", level: 1 })).toBeInTheDocument();
  });

  it.each([
    ['care plan', () => getCarePlan],
    ['care team', () => getCareTeam],
    ['settings', () => getSettings],
  ])('shows the shared failure state when the %s service rejects', async (_name, getService) => {
    resolveInitialData();
    getService().mockRejectedValueOnce(new Error('Service unavailable'));

    renderApp('/today');
    expect(await screen.findByRole('alert')).toHaveTextContent('CareConnect could not load your session data.');
  });
});
