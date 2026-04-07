"use strict";
/**
 * app.ts - Main Application Entry Point
 *
 * This file initializes the application, sets up event listeners,
 * and connects all modules together. It serves as the controller
 * that orchestrates interactions between the UI and data layers.
 */
// ==================== Current View State ====================
/**
 * Tracks the current active view/section of the application.
 */
let currentView = 'all-items';
// ==================== Navigation Handlers ====================
/**
 * Switches the active view and updates the display accordingly.
 * @param view - The view identifier to switch to
 */
function switchView(view) {
    currentView = view;
    clearMessage();
    // Update active navigation button
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn) => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('nav-' + view);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    // Render the appropriate view
    switch (view) {
        case 'add-item':
            renderAddForm();
            // Clear the display area
            const displayArea = document.getElementById('display-area');
            if (displayArea)
                displayArea.innerHTML = '';
            break;
        case 'all-items':
            renderAllItems();
            break;
        case 'popular-items':
            renderPopularItems();
            break;
        case 'search':
            renderSearchArea();
            // Clear the display area
            const searchDisplay = document.getElementById('display-area');
            if (searchDisplay)
                searchDisplay.innerHTML = '';
            break;
        default:
            renderAllItems();
    }
}
// ==================== Display Functions ====================
/**
 * Renders all items in the inventory to the display area.
 */
function renderAllItems() {
    // Hide the form container
    const formContainer = document.getElementById('form-container');
    if (formContainer)
        formContainer.innerHTML = '';
    const items = getAllItems();
    renderItemsTable(items, 'display-area', 'All Inventory Items');
}
/**
 * Renders only popular items to the display area.
 */
function renderPopularItems() {
    // Hide the form container
    const formContainer = document.getElementById('form-container');
    if (formContainer)
        formContainer.innerHTML = '';
    const items = getPopularItems();
    renderItemsTable(items, 'display-area', 'Popular Items');
}
// ==================== CRUD Event Handlers ====================
/**
 * Handles the Add Item button click.
 * Reads form data, validates, and adds to inventory.
 */
function handleAddItem() {
    const formData = getFormData();
    // Build the complete item object
    const newItem = {
        itemId: formData.itemId,
        itemName: formData.itemName,
        category: formData.category,
        quantity: formData.quantity,
        price: formData.price,
        supplierName: formData.supplierName,
        stockStatus: formData.stockStatus,
        popularItem: formData.popularItem,
        comment: formData.comment
    };
    const result = addItem(newItem);
    if (result.success) {
        showSuccess(result.message);
        clearForm();
    }
    else {
        showError(result.message);
    }
}
/**
 * Handles clicking the Edit button on a table row.
 * Switches to the edit form pre-filled with the item's current data.
 * @param itemName - The name of the item to edit
 */
function handleEditClick(itemName) {
    const item = findItemByName(itemName);
    if (!item) {
        showError(`Item "${itemName}" not found.`);
        return;
    }
    // Switch to the add-item view but render the edit form
    currentView = 'add-item';
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn) => btn.classList.remove('active'));
    const addBtn = document.getElementById('nav-add-item');
    if (addBtn)
        addBtn.classList.add('active');
    renderEditForm(item);
    // Clear display area
    const displayArea = document.getElementById('display-area');
    if (displayArea)
        displayArea.innerHTML = '';
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
/**
 * Handles the Update Item button click (in edit mode).
 * Reads updated form data and applies the update.
 */
function handleUpdateItem() {
    const originalName = getInputValue('original-name');
    const formData = getFormData();
    // Build updates object
    const updates = {
        itemId: formData.itemId,
        itemName: formData.itemName,
        category: formData.category,
        quantity: formData.quantity,
        price: formData.price,
        supplierName: formData.supplierName,
        stockStatus: formData.stockStatus,
        popularItem: formData.popularItem,
        comment: formData.comment
    };
    const result = updateItem(originalName, updates);
    if (result.success) {
        showSuccess(result.message);
        // Switch back to show all items
        switchView('all-items');
    }
    else {
        showError(result.message);
    }
}
/**
 * Handles clicking the Delete button on a table row.
 * Shows confirmation dialog (using innerHTML, not alert).
 * @param itemName - The name of the item to delete
 */
function handleDeleteClick(itemName) {
    renderDeleteConfirmation(itemName);
}
/**
 * Confirms and executes the deletion of an item.
 * Called from the confirmation modal's "Yes, Delete" button.
 * @param itemName - The name of the item to delete
 */
function confirmDelete(itemName) {
    const result = deleteItem(itemName);
    closeModal();
    if (result.success) {
        showSuccess(result.message);
        // Refresh the current view
        if (currentView === 'all-items') {
            renderAllItems();
        }
        else if (currentView === 'popular-items') {
            renderPopularItems();
        }
    }
    else {
        showError(result.message);
    }
}
/**
 * Handles the Search button click.
 * Searches by item name and displays results.
 */
function handleSearch() {
    const searchTerm = getInputValue('input-search');
    if (!searchTerm) {
        showError("Please enter a search term.");
        return;
    }
    const results = searchByName(searchTerm);
    if (results.length === 0) {
        showError(`No items found matching "${searchTerm}".`);
        const displayArea = document.getElementById('display-area');
        if (displayArea) {
            displayArea.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
          <p>No items match your search for "<strong>${searchTerm}</strong>".</p>
        </div>`;
        }
    }
    else {
        clearMessage();
        renderItemsTable(results, 'display-area', `Search Results for "${searchTerm}"`);
    }
}
// ==================== Application Initialization ====================
/**
 * Initializes the application when the DOM is fully loaded.
 * Sets up event listeners and renders the initial view.
 */
function initializeApp() {
    // Set up navigation button click handlers
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
            const view = this.getAttribute('data-view') || 'all-items';
            switchView(view);
        });
    });
    // Show all items by default
    switchView('all-items');
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
function clearMessage() {
    throw new Error("Function not implemented.");
}
function renderSearchArea() {
    throw new Error("Function not implemented.");
}
function renderItemsTable(items, arg1, arg2) {
    throw new Error("Function not implemented.");
}
function showSuccess(message) {
    throw new Error("Function not implemented.");
}
function renderAddForm() {
    throw new Error("Function not implemented.");
}
function getFormData() {
    throw new Error("Function not implemented.");
}
function clearForm() {
    throw new Error("Function not implemented.");
}
function showError(message) {
    throw new Error("Function not implemented.");
}
function renderEditForm(item) {
    throw new Error("Function not implemented.");
}
function getInputValue(arg0) {
    throw new Error("Function not implemented.");
}
function renderDeleteConfirmation(itemName) {
    throw new Error("Function not implemented.");
}
function closeModal() {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=app.js.map