import SettingsPage from './SettingsPage';

// This route-level wrapper gives notification settings an independently lazy
// route while reusing the existing settings UI and state model.
export default function NotificationSettingsPage(props) {
  return <SettingsPage {...props} />;
}
