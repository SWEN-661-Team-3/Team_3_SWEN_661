import { useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CareMemberDetailDialog from '../components/CareMemberDetailDialog';
import CareConnectDialog from '../components/CareConnectDialog';

const HELPER_COLORS = ['#1d4ed8', '#046c50', '#9333ea', '#c2410c', '#0e7490'];
const availabilityLabels = {
  available: 'Available',
  away: 'Away',
  offline: 'Offline',
};

export default function CareTeamPage({ helpers, setHelpers }) {
  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draftMember, setDraftMember] = useState(null);
  const [saveNotice, setSaveNotice] = useState(null);
  const statusRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  const isAddingMember = selectedId === 'new';
  const selectedMember = isAddingMember
    ? draftMember
    : helpers.find((helper) => helper.id === selectedId) ?? null;

  function openMemberDetail(id) {
    setSelectedId(id);
    setDetailOpen(true);
    const member = helpers.find((helper) => helper.id === id);
    if (member) announce(`Opened details for ${member.name}`);
  }

  function closeMemberDetail() {
    setDetailOpen(false);
    setSelectedId(null);
    setDraftMember(null);
  }

  function saveMember(updatedMember) {
    if (isAddingMember) {
      setHelpers((prev) => [...prev, updatedMember]);
      announce(`${updatedMember.name} added to the care team`);
      setSaveNotice({
        title: 'Care Team Member Added',
        message: 'Care team member was added.',
      });
    } else {
      setHelpers((prev) =>
        prev.map((helper) => (helper.id === updatedMember.id ? updatedMember : helper)),
      );
      announce(`Saved details for ${updatedMember.name}`);
      setSaveNotice({
        title: 'Care Team Member Saved',
        message: 'Care team member was saved.',
      });
    }
    setDetailOpen(false);
    setSelectedId(null);
    setDraftMember(null);
    return true;
  }

  function removeMember(id) {
    const member = helpers.find((helper) => helper.id === id);
    setHelpers((prev) => prev.filter((helper) => helper.id !== id));
    setDetailOpen(false);
    setSelectedId(null);
    setDraftMember(null);
    if (member) announce(`${member.name} removed from the care team`);
  }

  function openAddMember() {
    setDraftMember({
      id: `care-member-${Date.now()}`,
      name: '',
      relationship: 'Helper',
      role: '',
      availability: 'available',
      phone: '',
      notes: '',
      initials: '',
      colorIndex: helpers.length,
    });
    setSelectedId('new');
    setDetailOpen(true);
    announce('Opened add care team member form');
  }

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
        <main id="main-content" aria-label="Care team members">
          <div className="main-content main-content--wide">
            <div className="care-team-header">
              <div>
                <h1 className="page-title">Care Team</h1>
                <p className="care-team-subtitle">
                  Your helpers, doctors, and family contacts.
                </p>
              </div>
              <button type="button" className="primary-btn" onClick={openAddMember}>
                Add Member
              </button>
            </div>

            <section
              className="care-team-grid"
              aria-label="Team members"
            >
              {helpers.map((helper) => (
                <button
                  type="button"
                  key={helper.id}
                  className="care-helper-card"
                  onClick={() => openMemberDetail(helper.id)}
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
                    {availabilityLabels[helper.availability]}
                  </span>

                  <div className="care-helper-card__details">
                    <p className="care-helper-card__phone">
                      <span className="care-helper-card__meta-label">Phone: </span>
                      {helper.phone}
                    </p>
                    {helper.notes && (
                      <p className="care-helper-card__notes">{helper.notes}</p>
                    )}
                    <p className="care-helper-card__hint">Click to view and edit details</p>
                  </div>
                </button>
              ))}
            </section>

            <div
              ref={statusRef}
              className="visually-hidden"
              aria-live="polite"
              aria-atomic="true"
            />
          </div>
        </main>
      </div>

      <CareMemberDetailDialog
        key={selectedMember?.id ?? 'closed'}
        member={selectedMember}
        open={detailOpen}
        mode={isAddingMember ? 'add' : 'view'}
        onClose={closeMemberDetail}
        onSave={saveMember}
        onRemove={removeMember}
      />

      <CareConnectDialog
        open={Boolean(saveNotice)}
        title={saveNotice?.title ?? ''}
        message={saveNotice?.message ?? ''}
        onConfirm={() => setSaveNotice(null)}
      />
    </>
  );
}
