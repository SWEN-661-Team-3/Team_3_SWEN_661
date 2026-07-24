import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CareMemberDetailDialog from '../components/CareMemberDetailDialog';
import { ROUTES } from '../routes';

const availabilityLabels = {
  available: 'Available',
  away: 'Away',
  offline: 'Offline',
};

export default function CaregiverDetailPage({ helpers, setHelpers }) {
  const { caregiverId } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const caregiver = helpers.find((helper) => helper.id === caregiverId);

  if (!caregiver) {
    return (
      <div className="main-content">
        <section aria-labelledby="caregiver-not-found-heading">
          <h1 id="caregiver-not-found-heading" className="page-title">Caregiver Not Found</h1>
          <p>We could not find a care team member with that ID.</p>
          <Link to={ROUTES.careTeam} className="secondary-btn">
            Back to Care Team
          </Link>
        </section>
      </div>
    );
  }

  function saveCaregiver(updatedCaregiver) {
    setHelpers((current) => current.map((helper) => (
      helper.id === updatedCaregiver.id ? updatedCaregiver : helper
    )));
    setEditOpen(false);
    return true;
  }

  function removeCaregiver(id) {
    setHelpers((current) => current.filter((helper) => helper.id !== id));
    navigate(ROUTES.careTeam);
  }

  return (
    <>
      <Helmet>
        <title>{`${caregiver.name} - Care Team - CareConnect`}</title>
        <meta name="description" content={`View and edit care team details for ${caregiver.name}.`} />
      </Helmet>

      <div className="main-content">
        <Link to={ROUTES.careTeam} className="secondary-btn caregiver-detail__back">
          Back to Care Team
        </Link>

        <section aria-labelledby="caregiver-detail-heading">
          <h1 id="caregiver-detail-heading" className="page-title">{caregiver.name}</h1>
          <p className="care-team-subtitle">{caregiver.role}</p>

          <dl className="detail-list caregiver-detail__list">
            <div className="detail-row">
              <dt className="detail-row__label">Relationship</dt>
              <dd className="detail-row__value">{caregiver.relationship}</dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Availability</dt>
              <dd className="detail-row__value">
                <span className={`availability-badge availability-badge--${caregiver.availability}`}>
                  {availabilityLabels[caregiver.availability]}
                </span>
              </dd>
            </div>
            <div className="detail-row">
              <dt className="detail-row__label">Phone</dt>
              <dd className="detail-row__value">{caregiver.phone}</dd>
            </div>
            {caregiver.notes && (
              <div className="detail-row">
                <dt className="detail-row__label">Notes</dt>
                <dd className="detail-row__value">{caregiver.notes}</dd>
              </div>
            )}
          </dl>

          <button type="button" className="primary-btn" onClick={() => setEditOpen(true)}>
            Edit Details
          </button>
        </section>
      </div>

      <CareMemberDetailDialog
        key={caregiver.id}
        member={caregiver}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={saveCaregiver}
        onRemove={removeCaregiver}
      />
    </>
  );
}
