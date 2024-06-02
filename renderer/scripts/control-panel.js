const urlInput = document.getElementById('url-input');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const reloadBtn = document.getElementById('reload-btn');
const newTabBtn = document.getElementById('new-tab-btn');
const tabsDiv = document.getElementById('tabs');

let currentTabId = 1;

document.addEventListener('DOMContentLoaded', () => {
  window.electron.createTab('https://www.google.com'); 
});

newTabBtn.addEventListener('click', () => {
  const url = urlInput.value || 'https://www.google.com';
  window.electron.createTab(url);
});

window.electron.onTabCreated((tabId, url) => {
  const tabElement = document.createElement('div');
  tabElement.textContent = url;
  tabElement.dataset.tabId = tabId;
  tabElement.classList.add('tab');
  tabsDiv.appendChild(tabElement);

  urlInput.value = url;
});

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const url = urlInput.value;
      const activeTabElement = document.querySelector(`.tab[data-tab-id="${currentTabId}"]`);
      if (activeTabElement) {
        activeTabElement.textContent = url; 
      }
      window.electron.navigate(currentTabId, url);
    }
});

backBtn.addEventListener('click', () => {
  window.electron.tabAction(currentTabId, 'back');
});

forwardBtn.addEventListener('click', () => {
  window.electron.tabAction(currentTabId, 'forward');
});

reloadBtn.addEventListener('click', () => {
  window.electron.tabAction(currentTabId, 'reload');
});

window.electron.onNavigate((tabId, url) => {
  const tabElement = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
  if (tabElement) {
    urlInput.value = url;
  }
});