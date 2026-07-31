import { memo, useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CareMemberDetailDialog from '../components/CareMemberDetailDialog';
import CareConnectDialog from '../components/CareConnectDialog';
import EmptyState from '../components/EmptyState';
import { saveCaregiver } from '../services/careTeamService';

const HELPER_COLORS = ['#1d4ed8', '#046c50', '#9333ea', '#c2410c', '#0e7490'];
const availabilityLabels = {
  available: 'Available',
  away: 'Away',
  offline: 'Offline',
};

// Cards are repeated for every team member. Memoization lets unchanged cards
// keep their rendered output while dialog-only state changes in this page.
const CareTeamMemberCard = memo(function CareTeamMemberCard({ helper, onSelectMember }) {
  return (
    <button
      type="button"
      className="care-helper-card"
      onClick={(event) => onSelectMember(helper.id, event)}
      aria-label={`${helper.name}, ${helper.role}`}
    >
      <div className="care-helper-card__header" aria-hidden="true">
        <span
          className="care-helper-card__avatar"
          style={{ '--helper-color': HELPER_COLORS[helper.colorIndex % HELPER_COLORS.length] }}
          aria-hidden="true"
        >
          {helper.initials}
        </span>
        <div>
          <p className="care-helper-card__name">{helper.name}</p>
          <p className="care-helper-card__role">{helper.role}</p>
        </div>
      </div>

      <span className={`availability-badge availability-badge--${helper.availability}`} aria-hidden="true">
        {availabilityLabels[helper.availability]}
      </span>

      <div className="care-helper-card__details" aria-hidden="true">
        <p className="care-helper-card__phone">
          <span className="care-helper-card__meta-label">Phone: </span>
          {helper.phone}
        </p>
        {helper.notes && <p className="care-helper-card__notes">{helper.notes}</p>}
        <p className="care-helper-card__hint">Click to view and edit details</p>
      </div>
    </button>
  );
});

export default function CareTeamPage({ helpers, setHelpers }) {
  const [selectedId, setSelectedId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draftMember, setDraftMember] = useState(null);
  const [saveNotice, setSaveNotice] = useState(null);
  const statusRef = useRef(null);
  const memberTriggerRef = useRef(null);

  const announce = useCallback((message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  }, []);

  const isAddingMember = selectedId === 'new';
  const selectedMember = isAddingMember
    ? draftMember
    : helpers.find((helper) => helper.id === selectedId) ?? null;

  const openMemberDetail = useCallback((id, event) => {
    memberTriggerRef.current = event?.currentTarget ?? null;
    setSelectedId(id);
    setDetailOpen(true);
    // The dialog heading receives focus on open, so a second polite
    // “opened” announcement would repeat context already conveyed by focus.
  }, []);

  function closeMemberDetail() {
    setDetailOpen(false);
    setSelectedId(null);
    setDraftMember(null);
    requestAnimationFrame(() => {
      if (memberTriggerRef.current?.isConnected && !memberTriggerRef.current.disabled) {
        memberTriggerRef.current.focus();
      } else {
        document.getElementById('main-content')?.focus();
      }
    });
  }

  function closeSaveNotice() {
    setSaveNotice(null);
    requestAnimationFrame(() => {
      const trigger = memberTriggerRef.current;
      if (trigger?.isConnected && !trigger.disabled) {
        trigger.focus();
      } else {
        document.getElementById('main-content')?.focus();
      }
    });
  }

  async function saveMember(updatedMember) {
    const savedMember = await saveCaregiver(updatedMember);
    if (isAddingMember) {
      setHelpers((prev) => [...prev, savedMember]);
      announce(`${savedMember.name} added to the care team`);
      setSaveNotice({
        title: `${savedMember.name} Added`,
        message: `${savedMember.name} was added.`,
      });
    } else {
      setHelpers((prev) => (
        prev.map((helper) => (helper.id === savedMember.id ? savedMember : helper))
      ));
      announce(`Saved details for ${savedMember.name}`);
      setSaveNotice({
        title: `${updatedMember.name} Saved`,
        message: `${updatedMember.name} was saved.`,
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

  function openAddMember(event) {
    memberTriggerRef.current = event?.currentTarget ?? null;
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

      <div className="main-content main-content--wide">
            <div className="care-team-header">
              <div>
                <h1 id="care-team-heading" className="page-title">Care Team</h1>
                <p className="care-team-subtitle">
                  Your helpers, doctors, and family contacts.
                </p>
              </div>
              <button type="button" className="primary-btn" onClick={openAddMember}>
                Add Member
              </button>
            </div>

            {helpers.length === 0 ? (
              <EmptyState
                title="No care-team members yet"
                message="Add a helper, doctor, or family contact so their details are available when you need them."
                action={(
                  <button type="button" className="primary-btn" onClick={openAddMember}>
                    Add Member
                  </button>
                )}
              />
            ) : (
              <section
                className="care-team-grid"
                aria-label="Team members"
              >
                {helpers.map((helper) => (
                <CareTeamMemberCard
                  key={helper.id}
                  helper={helper}
                  onSelectMember={openMemberDetail}
                />
                ))}
              </section>
            )}

            <div
              ref={statusRef}
              className="visually-hidden"
              aria-live="polite"
              aria-atomic="true"
            />
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
        variant="success"
        onConfirm={closeSaveNotice}
      />
    </>
  );
}
