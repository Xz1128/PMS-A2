/**
 * inventory.service.ts - Central Inventory Data Service
 *
 * Singleton service that manages all inventory data and CRUD operations.
 * Maintains an in-memory array of items with initial sample data.
 */
import { Injectable } from '@angular/core';
import {
  InventoryItem, Category, StockStatus, PopularItem,
  VALID_CATEGORIES, VALID_STOCK_STATUSES, VALID_POPULAR_OPTIONS
} from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  /** In-memory inventory data store */
  private items: InventoryItem[] = [
    {
      itemId: 1001,
      itemName: 'Samsung 65-inch Smart TV',
      category: 'Electronics',
      quantity: 25,
      price: 1299.99,
      supplierName: 'Samsung Australia',
      stockStatus: 'In Stock',
      popularItem: 'Yes',
      comment: 'Latest 4K QLED model, best seller this quarter'
    },
    {
      itemId: 1002,
      itemName: 'Apple MacBook Pro 16',
      category: 'Electronics',
      quantity: 8,
      price: 3499.00,
      supplierName: 'Apple Inc.',
      stockStatus: 'Low Stock',
      popularItem: 'Yes',
      comment: 'M3 Pro chip variant'
    },
    {
      itemId: 1003,
      itemName: 'Ergonomic Office Chair',
      category: 'Furniture',
      quantity: 42,
      price: 549.95,
      supplierName: 'OfficeWorks Supply',
      stockStatus: 'In Stock',
      popularItem: 'No'
    },
    {
      itemId: 1004,
      itemName: 'Leather Recliner Sofa',
      category: 'Furniture',
      quantity: 0,
      price: 1899.00,
      supplierName: 'Premium Furnishings',
      stockStatus: 'Out of Stock',
      popularItem: 'No',
      comment: 'Next shipment expected in 2 weeks'
    },
    {
      itemId: 1005,
      itemName: "Men's Winter Jacket",
      category: 'Clothing',
      quantity: 120,
      price: 179.99,
      supplierName: 'Urban Apparel Co.',
      stockStatus: 'In Stock',
      popularItem: 'Yes',
      comment: 'Waterproof, available in 4 colours'
    },
    {
      itemId: 1006,
      itemName: 'Bosch Power Drill Set',
      category: 'Tools',
      quantity: 15,
      price: 289.00,
      supplierName: 'Bosch Australia',
      stockStatus: 'In Stock',
      popularItem: 'Yes'
    },
    {
      itemId: 1007,
      itemName: 'Cordless Vacuum Cleaner',
      category: 'Miscellaneous',
      quantity: 3,
      price: 699.00,
      supplierName: 'Dyson Ltd.',
      stockStatus: 'Low Stock',
      popularItem: 'Yes',
      comment: 'V15 Detect model'
    },
    {
      itemId: 1008,
      itemName: 'Adjustable Standing Desk',
      category: 'Furniture',
      quantity: 18,
      price: 749.95,
      supplierName: 'OfficeWorks Supply',
      stockStatus: 'In Stock',
      popularItem: 'No',
      comment: 'Electric height adjustment, bamboo top'
    }
  ];

  /** Returns all inventory items */
  getAllItems(): InventoryItem[] {
    return [...this.items];
  }

  /** Returns only popular items */
  getPopularItems(): InventoryItem[] {
    return this.items.filter(item => item.popularItem === 'Yes');
  }

  /** Search items by name (partial, case-insensitive) */
  searchByName(name: string): InventoryItem[] {
    if (!name || name.trim() === '') return [];
    const term = name.toLowerCase().trim();
    return this.items.filter(item =>
      item.itemName.toLowerCase().includes(term)
    );
  }

  /** Find a single item by exact name (case-insensitive) */
  findByName(name: string): InventoryItem | undefined {
    return this.items.find(item =>
      item.itemName.toLowerCase() === name.toLowerCase().trim()
    );
  }

  /** Find a single item by ID */
  findById(id: number): InventoryItem | undefined {
    return this.items.find(item => item.itemId === id);
  }

  /**
   * Filter items by multiple criteria
   */
  filterItems(filters: {
    name?: string;
    category?: Category | '';
    stockStatus?: StockStatus | '';
    popularItem?: PopularItem | '';
  }): InventoryItem[] {
    return this.items.filter(item => {
      if (filters.name && !item.itemName.toLowerCase().includes(filters.name.toLowerCase().trim())) {
        return false;
      }
      if (filters.category && item.category !== filters.category) {
        return false;
      }
      if (filters.stockStatus && item.stockStatus !== filters.stockStatus) {
        return false;
      }
      if (filters.popularItem && item.popularItem !== filters.popularItem) {
        return false;
      }
      return true;
    });
  }

  /**
   * Add a new item. Returns { success, message }.
   */
  addItem(item: InventoryItem): { success: boolean; message: string } {
    const errors = this.validateItem(item, true);
    if (errors.length > 0) {
      return { success: false, message: 'Validation failed:\n• ' + errors.join('\n• ') };
    }
    this.items.push({ ...item });
    return { success: true, message: `Item "${item.itemName}" (ID: ${item.itemId}) added successfully.` };
  }

  /**
   * Update an item found by name. Returns { success, message }.
   */
  updateItem(originalName: string, updates: Partial<InventoryItem>): { success: boolean; message: string } {
    const index = this.items.findIndex(i =>
      i.itemName.toLowerCase() === originalName.toLowerCase()
    );
    if (index === -1) {
      return { success: false, message: `Item "${originalName}" not found.` };
    }

    const updated: InventoryItem = { ...this.items[index], ...updates };

    // Check ID uniqueness if changed
    if (updates.itemId !== undefined && updates.itemId !== this.items[index].itemId) {
      if (this.items.some((it, i) => i !== index && it.itemId === updates.itemId)) {
        return { success: false, message: `Item ID ${updates.itemId} already exists.` };
      }
    }

    const errors = this.validateItem(updated, false);
    if (errors.length > 0) {
      return { success: false, message: 'Validation failed:\n• ' + errors.join('\n• ') };
    }

    this.items[index] = updated;
    return { success: true, message: `Item "${originalName}" updated successfully.` };
  }

  /**
   * Delete an item by name. Returns { success, message }.
   */
  deleteItem(itemName: string): { success: boolean; message: string } {
    const index = this.items.findIndex(i =>
      i.itemName.toLowerCase() === itemName.toLowerCase()
    );
    if (index === -1) {
      return { success: false, message: `Item "${itemName}" not found.` };
    }
    const removed = this.items.splice(index, 1)[0];
    return { success: true, message: `Item "${removed.itemName}" (ID: ${removed.itemId}) deleted.` };
  }

  /**
   * Comprehensive item validation.
   */
  private validateItem(item: InventoryItem, isNew: boolean): string[] {
    const errors: string[] = [];

    // Item ID
    if (item.itemId === undefined || item.itemId === null || isNaN(item.itemId)) {
      errors.push('Item ID is required and must be a number.');
    } else if (!Number.isInteger(item.itemId) || item.itemId <= 0) {
      errors.push('Item ID must be a positive integer.');
    } else if (isNew && this.items.some(i => i.itemId === item.itemId)) {
      errors.push(`Item ID ${item.itemId} already exists.`);
    }

    // Item Name
    if (!item.itemName || item.itemName.trim() === '') {
      errors.push('Item Name is required.');
    }

    // Category
    if (!item.category || !VALID_CATEGORIES.includes(item.category)) {
      errors.push('A valid Category is required.');
    }

    // Quantity
    if (item.quantity === undefined || item.quantity === null || isNaN(item.quantity)) {
      errors.push('Quantity is required and must be a number.');
    } else if (item.quantity < 0) {
      errors.push('Quantity cannot be negative.');
    }

    // Price
    if (item.price === undefined || item.price === null || isNaN(item.price)) {
      errors.push('Price is required and must be a number.');
    } else if (item.price <= 0) {
      errors.push('Price must be greater than zero.');
    }

    // Supplier
    if (!item.supplierName || item.supplierName.trim() === '') {
      errors.push('Supplier Name is required.');
    }

    // Stock Status
    if (!item.stockStatus || !VALID_STOCK_STATUSES.includes(item.stockStatus)) {
      errors.push('A valid Stock Status is required.');
    }

    // Popular
    if (!item.popularItem || !VALID_POPULAR_OPTIONS.includes(item.popularItem)) {
      errors.push('Popular Item (Yes/No) is required.');
    }

    return errors;
  }
}
