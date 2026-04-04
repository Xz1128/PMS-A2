"use strict";
/**
 * inventory.ts - Core Inventory Management Logic (CRUD Operations)
 *
 * This module handles all Create, Read, Update, and Delete operations
 * for the inventory management system. It operates on the global
 * inventoryData array defined in data.ts.
 */
/**
 * Adds a new item to the inventory.
 * Validates the item data before adding.
 * @param item - The complete InventoryItem to add
 * @returns Object with success status and message
 */
function addItem(item) {
    // Validate the item before adding
    const errors = validateItem(item, inventoryData, true);
    if (errors.length > 0) {
        return {
            success: false,
            message: "Validation failed:\n• " + errors.join("\n• ")
        };
    }
    // Add the item to the inventory array
    inventoryData.push(item);
    return {
        success: true,
        message: `Item "${item.itemName}" (ID: ${item.itemId}) has been successfully added to the inventory.`
    };
}
/**
 * Updates an existing item found by item name.
 * As per requirements, updating is done using item name.
 * @param itemName - The name of the item to update
 * @param updates - Partial object containing fields to update
 * @returns Object with success status and message
 */
function updateItem(itemName, updates) {
    // Find the item by name (case-insensitive)
    const index = inventoryData.findIndex((item) => item.itemName.toLowerCase() === itemName.toLowerCase());
    if (index === -1) {
        return {
            success: false,
            message: `Item "${itemName}" was not found in the inventory.`
        };
    }
    // Create an updated item by merging existing data with updates
    const currentItem = inventoryData[index];
    const updatedItem = Object.assign(Object.assign({}, currentItem), updates);
    // Prevent changing the Item ID to an existing one
    if (updates.itemId !== undefined && updates.itemId !== currentItem.itemId) {
        const idExists = inventoryData.some((item, i) => i !== index && item.itemId === updates.itemId);
        if (idExists) {
            return {
                success: false,
                message: `Cannot update Item ID to ${updates.itemId} - this ID already exists.`
            };
        }
    }
    // Validate the updated item (not a new item, so ID uniqueness is handled above)
    const errors = validateItem(updatedItem, inventoryData, false);
    if (errors.length > 0) {
        return {
            success: false,
            message: "Validation failed:\n• " + errors.join("\n• ")
        };
    }
    // Apply the update
    inventoryData[index] = updatedItem;
    return {
        success: true,
        message: `Item "${itemName}" has been successfully updated.`
    };
}
/**
 * Deletes an item from the inventory by item name.
 * As per requirements, deletion is done using item name.
 * Note: Confirmation is handled in the UI layer before calling this function.
 * @param itemName - The name of the item to delete
 * @returns Object with success status and message
 */
function deleteItem(itemName) {
    // Find the item by name (case-insensitive)
    const index = inventoryData.findIndex((item) => item.itemName.toLowerCase() === itemName.toLowerCase());
    if (index === -1) {
        return {
            success: false,
            message: `Item "${itemName}" was not found in the inventory.`
        };
    }
    // Store item info for the confirmation message
    const deletedItem = inventoryData[index];
    // Remove the item from the array
    inventoryData.splice(index, 1);
    return {
        success: true,
        message: `Item "${deletedItem.itemName}" (ID: ${deletedItem.itemId}) has been successfully deleted.`
    };
}
/**
 * Searches for items by name using partial matching.
 * Supports fuzzy searching - matches any item whose name
 * contains the search term (case-insensitive).
 * @param name - The search term to look for
 * @returns Array of matching InventoryItem objects
 */
function searchByName(name) {
    if (!name || name.trim() === '') {
        return [];
    }
    const searchTerm = name.toLowerCase().trim();
    return inventoryData.filter((item) => item.itemName.toLowerCase().includes(searchTerm));
}
/**
 * Returns all items currently in the inventory.
 * @returns Array of all InventoryItem objects
 */
function getAllItems() {
    return inventoryData;
}
/**
 * Returns only items marked as popular (popularItem === 'Yes').
 * @returns Array of popular InventoryItem objects
 */
function getPopularItems() {
    return inventoryData.filter((item) => item.popularItem === 'Yes');
}
/**
 * Finds a single item by its exact name (case-insensitive).
 * Used for pre-filling edit forms and delete confirmations.
 * @param name - The exact item name to find
 * @returns The matching InventoryItem or undefined
 */
function findItemByName(name) {
    return inventoryData.find((item) => item.itemName.toLowerCase() === name.toLowerCase().trim());
}
function validateItem(item, inventoryData, arg2) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=inventory.js.map