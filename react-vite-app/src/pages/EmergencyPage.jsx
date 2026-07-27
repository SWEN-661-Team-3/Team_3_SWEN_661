import { Helmet } from 'react-helmet-async';
import EmergencyPanel from '../components/EmergencyPanel';

export default function EmergencyPage({ contacts }) {
  function returnFocusToMenu(event) {
    if (event.key !== 'Tab' || event.shiftKey) return;
    event.preventDefault();
    document.querySelector('.menu-toggle')?.focus();
  }

  return (
    <>
      <Helmet>
        <title>Emergency - CareConnect</title>
        <meta name="description" content="Send an emergency alert to your care team contacts." />
        <meta property="og:title" content="Emergency Help - CareConnect" />
        <meta property="og:description" content="Get help quickly by alerting your emergency contacts." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="main-content main-content--wide emergency-page">
        <div className="page-header">
          <h1 id="emergency-page-heading" className="page-title">Emergency</h1>
        </div>
        <EmergencyPanel contacts={contacts} onActionKeyDown={returnFocusToMenu} />
      </div>
    </>
  );
}
