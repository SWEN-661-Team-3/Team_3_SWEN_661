import { caregivers, initialPlan, statusLabels, typeLabels } from './data.js';

const state = {
  plan: structuredClone(initialPlan),
  selectedId: null,
  settings: {
    largeText: false,
    highContrast: false,
    reduceMotion: true,
  },
};

const els = {
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
  completeTaskBtn: document.getElementById('complete-task-btn'),
  settingsDialog: document.getElementById('settings-dialog'),
  helpDialog: document.getElementById('help-dialog'),
  accessibilityBtn: document.getElementById('accessibility-btn'),
  statusLive: document.getElementById('status-live'),
  settingLargeText: document.getElementById('setting-large-text'),
  settingHighContrast: document.getElementById('setting-high-contrast'),
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

  els.completeTaskBtn.hidden = task.status === 'done';
  els.completeTaskBtn.dataset.taskId = id;
  document.getElementById('detail-dialog-title').textContent = task.title;

  els.detailDialog.showModal();
  announce(`Opened details for ${task.title}`);
}

function completeTask(id) {
  const task = getTaskById(id);
  if (!task || task.status === 'done') return;

  task.status = 'done';
  renderAll();
  els.detailDialog.close();
  announce(`${task.title} marked complete`);
}

function renderAll() {
  renderHero();
  renderStats();
  renderTaskList(els.searchInput.value);
}

function openSearch() {
  els.searchBar.hidden = false;
  els.searchInput.focus();
  els.searchInput.select();
}

function closeSearch() {
  els.searchBar.hidden = true;
  els.searchInput.value = '';
  renderTaskList();
}

function openSettings() {
  els.settingLargeText.checked = state.settings.largeText;
  els.settingHighContrast.checked = state.settings.highContrast;
  els.settingReduceMotion.checked = state.settings.reduceMotion;
  els.settingsDialog.showModal();
}

function applySettings() {
  state.settings.largeText = els.settingLargeText.checked;
  state.settings.highContrast = els.settingHighContrast.checked;
  state.settings.reduceMotion = els.settingReduceMotion.checked;

  document.body.classList.toggle('large-text', state.settings.largeText);
  document.body.classList.toggle('high-contrast', state.settings.highContrast);
  announce('Settings saved');
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
      document.getElementById('main-content').focus();
      announce("Showing today's plan");
      break;
    case 'open-settings':
      openSettings();
      break;
    case 'help':
    case 'shortcuts':
      els.helpDialog.showModal();
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

  els.settingsDialog.addEventListener('close', () => {
    if (els.settingsDialog.returnValue === 'default') applySettings();
  });

  els.accessibilityBtn.addEventListener('click', openSettings);

  document.addEventListener('keydown', (e) => {
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
  initToolbar();
  initEvents();
  renderAll();
}

init();
