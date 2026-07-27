import { screen } from '@testing-library/react';
import EmergencyPage from '../pages/EmergencyPage';
import { renderWithProviders } from './testUtils';

const contacts = [
  { id: 'sarah', name: 'Sarah Johnson', relationship: 'Helper', phone: '(555) 234-5678', initials: 'SJ' },
  { id: 'drsmith', name: 'Dr. Emily Smith', relationship: 'Doctor', phone: '(555) 891-2345', initials: 'ES' },
];

describe('EmergencyPage', () => {
  it('renders the page heading', () => {
    renderWithProviders(<EmergencyPage contacts={contacts} />);
    expect(screen.getByText('Emergency')).toBeInTheDocument();
  });

  it('renders the emergency panel', () => {
    renderWithProviders(<EmergencyPage contacts={contacts} />);
    expect(screen.getByText('Need Help?')).toBeInTheDocument();
    expect(screen.getByText('Get Help Now')).toBeInTheDocument();
  });

  it('displays emergency contacts', () => {
    renderWithProviders(<EmergencyPage contacts={contacts} />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Dr. Emily Smith')).toBeInTheDocument();
  });

  it('leaves the main landmark to the shared layout', () => {
    renderWithProviders(<EmergencyPage contacts={contacts} />);
    expect(document.getElementById('main-content')).not.toBeInTheDocument();
  });
});
