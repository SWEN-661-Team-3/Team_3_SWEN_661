export default function AppFooter({ isEmergency = false }) {
  return (
    <footer className="app-footer">
      <p>CareConnect &mdash; Helping you manage daily care with confidence.</p>
      <ul className="app-footer__links">
        <li><a href="#accessibility-statement" tabIndex={isEmergency ? -1 : undefined}>Accessibility</a></li>
        <li><a href="#privacy-policy" tabIndex={isEmergency ? -1 : undefined}>Privacy Policy</a></li>
        <li><a href="#contact-support" tabIndex={isEmergency ? -1 : undefined}>Support</a></li>
      </ul>
    </footer>
  );
}
