import { Helmet } from 'react-helmet-async';

const HELPER_COLORS = ['#1d4ed8', '#046c50', '#9333ea', '#c2410c', '#0e7490'];

export default function CareTeamPage({ helpers }) {
  return (
    <>
      <Helmet>
        <title>Care Team - CareConnect</title>
        <meta name="description" content="View your care team members including helpers, doctors, and family contacts." />
        <meta property="og:title" content="Care Team - CareConnect" />
        <meta property="og:description" content="Your care team contacts and availability." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="app-layout app-layout--wide">
        <main id="main-content" role="main" aria-label="Care team members">
          <div className="main-content main-content--wide">
            <div className="care-team-header">
              <div>
                <h2>Care Team</h2>
                <p className="care-team-subtitle">
                  Your helpers, doctors, and family contacts.
                </p>
              </div>
            </div>

            <section
              className="care-team-grid"
              aria-label="Team members"
            >
              {helpers.map((helper) => (
                <article
                  key={helper.id}
                  className="care-helper-card"
                  aria-label={`${helper.name}, ${helper.role}`}
                >
                  <div className="care-helper-card__header">
                    <span
                      className="care-helper-card__avatar"
                      style={{ '--helper-color': HELPER_COLORS[helper.colorIndex % HELPER_COLORS.length] }}
                      aria-hidden="true"
                    >
                      {helper.initials}
                    </span>
                    <div>
                      <h3 className="care-helper-card__name">{helper.name}</h3>
                      <p className="care-helper-card__role">{helper.role}</p>
                    </div>
                  </div>

                  <span className={`availability-badge availability-badge--${helper.availability}`}>
                    {helper.availability === 'available' ? 'Available' :
                     helper.availability === 'away' ? 'Away' : 'Offline'}
                  </span>

                  <div className="care-helper-card__details">
                    <p className="care-helper-card__phone">
                      <span className="care-helper-card__meta-label">Phone: </span>
                      {helper.phone}
                    </p>
                    {helper.notes && (
                      <p className="care-helper-card__notes">{helper.notes}</p>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
