let sidebarOpen = false;
let sidebar;
let currentTooltip = null;
let modalRoot = null;

function createSidebar() {
  sidebar = document.createElement('iframe');
  sidebar.src = chrome.runtime.getURL('index.html');
  sidebar.style.cssText = `
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100%;
    z-index: 9999;
    border: none;
    transition: right 0.3s ease-in-out;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  `;
  document.body.appendChild(sidebar);
}

function toggleSidebar() {
  if (!sidebar) {
    createSidebar();
  }
  
  sidebarOpen = !sidebarOpen;
  sidebar.style.right = sidebarOpen ? '0' : '-300px';
}

function createModalRoot() {
  modalRoot = document.createElement('div');
  modalRoot.id = 'invoice-modal-root';
  document.body.appendChild(modalRoot);
}

function showInvoiceModal(invoice) {
  if (!modalRoot) {
    createModalRoot();
  }

  const modalOverlay = document.createElement('div');
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2147483647;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    height: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  `;

  modalContent.innerHTML = `
    <h2>Invoice #${invoice.id}</h2>
    <p>Amount: ₹${invoice.amount.toLocaleString()}</p>
    <p>Status: ${invoice.status}</p>
    <p>Due Date: ${invoice.dueDate}</p>
    <button id="close-modal" style="position: absolute; top: 10px; right: 10px; font-size: 24px; background: none; border: none; cursor: pointer;">&times;</button>
    <iframe src="${chrome.runtime.getURL('Resume_New.pdf')}" style="width: 100%; height: 100%; border: none; flex-grow: 1;"></iframe>
  `;

  modalOverlay.appendChild(modalContent);
  modalRoot.appendChild(modalOverlay);

  document.getElementById('close-modal').addEventListener('click', () => {
    modalRoot.removeChild(modalOverlay);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle_sidebar") {
    toggleSidebar();
  } 
});

// This will be injected into the webpage
window.addEventListener('message', function(event) {
  if (event.data.type === 'SHOW_INVOICE_MODAL') {
    const { invoice } = event.data;
    showInvoiceModal(invoice);
  }
});

// Create the sidebar and modal root when the content script loads
createSidebar();
createModalRoot();
