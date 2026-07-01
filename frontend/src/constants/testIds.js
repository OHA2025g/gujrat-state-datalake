// Centralized test IDs (kebab-case)
export const AUTH = {
  loginUsername: 'login-username-input',
  loginPassword: 'login-password-input',
  loginSubmit: 'login-submit-button',
  loginRoleTab: (r) => `login-role-tab-${r}`,
  mfaInput: 'mfa-otp-input',
  mfaVerify: 'mfa-verify-button',
  logoutBtn: 'header-logout-button',
};

export const NAV_TID = {
  toggle: 'sidebar-toggle-button',
  link: (id) => `sidebar-link-${id}`,
  group: (id) => `sidebar-group-${id}`,
  globalSearch: 'global-search-input',
  cmdOpen: 'command-bar-open-button',
  notifBtn: 'header-notif-button',
  copilotOpen: 'header-copilot-open',
};

export const PAGE = {
  header: 'page-header',
  toolbar: 'page-toolbar',
  kpi: (k) => `kpi-card-${k}`,
  chartCard: (k) => `chart-card-${k}`,
  table: (k) => `data-table-${k}`,
};

export const COPILOT = {
  panel: 'copilot-panel',
  input: 'copilot-input',
  send: 'copilot-send-button',
  msg: (i) => `copilot-message-${i}`,
  suggest: (i) => `copilot-suggestion-${i}`,
};
