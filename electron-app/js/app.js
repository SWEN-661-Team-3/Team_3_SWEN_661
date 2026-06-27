import { caregivers, initialPlan, statusLabels, typeLabels } from './data.js';

const helperColors = ['#1d4ed8', '#046c50', '#9a4708', '#7c3aed', '#db2777', '#0891b2'];

const availabilityLabels = {
  available: 'Available',
  busy: 'Busy',
  offline: 'Offline',
};

const state = {
  view: 'today',
  plan: structuredClone(initialPlan),
  helpers: structuredClone(caregivers),
  selectedId: null,
  editingHelperId: null,
  removingHelperId: null,
  helperFormInitialValues: null,
  settings: {
    largeText: false,
    highContrast: false,
    darkMode: false,
    reduceMotion: true,
  },
};

const els = {
  appLayout: document.getElementById('app-layout'),
  mainContent: document.getElementById('main-content'),
  todaysPlanView: document.getElementById('todays-plan-view'),
  careTeamView: document.getElementById('care-team-view'),
  careTeamSubtitle: document.getElementById('care-team-subtitle'),
  careTeamEmpty: document.getElementById('care-team-empty'),
  careTeamGrid: document.getElementById('care-team-grid'),
  addHelperBtn: document.getElementById('add-helper-btn'),
  taskList: document.getElementById('task-list'),
  heroCard: document.getElementById('hero-card'),
  heroTitle: document.getElementById('hero-title'),
  heroTime: document.getElementById('hero-time'),
  statDone: document.getElementById('stat-done'),
  statPending: document.getElementById('stat-pending'),
  helperName: document.getElementById('helper-name'),
  searchBar: document.getElementById('search-bar'),
  searchInput: document.getElementById('search-input'),
  searchClose: document.getElementById('search-close'),
  detailDialog: document.getElementById('detail-dialog'),
  detailBody: document.getElementById('detail-dialog-body'),
  detailDialogFooter: document.getElementById('detail-dialog-footer'),
  completeTaskBtn: document.getElementById('complete-task-btn'),
  settingsDialog: document.getElementById('settings-dialog'),
  confirmationDialog: document.getElementById('confirmation-dialog'),
  confirmationDialogTitle: document.getElementById('confirmation-dialog-title'),
  confirmationTitle: document.getElementById('confirmation-title'),
  confirmationMessage: document.getElementById('confirmation-message'),
  helperDialog: document.getElementById('helper-dialog'),
  helperForm: document.getElementById('helper-form'),
  helperDialogTitle: document.getElementById('helper-dialog-title'),
  helperCloseBtn: document.getElementById('helper-close-btn'),
  helperNameInput: document.getElementById('helper-name-input'),
  helperRoleInput: document.getElementById('helper-role-input'),
  helperPhoneInput: document.getElementById('helper-phone-input'),
  helperNotesInput: document.getElementById('helper-notes-input'),
  helperSaveBtn: document.getElementById('helper-save-btn'),
  discardHelperDialog: document.getElementById('discard-helper-dialog'),
  discardHelperCloseBtn: document.getElementById('discard-helper-close-btn'),
  confirmDiscardHelperBtn: document.getElementById('confirm-discard-helper-btn'),
  removeHelperDialog: document.getElementById('remove-helper-dialog'),
  removeHelperMessage: document.getElementById('remove-helper-message'),
  confirmRemoveHelperBtn: document.getElementById('confirm-remove-helper-btn'),
  helpDialog: document.getElementById('help-dialog'),
  accessibilityBtn: document.getElementById('accessibility-btn'),
  shortcutsBtn: document.getElementById('shortcuts-btn'),
  statusLive: document.getElementById('status-live'),
  settingLargeText: document.getElementById('setting-large-text'),
  settingHighContrast: document.getElementById('setting-high-contrast'),
  settingDarkMode: document.getElementById('setting-dark-mode'),
  settingReduceMotion: document.getElementById('setting-reduce-motion'),
};

function getNextTask() {
  return state.plan.find((item) => item.status === 'todo') ?? state.plan[0];
}

function getTaskById(id) {
  return state.plan.find((item) => item.id === id);
}

function getCompletedCount() {
  return state.plan.filter((item) => item.status === 'done').length;
}

function getPendingCount() {
  return state.plan.filter((item) => item.status === 'todo').length;
}

function announce(message) {
  els.statusLive.textContent = message;
}

function getHelperById(id) {
  return state.helpers.find((helper) => helper.id === id);
}

function getHelperColor(helper) {
  return helperColors[helper.colorIndex % helperColors.length];
}

function getHelperInitials(name) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return initials || 'H';
}

function renderHelperSummary() {
  const helper = state.helpers.find((item) => item.availability === 'available') ?? state.helpers[0];
  if (!helper) {
    els.helperName.textContent = 'No helper added';
    return;
  }

  els.helperName.textContent = `${helper.name} is ${availabilityLabels[helper.availability]?.toLowerCase() ?? 'available'}`;
}

function renderCareTeam() {
  const count = state.helpers.length;
  els.careTeamSubtitle.textContent = count === 0
    ? 'No helpers added yet.'
    : `${count} helper${count === 1 ? '' : 's'} on your care team.`;

  els.careTeamEmpty.hidden = count > 0;
  els.careTeamGrid.hidden = count === 0;
  els.careTeamGrid.innerHTML = '';

  state.helpers.forEach((helper) => {
    const availability = availabilityLabels[helper.availability] ?? availabilityLabels.available;
    const card = document.createElement('article');
    card.className = 'care-helper-card';
    card.setAttribute('role', 'listitem');
    card.style.setProperty('--helper-color', getHelperColor(helper));

    card.innerHTML = `
      <div class="care-helper-card__header">
        <span class="care-helper-card__avatar" aria-hidden="true">${escapeHtml(helper.initials)}</span>
        <div>
          <h3 class="care-helper-card__name">${escapeHtml(helper.name)}</h3>
          <p class="care-helper-card__role">${escapeHtml(helper.role || 'Helper')}</p>
        </div>
      </div>
      <div class="care-helper-card__details">
        <span class="availability-badge availability-badge--${escapeHtml(helper.availability || 'available')}">${escapeHtml(availability)}</span>
        ${helper.phone ? `
        <p class="care-helper-card__phone">
          <span class="care-helper-card__meta-label">Phone:</span>
          ${escapeHtml(helper.phone)}
        </p>` : ''}
        ${helper.notes ? `<p class="care-helper-card__notes">${escapeHtml(helper.notes)}</p>` : ''}
      </div>
      <div class="care-helper-card__actions">
        <button type="button" class="care-helper-card__action care-helper-card__action--edit" data-helper-action="edit" data-helper-id="${escapeHtml(helper.id)}">
          Edit
        </button>
        <button type="button" class="care-helper-card__action care-helper-card__action--remove" data-helper-action="remove" data-helper-id="${escapeHtml(helper.id)}">
          Remove
        </button>
      </div>
    `;

    els.careTeamGrid.appendChild(card);
  });
}

function renderStats() {
  const done = getCompletedCount();
  const total = state.plan.length;
  els.statDone.textContent = `${done}/${total}`;
  els.statPending.textContent = String(getPendingCount());
}

function renderHero() {
  const next = getNextTask();
  if (!next) return;

  const location = next.location || 'Home';
  els.heroTitle.textContent = next.title;
  els.heroTime.textContent = `${next.time} · ${location}`;
  els.heroCard.dataset.taskId = next.id;
}

function renderTaskList(filter = '') {
  const query = filter.trim().toLowerCase();
  els.taskList.innerHTML = '';

  state.plan
    .filter((item) => {
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.time.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    })
    .forEach((item) => {
      const li = document.createElement('li');
      li.className = 'task-list__item';
      li.setAttribute('role', 'listitem');

      const status = statusLabels[item.status] ?? statusLabels.todo;
      const type = typeLabels[item.type] ?? { label: item.type, icon: '•' };

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `task-list__btn${item.status === 'done' ? ' task-list__btn--done' : ''}${state.selectedId === item.id ? ' task-list__btn--selected' : ''}`;
      btn.dataset.taskId = item.id;
      btn.setAttribute(
        'aria-label',
        `${item.title}, ${item.time}, ${status.label}, ${type.label}`,
      );

      btn.innerHTML = `
        <span class="task-list__status" aria-hidden="true">${status.icon}</span>
        <span>
          <p class="task-list__title">${escapeHtml(item.title)}</p>
          <p class="task-list__time">${escapeHtml(item.time)} · ${escapeHtml(type.label)}</p>
        </span>
      `;

      btn.addEventListener('click', () => openTaskDetail(item.id));
      li.appendChild(btn);
      els.taskList.appendChild(li);
    });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function openTaskDetail(id) {
  const task = getTaskById(id);
  if (!task) return;

  state.selectedId = id;
  renderTaskList(els.searchInput.value);

  const status = statusLabels[task.status] ?? statusLabels.todo;
  const type = typeLabels[task.type] ?? { label: task.type, icon: '•' };
  const location = task.location || 'Home';

  els.detailBody.innerHTML = `
    <div class="detail-row">
      <p class="detail-row__label">Status</p>
      <p class="detail-row__value">
        <span class="status-badge status-badge--${task.status}">
          <span aria-hidden="true">${status.icon}</span>
          ${escapeHtml(status.label)}
        </span>
      </p>
    </div>
    <div class="detail-row">
      <p class="detail-row__label">Type</p>
      <p class="detail-row__value">
        <span aria-hidden="true">${type.icon}</span>
        ${escapeHtml(type.label)}
      </p>
    </div>
    <div class="detail-row">
      <p class="detail-row__label">Time</p>
      <p class="detail-row__value">${escapeHtml(task.time)}</p>
    </div>
    <div class="detail-row">
      <p class="detail-row__label">Location</p>
      <p class="detail-row__value">${escapeHtml(location)}</p>
    </div>
    ${task.notes ? `
    <div class="detail-row">
      <p class="detail-row__label">Notes</p>
      <p class="detail-row__value">${escapeHtml(task.notes)}</p>
    </div>` : ''}
  `;

  const taskIsDone = task.status === 'done';
  els.detailDialogFooter.hidden = taskIsDone;
  els.completeTaskBtn.hidden = taskIsDone;
  if (taskIsDone) {
    delete els.completeTaskBtn.dataset.taskId;
  } else {
    els.completeTaskBtn.dataset.taskId = id;
  }
  document.getElementById('detail-dialog-title').textContent = task.title;

  els.detailDialog.showModal();
  announce(`Opened details for ${task.title}`);
}

function openConfirmation(dialogTitle, title, message) {
  els.confirmationDialogTitle.textContent = dialogTitle;
  els.confirmationTitle.textContent = title;
  els.confirmationMessage.textContent = message;
  if (!els.confirmationDialog.open) els.confirmationDialog.showModal();
  announce(`${title}. ${message}`);
}

function syncHelperSaveButton() {
  els.helperSaveBtn.disabled = els.helperNameInput.value.trim().length === 0;
}

function getHelperFormValues() {
  return {
    name: els.helperNameInput.value,
    role: els.helperRoleInput.value,
    phone: els.helperPhoneInput.value,
    notes: els.helperNotesInput.value,
  };
}

function isHelperFormDirty() {
  if (!state.helperFormInitialValues) return false;

  const current = getHelperFormValues();
  return Object.keys(current).some((key) => current[key] !== state.helperFormInitialValues[key]);
}

function closeHelperDialogWithoutSaving() {
  state.helperFormInitialValues = null;
  state.editingHelperId = null;
  els.helperDialog.close('cancel');
}

function openDiscardHelperDialog() {
  if (!els.discardHelperDialog.open) els.discardHelperDialog.showModal();
}

function requestCloseHelperDialog() {
  if (isHelperFormDirty()) {
    openDiscardHelperDialog();
    return;
  }

  closeHelperDialogWithoutSaving();
}

function openHelperDialog(helperId = null) {
  const helper = helperId ? getHelperById(helperId) : null;
  state.editingHelperId = helper?.id ?? null;

  els.helperDialogTitle.textContent = helper ? 'Edit helper' : 'Add helper';
  els.helperSaveBtn.textContent = helper ? 'Save changes' : 'Add helper';
  els.helperNameInput.value = helper?.name ?? '';
  els.helperRoleInput.value = helper?.role ?? '';
  els.helperPhoneInput.value = helper?.phone ?? '';
  els.helperNotesInput.value = helper?.notes ?? '';
  els.helperDialog.returnValue = '';
  state.helperFormInitialValues = getHelperFormValues();
  syncHelperSaveButton();

  if (!els.helperDialog.open) els.helperDialog.showModal();
  els.helperNameInput.focus();
  els.helperNameInput.select();
}

function saveHelper() {
  if (els.helperNameInput.value.trim().length === 0) {
    els.helperNameInput.reportValidity();
    return;
  }

  const existing = state.editingHelperId ? getHelperById(state.editingHelperId) : null;
  const helper = {
    id: existing?.id ?? `helper-${Date.now()}`,
    name: els.helperNameInput.value.trim(),
    role: els.helperRoleInput.value.trim() || 'Helper',
    relationship: els.helperRoleInput.value.trim() || 'Helper',
    availability: existing?.availability ?? 'available',
    phone: els.helperPhoneInput.value.trim(),
    notes: els.helperNotesInput.value.trim(),
    initials: getHelperInitials(els.helperNameInput.value),
    colorIndex: existing?.colorIndex ?? state.helpers.length,
  };

  if (existing) {
    state.helpers = state.helpers.map((item) => (item.id === existing.id ? helper : item));
    announce(`${helper.name} updated`);
  } else {
    state.helpers = [...state.helpers, helper];
    announce(`${helper.name} added to care team`);
  }

  els.helperDialog.close('default');
  state.helperFormInitialValues = null;
  state.editingHelperId = null;
  renderHelperSummary();
  renderCareTeam();
}

function openRemoveHelperDialog(helperId) {
  const helper = getHelperById(helperId);
  if (!helper) return;

  state.removingHelperId = helper.id;
  els.removeHelperMessage.textContent = `Are you sure you want to remove ${helper.name} from your care team? This cannot be undone.`;
  els.removeHelperDialog.returnValue = '';
  if (!els.removeHelperDialog.open) els.removeHelperDialog.showModal();
}

function removeHelper() {
  const helper = getHelperById(state.removingHelperId);
  if (!helper) return;

  state.helpers = state.helpers.filter((item) => item.id !== helper.id);
  state.removingHelperId = null;
  els.removeHelperDialog.close('default');
  renderHelperSummary();
  renderCareTeam();
  announce(`${helper.name} removed from care team`);
}

function completeTask(id) {
  const task = getTaskById(id);
  if (!task || task.status === 'done') return;

  task.status = 'done';
  renderAll();
  els.detailDialog.close();
  openConfirmation(task.title, 'Marked Complete', `${task.title} is done. Nice work!`);
}

function renderAll() {
  renderHero();
  renderStats();
  renderTaskList(els.searchInput.value);
  renderHelperSummary();
  renderCareTeam();
  renderViews();
}

function renderViews() {
  const isCareTeam = state.view === 'careteam';

  els.todaysPlanView.hidden = isCareTeam;
  els.careTeamView.hidden = !isCareTeam;
  els.appLayout.classList.toggle('app-layout--care-team', isCareTeam);
  els.mainContent.classList.toggle('main-content--wide', isCareTeam);

  document.querySelectorAll('[data-action="view-todays-plan"], [data-action="view-care-team"]').forEach((btn) => {
    const isActive =
      (state.view === 'today' && btn.dataset.action === 'view-todays-plan') ||
      (state.view === 'careteam' && btn.dataset.action === 'view-care-team');

    btn.classList.toggle('toolbar-btn--active', isActive);
    if (isActive) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });
}

function setView(view) {
  state.view = view;
  if (view === 'careteam') closeSearch();
  renderViews();
  els.mainContent.focus();
  announce(view === 'careteam' ? 'Showing care team' : "Showing today's plan");
}

function openSearch() {
  if (state.view !== 'today') setView('today');
  els.searchBar.hidden = false;
  els.searchInput.focus();
  els.searchInput.select();
}

function closeSearch() {
  els.searchBar.hidden = true;
  els.searchInput.value = '';
  renderTaskList();
}

function getSettingsFromInputs() {
  return {
    largeText: els.settingLargeText.checked,
    highContrast: els.settingHighContrast.checked,
    darkMode: els.settingDarkMode.checked,
    reduceMotion: els.settingReduceMotion.checked,
  };
}

function setSettingsInputs(settings) {
  els.settingLargeText.checked = settings.largeText;
  els.settingHighContrast.checked = settings.highContrast;
  els.settingDarkMode.checked = settings.darkMode;
  els.settingReduceMotion.checked = settings.reduceMotion;
}

function normalizeThemeSelection(settings) {
  if (settings.highContrast) {
    return { ...settings, darkMode: false };
  }

  return settings;
}

function applySettingsToBody(settings) {
  document.body.classList.toggle('large-text', settings.largeText);
  document.body.classList.toggle('dark-mode', settings.darkMode);
  document.body.classList.toggle('high-contrast', settings.highContrast);
  document.body.classList.toggle('reduce-motion', settings.reduceMotion);
}

function previewSettings() {
  const preview = normalizeThemeSelection(getSettingsFromInputs());
  setSettingsInputs(preview);
  applySettingsToBody(preview);
}

function openSettings() {
  setSettingsInputs(state.settings);
  applySettingsToBody(state.settings);
  els.settingsDialog.returnValue = '';
  if (!els.settingsDialog.open) els.settingsDialog.showModal();
}

function openHelp() {
  if (!els.helpDialog.open) els.helpDialog.showModal();
}

function saveSettings() {
  state.settings = normalizeThemeSelection(getSettingsFromInputs());
  setSettingsInputs(state.settings);
  applySettingsToBody(state.settings);
  openConfirmation(
    'Accessibility settings',
    'Settings Saved',
    'Your accessibility preferences have been updated.',
  );
}

function revertSettingsPreview() {
  setSettingsInputs(state.settings);
  applySettingsToBody(state.settings);
  announce('Settings changes discarded');
}

function handleMenuAction(action) {
  switch (action) {
    case 'new-record':
      announce('New appointment — coming in Week 8');
      break;
    case 'save':
      announce("Today's plan saved");
      break;
    case 'search':
      openSearch();
      break;
    case 'view-todays-plan':
      setView('today');
      break;
    case 'view-care-team':
      setView('careteam');
      break;
    case 'open-settings':
      openSettings();
      break;
    case 'help':
    case 'shortcuts':
      openHelp();
      break;
    default:
      break;
  }
}

function initToolbar() {
  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'emergency') {
        announce('Emergency help — alert sent to caregivers');
        return;
      }
      handleMenuAction(action);
    });
  });
}

function initEvents() {
  els.heroCard.addEventListener('click', () => {
    const id = els.heroCard.dataset.taskId;
    if (id) openTaskDetail(id);
  });

  els.heroCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const id = els.heroCard.dataset.taskId;
      if (id) openTaskDetail(id);
    }
  });

  els.completeTaskBtn.addEventListener('click', () => {
    completeTask(els.completeTaskBtn.dataset.taskId);
  });

  els.searchInput.addEventListener('input', () => renderTaskList(els.searchInput.value));
  els.searchClose.addEventListener('click', closeSearch);
  els.addHelperBtn.addEventListener('click', () => openHelperDialog());
  els.helperNameInput.addEventListener('input', syncHelperSaveButton);
  els.helperCloseBtn.addEventListener('click', requestCloseHelperDialog);
  els.helperDialog.addEventListener('cancel', (e) => {
    if (!isHelperFormDirty()) return;

    e.preventDefault();
    openDiscardHelperDialog();
  });
  els.helperForm.addEventListener('submit', (e) => {
    if (e.submitter?.value === 'cancel') return;

    e.preventDefault();
    saveHelper();
  });
  els.helperSaveBtn.addEventListener('click', saveHelper);
  els.confirmDiscardHelperBtn.addEventListener('click', () => {
    els.discardHelperDialog.close('default');
    closeHelperDialogWithoutSaving();
  });
  els.discardHelperCloseBtn.addEventListener('click', () => {
    els.discardHelperDialog.close('cancel');
    els.helperNameInput.focus();
  });
  els.confirmRemoveHelperBtn.addEventListener('click', removeHelper);

  els.careTeamGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-helper-action]');
    if (!btn) return;

    const helperId = btn.dataset.helperId;
    if (btn.dataset.helperAction === 'edit') {
      openHelperDialog(helperId);
      return;
    }

    if (btn.dataset.helperAction === 'remove') {
      openRemoveHelperDialog(helperId);
    }
  });

  els.settingsDialog.addEventListener('close', () => {
    if (els.settingsDialog.returnValue === 'default') {
      saveSettings();
      return;
    }

    revertSettingsPreview();
  });

  els.settingLargeText.addEventListener('change', previewSettings);

  els.settingHighContrast.addEventListener('change', () => {
    if (els.settingHighContrast.checked) els.settingDarkMode.checked = false;
    previewSettings();
  });

  els.settingDarkMode.addEventListener('change', () => {
    if (els.settingDarkMode.checked) els.settingHighContrast.checked = false;
    previewSettings();
  });

  els.settingReduceMotion.addEventListener('change', previewSettings);

  els.accessibilityBtn.addEventListener('click', openSettings);
  els.shortcutsBtn.addEventListener('click', openHelp);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
      e.preventDefault();
      openHelp();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === '1') {
      e.preventDefault();
      setView('today');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === '2') {
      e.preventDefault();
      setView('careteam');
      return;
    }

    if (e.key === 'Escape' && !els.searchBar.hidden) {
      closeSearch();
    }
  });

  if (window.careConnect?.onMenuAction) {
    window.careConnect.onMenuAction(handleMenuAction);
  }
}

function init() {
  const helper = caregivers[0]?.name ?? 'Helper';
  els.helperName.textContent = `${helper} is available`;
  applySettingsToBody(state.settings);
  initToolbar();
  initEvents();
  renderAll();
}

init();
