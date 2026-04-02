/**
 * types.ts - Type Definitions for Inventory Management System
 * 
 * This file defines all TypeScript types, interfaces, and enums
 * used throughout the inventory management application.
 */

// ==================== Enum-like Type Definitions ====================

/**
 * Category type - Defines the allowed categories for inventory items.
 * Limited to five specific categories as per requirements.
 */
type Category = 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';

/**
 * StockStatus type - Represents the current stock availability of an item.
 */
type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

/**
 * PopularItem type - Indicates whether an item is considered popular.
 */
type PopularItem = 'Yes' | 'No';

// ==================== Core Interface ====================

/**
 * InventoryItem interface - Defines the structure of an inventory item.
 * All fields are required except 'comment', which is optional.
 */
interface InventoryItem {
  itemId: number;           // Unique identifier for the item
  itemName: string;         // Name of the item
  category: Category;       // Category classification
  quantity: number;         // Available quantity (must be >= 0)
  price: number;            // Price per unit (must be > 0)
  supplierName: string;     // Name of the supplier
  stockStatus: StockStatus; // Current stock status
  popularItem: PopularItem; // Whether the item is popular
  comment?: string;         // Optional comment/note about the item
}

// ==================== Constants ====================

/**
 * Array of valid category values for validation purposes.
 */
const VALID_CATEGORIES: Category[] = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];

/**
 * Array of valid stock status values for validation purposes.
 */
const VALID_STOCK_STATUSES: StockStatus[] = ['In Stock', 'Low Stock', 'Out of Stock'];

/**
 * Array of valid popular item values for validation purposes.
 */
const VALID_POPULAR_OPTIONS: PopularItem[] = ['Yes', 'No'];
