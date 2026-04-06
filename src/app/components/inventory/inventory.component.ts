/**
 * InventoryComponent - CRUD page for managing inventory items.
 * Supports add, edit, update, delete, display all & popular items.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import {
  InventoryItem, Category, StockStatus, PopularItem,
  VALID_CATEGORIES, VALID_STOCK_STATUSES, VALID_POPULAR_OPTIONS
} from '../../models/inventory-item.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  /** Dropdown option lists */
  categories: Category[] = VALID_CATEGORIES;
  stockStatuses: StockStatus[] = VALID_STOCK_STATUSES;
  popularOptions: PopularItem[] = VALID_POPULAR_OPTIONS;

  /** Current display items */
  displayItems: InventoryItem[] = [];
  displayTitle: string = 'All Inventory Items';

  /** Form model */
  formItem: InventoryItem = this.emptyItem();
  originalName: string = '';

  /** UI state */
  isEditing: boolean = false;
  showForm: boolean = false;
  showDeleteConfirm: boolean = false;
  deleteTargetName: string = '';
  deleteTargetItem: InventoryItem | null = null;

  /** Messages */
  successMessage: string = '';
  errorMessage: string = '';

  /** Delete-by-name input */
  deleteNameInput: string = '';

  /** Edit-by-name input */
  editNameInput: string = '';

  constructor(private inventoryService: InventoryService) {
    this.loadAllItems();
  }

  /** Create an empty item template */
  private emptyItem(): InventoryItem {
    return {
      itemId: 0,
      itemName: '',
      category: '' as Category,
      quantity: 0,
      price: 0,
      supplierName: '',
      stockStatus: '' as StockStatus,
      popularItem: '' as PopularItem,
      comment: ''
    };
  }

  /** Load and display all items */
  loadAllItems(): void {
    this.displayItems = this.inventoryService.getAllItems();
    this.displayTitle = 'All Inventory Items';
  }

  /** Load and display popular items only */
  loadPopularItems(): void {
    this.displayItems = this.inventoryService.getPopularItems();
    this.displayTitle = 'Popular Items';
  }

  /** Show the add-item form */
  showAddForm(): void {
    this.isEditing = false;
    this.formItem = this.emptyItem();
    this.originalName = '';
    this.showForm = true;
    this.clearMessages();
  }

  /** Look up an item by name and open edit form */
  startEditByName(): void {
    this.clearMessages();
    if (!this.editNameInput || this.editNameInput.trim() === '') {
      this.errorMessage = 'Please enter an item name to edit.';
      return;
    }
    const item = this.inventoryService.findByName(this.editNameInput.trim());
    if (!item) {
      this.errorMessage = `Item "${this.editNameInput}" not found.`;
      return;
    }
    this.isEditing = true;
    this.originalName = item.itemName;
    this.formItem = { ...item };
    this.showForm = true;
    this.editNameInput = '';
  }

  /** Handle form submission (add or update) */
  onSubmit(): void {
    this.clearMessages();
    if (this.isEditing) {
      const result = this.inventoryService.updateItem(this.originalName, this.formItem);
      if (result.success) {
        this.successMessage = result.message;
        this.showForm = false;
        this.loadAllItems();
      } else {
        this.errorMessage = result.message;
      }
    } else {
      const result = this.inventoryService.addItem(this.formItem);
      if (result.success) {
        this.successMessage = result.message;
        this.showForm = false;
        this.formItem = this.emptyItem();
        this.loadAllItems();
      } else {
        this.errorMessage = result.message;
      }
    }
  }

  /** Cancel form editing */
  cancelForm(): void {
    this.showForm = false;
    this.clearMessages();
  }

  /** Initiate delete by name */
  startDeleteByName(): void {
    this.clearMessages();
    if (!this.deleteNameInput || this.deleteNameInput.trim() === '') {
      this.errorMessage = 'Please enter an item name to delete.';
      return;
    }
    const item = this.inventoryService.findByName(this.deleteNameInput.trim());
    if (!item) {
      this.errorMessage = `Item "${this.deleteNameInput}" not found.`;
      return;
    }
    this.deleteTargetName = item.itemName;
    this.deleteTargetItem = item;
    this.showDeleteConfirm = true;
  }

  /** Confirm and execute deletion */
  confirmDelete(): void {
    const result = this.inventoryService.deleteItem(this.deleteTargetName);
    this.showDeleteConfirm = false;
    this.deleteNameInput = '';
    if (result.success) {
      this.successMessage = result.message;
      this.loadAllItems();
    } else {
      this.errorMessage = result.message;
    }
  }

  /** Cancel deletion */
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  /** Clear all messages */
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
