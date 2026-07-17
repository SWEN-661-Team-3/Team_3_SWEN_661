import { Helmet } from 'react-helmet-async';
import EmergencyPanel from '../components/EmergencyPanel';

export default function EmergencyPage({ contacts }) {
  return (
    <>
      <Helmet>
        <title>Emergency - CareConnect</title>
        <meta name="description" content="Send an emergency alert to your care team contacts." />
        <meta property="og:title" content="Emergency Help - CareConnect" />
        <meta property="og:description" content="Get help quickly by alerting your emergency contacts." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="app-layout app-layout--wide">
        <main id="main-content" role="main" aria-label="Emergency help">
          <div className="main-content">
            <EmergencyPanel contacts={contacts} />
          </div>
        </main>
      </div>
    </>
  );
}
