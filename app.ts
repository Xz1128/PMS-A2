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
let currentView: string = 'all-items';

// ==================== Navigation Handlers ====================

/**
 * Switches the active view and updates the display accordingly.
 * @param view - The view identifier to switch to
 */
function switchView(view: string): void {
  currentView = view;
  clearMessage();

  // Update active navigation button
  const navButtons: NodeListOf<Element> = document.querySelectorAll('.nav-btn');
  navButtons.forEach((btn: Element): void => {
    btn.classList.remove('active');
  });

  const activeBtn: HTMLElement | null = document.getElementById('nav-' + view);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Render the appropriate view
  switch (view) {
    case 'add-item':
      renderAddForm();
      // Clear the display area
      const displayArea: HTMLElement | null = document.getElementById('display-area');
      if (displayArea) displayArea.innerHTML = '';
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
      const searchDisplay: HTMLElement | null = document.getElementById('display-area');
      if (searchDisplay) searchDisplay.innerHTML = '';
      break;

    default:
      renderAllItems();
  }
}

// ==================== Display Functions ====================

/**
 * Renders all items in the inventory to the display area.
 */
function renderAllItems(): void {
  // Hide the form container
  const formContainer: HTMLElement | null = document.getElementById('form-container');
  if (formContainer) formContainer.innerHTML = '';

  const items: InventoryItem[] = getAllItems();
  renderItemsTable(items, 'display-area', 'All Inventory Items');
}

/**
 * Renders only popular items to the display area.
 */
function renderPopularItems(): void {
  // Hide the form container
  const formContainer: HTMLElement | null = document.getElementById('form-container');
  if (formContainer) formContainer.innerHTML = '';

  const items: InventoryItem[] = getPopularItems();
  renderItemsTable(items, 'display-area', 'Popular Items');
}

// ==================== CRUD Event Handlers ====================

/**
 * Handles the Add Item button click.
 * Reads form data, validates, and adds to inventory.
 */
function handleAddItem(): void {
  const formData: Partial<InventoryItem> = getFormData();

  // Build the complete item object
  const newItem: InventoryItem = {
    itemId: formData.itemId as number,
    itemName: formData.itemName as string,
    category: formData.category as Category,
    quantity: formData.quantity as number,
    price: formData.price as number,
    supplierName: formData.supplierName as string,
    stockStatus: formData.stockStatus as StockStatus,
    popularItem: formData.popularItem as PopularItem,
    comment: formData.comment
  };

  const result: { success: boolean; message: string } = addItem(newItem);

  if (result.success) {
    showSuccess(result.message);
    clearForm();
  } else {
    showError(result.message);
  }
}

/**
 * Handles clicking the Edit button on a table row.
 * Switches to the edit form pre-filled with the item's current data.
 * @param itemName - The name of the item to edit
 */
function handleEditClick(itemName: string): void {
  const item: InventoryItem | undefined = findItemByName(itemName);
  if (!item) {
    showError(`Item "${itemName}" not found.`);
    return;
  }

  // Switch to the add-item view but render the edit form
  currentView = 'add-item';
  const navButtons: NodeListOf<Element> = document.querySelectorAll('.nav-btn');
  navButtons.forEach((btn: Element): void => btn.classList.remove('active'));
  const addBtn: HTMLElement | null = document.getElementById('nav-add-item');
  if (addBtn) addBtn.classList.add('active');

  renderEditForm(item);

  // Clear display area
  const displayArea: HTMLElement | null = document.getElementById('display-area');
  if (displayArea) displayArea.innerHTML = '';

  // Scroll to top to see the form
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handles the Update Item button click (in edit mode).
 * Reads updated form data and applies the update.
 */
function handleUpdateItem(): void {
  const originalName: string = getInputValue('original-name');
  const formData: Partial<InventoryItem> = getFormData();

  // Build updates object
  const updates: Partial<InventoryItem> = {
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

  const result: { success: boolean; message: string } = updateItem(originalName, updates);

  if (result.success) {
    showSuccess(result.message);
    // Switch back to show all items
    switchView('all-items');
  } else {
    showError(result.message);
  }
}

/**
 * Handles clicking the Delete button on a table row.
 * Shows confirmation dialog (using innerHTML, not alert).
 * @param itemName - The name of the item to delete
 */
function handleDeleteClick(itemName: string): void {
  renderDeleteConfirmation(itemName);
}

/**
 * Confirms and executes the deletion of an item.
 * Called from the confirmation modal's "Yes, Delete" button.
 * @param itemName - The name of the item to delete
 */
function confirmDelete(itemName: string): void {
  const result: { success: boolean; message: string } = deleteItem(itemName);

  closeModal();

  if (result.success) {
    showSuccess(result.message);
    // Refresh the current view
    if (currentView === 'all-items') {
      renderAllItems();
    } else if (currentView === 'popular-items') {
      renderPopularItems();
    }
  } else {
    showError(result.message);
  }
}

/**
 * Handles the Search button click.
 * Searches by item name and displays results.
 */
function handleSearch(): void {
  const searchTerm: string = getInputValue('input-search');

  if (!searchTerm) {
    showError("Please enter a search term.");
    return;
  }

  const results: InventoryItem[] = searchByName(searchTerm);

  if (results.length === 0) {
    showError(`No items found matching "${searchTerm}".`);
    const displayArea: HTMLElement | null = document.getElementById('display-area');
    if (displayArea) {
      displayArea.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
          <p>No items match your search for "<strong>${searchTerm}</strong>".</p>
        </div>`;
    }
  } else {
    clearMessage();
    renderItemsTable(results, 'display-area', `Search Results for "${searchTerm}"`);
  }
}

// ==================== Application Initialization ====================

/**
 * Initializes the application when the DOM is fully loaded.
 * Sets up event listeners and renders the initial view.
 */
function initializeApp(): void {
  // Set up navigation button click handlers
  const navButtons: NodeListOf<Element> = document.querySelectorAll('.nav-btn');
  navButtons.forEach((btn: Element): void => {
    btn.addEventListener('click', function(this: HTMLElement): void {
      const view: string = this.getAttribute('data-view') || 'all-items';
      switchView(view);
    });
  });

  // Show all items by default
  switchView('all-items');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
