/**
 * inventory-item.model.ts - Data Models & Type Definitions
 *
 * Defines all TypeScript interfaces and type aliases
 * for the inventory management system.
 */

/** Category type - Allowed item categories */
export type Category = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';

/** StockStatus type - Possible stock statuses */
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

/** PopularItem type - Whether an item is popular */
export type PopularItem = 'Yes' | 'No';

/**
 * InventoryItem interface - Core data model.
 * All fields required except comment.
 */
export interface InventoryItem {
  itemId: number;
  itemName: string;
  category: Category;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: StockStatus;
  popularItem: PopularItem;
  comment?: string;
}

/** Constant arrays for validation & dropdowns */
export const VALID_CATEGORIES: Category[] = [
  'Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'
];

export const VALID_STOCK_STATUSES: StockStatus[] = [
  'In Stock', 'Low Stock', 'Out of Stock'
];

export const VALID_POPULAR_OPTIONS: PopularItem[] = ['Yes', 'No'];
