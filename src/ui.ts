/**
 * ui.ts - UI Rendering Module
 * 
 * This module handles all DOM manipulation and rendering using innerHTML.
 * As per requirements, alert() calls are NOT used; instead, all feedback
 * is displayed directly in the page using innerHTML assignments.
 */

// ==================== Message Display ====================

/**
 * Displays a success message in the message area.
 * @param message - The success message text
 */
function showSuccess(message: string): void {
    const msgArea: HTMLElement | null = document.getElementById('message-area');
    if (msgArea) {
      msgArea.innerHTML = `<div class="message success">
        <span class="message-icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
        <span>${message}</span>
      </div>`;
  
      // Auto-clear after 5 seconds
      setTimeout((): void => {
        if (msgArea) msgArea.innerHTML = '';
      }, 5000);
    }
  }
  
  /**
   * Displays an error message in the message area.
   * @param message - The error message text (can contain line breaks)
   */
  function showError(message: string): void {
    const msgArea: HTMLElement | null = document.getElementById('message-area');
    if (msgArea) {
      // Convert newlines and bullet points to HTML
      const formattedMsg: string = message.replace(/\n/g, '<br>');
      msgArea.innerHTML = `<div class="message error">
        <span class="message-icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
        <span>${formattedMsg}</span>
      </div>`;
    }
  }
  
  /**
   * Clears the message area.
   */
  function clearMessage(): void {
    const msgArea: HTMLElement | null = document.getElementById('message-area');
    if (msgArea) {
      msgArea.innerHTML = '';
    }
  }
  
  // ==================== Table Rendering ====================
  
  /**
   * Renders an array of inventory items as an HTML table.
   * @param items - Array of items to display
   * @param containerId - The ID of the container element
   * @param title - Optional title for the table section
   */
  function renderItemsTable(items: InventoryItem[], containerId: string, title?: string): void {
    const container: HTMLElement | null = document.getElementById(containerId);
    if (!container) return;
  
    // If no items to display
    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></span>
          <p>No items found.</p>
        </div>`;
      return;
    }
  
    // Build table header
    let html: string = '';
    if (title) {
      html += `<h2 class="table-title">${title} <span class="item-count">(${items.length} items)</span></h2>`;
    }
  
    html += `
      <div class="table-wrapper">
        <table class="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price ($)</th>
              <th>Supplier</th>
              <th>Stock Status</th>
              <th>Popular</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>`;
  
    // Build table rows
    items.forEach((item: InventoryItem): void => {
      // Determine stock status CSS class
      const stockClass: string = item.stockStatus === 'In Stock' ? 'status-in-stock' :
        item.stockStatus === 'Low Stock' ? 'status-low-stock' : 'status-out-of-stock';
  
      // Determine popular badge
      const popularBadge: string = item.popularItem === 'Yes'
        ? '<span class="badge popular"><svg class="icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Popular</span>'
        : '<span class="badge not-popular">—</span>';
  
      html += `
        <tr>
          <td class="cell-id">${item.itemId}</td>
          <td class="cell-name">${item.itemName}</td>
          <td><span class="badge category">${item.category}</span></td>
          <td class="cell-qty">${item.quantity}</td>
          <td class="cell-price">$${item.price.toFixed(2)}</td>
          <td>${item.supplierName}</td>
          <td><span class="badge ${stockClass}">${item.stockStatus}</span></td>
          <td>${popularBadge}</td>
          <td class="cell-comment">${item.comment || '—'}</td>
          <td class="cell-actions">
            <button class="btn btn-edit" onclick="handleEditClick('${item.itemName.replace(/'/g, "\\'")}')">Edit</button>
            <button class="btn btn-delete" onclick="handleDeleteClick('${item.itemName.replace(/'/g, "\\'")}')">Delete</button>
          </td>
        </tr>`;
    });
  
    html += `
          </tbody>
        </table>
      </div>`;
  
    container.innerHTML = html;
  }
  
  // ==================== Form Rendering ====================
  
  /**
   * Renders the Add Item form.
   * Uses innerHTML to build the form in the form container.
   */
  function renderAddForm(): void {
    const formContainer: HTMLElement | null = document.getElementById('form-container');
    if (!formContainer) return;
  
    formContainer.innerHTML = `
      <div class="form-panel">
        <h2 class="form-title">Add New Item</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="input-id">Item ID *</label>
            <input type="number" id="input-id" placeholder="Enter unique Item ID" min="1" step="1">
          </div>
          <div class="form-group">
            <label for="input-name">Item Name *</label>
            <input type="text" id="input-name" placeholder="Enter item name">
          </div>
          <div class="form-group">
            <label for="input-category">Category *</label>
            <select id="input-category">
              <option value="">-- Select Category --</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Tools">Tools</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div class="form-group">
            <label for="input-quantity">Quantity *</label>
            <input type="number" id="input-quantity" placeholder="Enter quantity" min="0" step="1">
          </div>
          <div class="form-group">
            <label for="input-price">Price ($) *</label>
            <input type="number" id="input-price" placeholder="Enter price" min="0.01" step="0.01">
          </div>
          <div class="form-group">
            <label for="input-supplier">Supplier Name *</label>
            <input type="text" id="input-supplier" placeholder="Enter supplier name">
          </div>
          <div class="form-group">
            <label for="input-stock">Stock Status *</label>
            <select id="input-stock">
              <option value="">-- Select Status --</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <div class="form-group">
            <label for="input-popular">Popular Item *</label>
            <select id="input-popular">
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label for="input-comment">Comment (Optional)</label>
            <textarea id="input-comment" placeholder="Enter optional comment" rows="3"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" onclick="handleAddItem()">Add Item</button>
          <button class="btn btn-secondary" onclick="clearForm()">Clear</button>
        </div>
      </div>`;
  }
  
  /**
   * Renders the Edit Item form, pre-filled with existing item data.
   * @param item - The inventory item to edit
   */
  function renderEditForm(item: InventoryItem): void {
    const formContainer: HTMLElement | null = document.getElementById('form-container');
    if (!formContainer) return;
  
    // Helper to generate select options with the correct one selected
    const categoryOptions: string = VALID_CATEGORIES.map((cat: Category) =>
      `<option value="${cat}" ${cat === item.category ? 'selected' : ''}>${cat}</option>`
    ).join('');
  
    const stockOptions: string = VALID_STOCK_STATUSES.map((status: StockStatus) =>
      `<option value="${status}" ${status === item.stockStatus ? 'selected' : ''}>${status}</option>`
    ).join('');
  
    const popularOptions: string = VALID_POPULAR_OPTIONS.map((opt: PopularItem) =>
      `<option value="${opt}" ${opt === item.popularItem ? 'selected' : ''}>${opt}</option>`
    ).join('');
  
    formContainer.innerHTML = `
      <div class="form-panel editing">
        <h2 class="form-title">Edit Item: ${item.itemName}</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="input-id">Item ID *</label>
            <input type="number" id="input-id" value="${item.itemId}" min="1" step="1">
          </div>
          <div class="form-group">
            <label for="input-name">Item Name *</label>
            <input type="text" id="input-name" value="${item.itemName}">
            <input type="hidden" id="original-name" value="${item.itemName}">
          </div>
          <div class="form-group">
            <label for="input-category">Category *</label>
            <select id="input-category">
              ${categoryOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="input-quantity">Quantity *</label>
            <input type="number" id="input-quantity" value="${item.quantity}" min="0" step="1">
          </div>
          <div class="form-group">
            <label for="input-price">Price ($) *</label>
            <input type="number" id="input-price" value="${item.price}" min="0.01" step="0.01">
          </div>
          <div class="form-group">
            <label for="input-supplier">Supplier Name *</label>
            <input type="text" id="input-supplier" value="${item.supplierName}">
          </div>
          <div class="form-group">
            <label for="input-stock">Stock Status *</label>
            <select id="input-stock">
              ${stockOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="input-popular">Popular Item *</label>
            <select id="input-popular">
              ${popularOptions}
            </select>
          </div>
          <div class="form-group full-width">
            <label for="input-comment">Comment (Optional)</label>
            <textarea id="input-comment" rows="3">${item.comment || ''}</textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" onclick="handleUpdateItem()">Update Item</button>
          <button class="btn btn-secondary" onclick="renderAddForm()">Cancel</button>
        </div>
      </div>`;
  }
  
  /**
   * Renders the search input area.
   */
  function renderSearchArea(): void {
    const formContainer: HTMLElement | null = document.getElementById('form-container');
    if (!formContainer) return;
  
    formContainer.innerHTML = `
      <div class="form-panel">
        <h2 class="form-title">Search Items</h2>
        <div class="search-row">
          <input type="text" id="input-search" placeholder="Enter item name to search..." class="search-input">
          <button class="btn btn-primary" onclick="handleSearch()">Search</button>
        </div>
      </div>`;
  }
  
  // ==================== Delete Confirmation ====================
  
  /**
   * Renders a delete confirmation dialog using innerHTML.
   * No alert() is used as per requirements.
   * @param itemName - Name of the item to confirm deletion for
   */
  function renderDeleteConfirmation(itemName: string): void {
    const item: InventoryItem | undefined = findItemByName(itemName);
    if (!item) {
      showError(`Item "${itemName}" not found.`);
      return;
    }
  
    const overlay: HTMLElement | null = document.getElementById('modal-overlay');
    if (!overlay) return;
  
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <span class="modal-icon warning"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
          <h3>Confirm Deletion</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete the following item?</p>
          <div class="item-preview">
            <p><strong>ID:</strong> ${item.itemId}</p>
            <p><strong>Name:</strong> ${item.itemName}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
          </div>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-danger" onclick="confirmDelete('${item.itemName.replace(/'/g, "\\'")}')">Yes, Delete</button>
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        </div>
      </div>`;
    overlay.classList.add('active');
  }
  
  /**
   * Closes the modal overlay.
   */
  function closeModal(): void {
    const overlay: HTMLElement | null = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.innerHTML = '';
    }
  }
  
  // ==================== Utility Functions ====================
  
  /**
   * Gets the value of an input element by its ID.
   * @param id - The element ID
   * @returns The trimmed string value
   */
  function getInputValue(id: string): string {
    const element: HTMLInputElement | null = document.getElementById(id) as HTMLInputElement;
    return element ? element.value.trim() : '';
  }
  
  /**
   * Clears the add form by re-rendering it.
   */
  function clearForm(): void {
    renderAddForm();
    clearMessage();
  }
  
  /**
   * Reads all form input values and constructs a Partial<InventoryItem>.
   * @returns A partial inventory item object built from form inputs
   */
  function getFormData(): Partial<InventoryItem> {
    return {
      itemId: parseInt(getInputValue('input-id')) || undefined,
      itemName: getInputValue('input-name'),
      category: getInputValue('input-category') as Category,
      quantity: parseInt(getInputValue('input-quantity')),
      price: parseFloat(getInputValue('input-price')),
      supplierName: getInputValue('input-supplier'),
      stockStatus: getInputValue('input-stock') as StockStatus,
      popularItem: getInputValue('input-popular') as PopularItem,
      comment: getInputValue('input-comment') || undefined
    };
  }
  