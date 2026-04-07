"use strict";
/**
 * validation.ts - Data Validation Module
 *
 * This module provides comprehensive validation functions for inventory items.
 * All validation functions return error messages as strings, or null if valid.
 * This ensures data integrity before any CRUD operation is performed.
 */
/**
 * Validates whether a given Item ID is unique and valid.
 * @param id - The Item ID to validate
 * @param existingItems - Current inventory array to check against
 * @param isNew - Whether this is a new item (true) or an update (false)
 * @returns Error message string or null if valid
 */
function validateItemId(id, existingItems, isNew = true) {
    // Check if ID is provided
    if (id === undefined || id === null || isNaN(id)) {
        return "Item ID is required and must be a number.";
    }
    // Check if ID is a positive integer
    if (!Number.isInteger(id) || id <= 0) {
        return "Item ID must be a positive integer.";
    }
    // Check uniqueness only for new items
    if (isNew) {
        const exists = existingItems.some((item) => item.itemId === id);
        if (exists) {
            return `Item ID ${id} already exists. Each item must have a unique ID.`;
        }
    }
    return null;
}
/**
 * Validates that a string field is not empty.
 * @param value - The string value to check
 * @param fieldName - Name of the field (for error messages)
 * @returns Error message string or null if valid
 */
function validateRequiredString(value, fieldName) {
    if (value === undefined || value === null || value.trim() === '') {
        return `${fieldName} is required and cannot be empty.`;
    }
    return null;
}
/**
 * Validates that a value is a valid number and optionally meets constraints.
 * @param value - The value to validate
 * @param fieldName - Name of the field (for error messages)
 * @param allowZero - Whether zero is an acceptable value (default: false)
 * @returns Error message string or null if valid
 */
function validateNumeric(value, fieldName, allowZero = false) {
    // Check if value is provided
    if (value === undefined || value === null || value === '') {
        return `${fieldName} is required.`;
    }
    // Check if it's a valid number
    const num = Number(value);
    if (isNaN(num)) {
        return `${fieldName} must be a valid number. Letters and special characters are not allowed.`;
    }
    // Check for negative values
    if (num < 0) {
        return `${fieldName} cannot be negative.`;
    }
    // Check for zero if not allowed
    if (!allowZero && num === 0) {
        return `${fieldName} must be greater than zero.`;
    }
    return null;
}
/**
 * Validates that the category is one of the allowed values.
 * @param category - The category string to validate
 * @returns Error message string or null if valid
 */
function validateCategory(category) {
    if (!category || category.trim() === '') {
        return "Category is required.";
    }
    if (!VALID_CATEGORIES.includes(category)) {
        return `Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(', ')}.`;
    }
    return null;
}
/**
 * Validates that the stock status is one of the allowed values.
 * @param status - The stock status string to validate
 * @returns Error message string or null if valid
 */
function validateStockStatus(status) {
    if (!status || status.trim() === '') {
        return "Stock Status is required.";
    }
    if (!VALID_STOCK_STATUSES.includes(status)) {
        return `Invalid stock status "${status}". Must be one of: ${VALID_STOCK_STATUSES.join(', ')}.`;
    }
    return null;
}
/**
 * Validates that the popular item field is 'Yes' or 'No'.
 * @param value - The popular item value to validate
 * @returns Error message string or null if valid
 */
function validatePopularItem(value) {
    if (!value || value.trim() === '') {
        return "Popular Item selection is required.";
    }
    if (!VALID_POPULAR_OPTIONS.includes(value)) {
        return `Invalid Popular Item value "${value}". Must be "Yes" or "No".`;
    }
    return null;
}
/**
 * Comprehensive validation for a complete inventory item.
 * Validates all fields and returns an array of all error messages.
 * @param item - Partial inventory item object to validate
 * @param existingItems - Current inventory for uniqueness checks
 * @param isNew - Whether this is a new item being added
 * @returns Array of error message strings (empty if all valid)
 */
function validateItem(item, existingItems, isNew = true) {
    const errors = [];
    // Validate Item ID
    const idError = validateItemId(item.itemId, existingItems, isNew);
    if (idError)
        errors.push(idError);
    // Validate Item Name
    const nameError = validateRequiredString(item.itemName, "Item Name");
    if (nameError)
        errors.push(nameError);
    // Validate Category
    const categoryError = validateCategory(item.category);
    if (categoryError)
        errors.push(categoryError);
    // Validate Quantity (allows zero since items can be out of stock)
    const quantityError = validateNumeric(item.quantity, "Quantity", true);
    if (quantityError)
        errors.push(quantityError);
    // Validate Price (must be greater than zero)
    const priceError = validateNumeric(item.price, "Price", false);
    if (priceError)
        errors.push(priceError);
    // Validate Supplier Name
    const supplierError = validateRequiredString(item.supplierName, "Supplier Name");
    if (supplierError)
        errors.push(supplierError);
    // Validate Stock Status
    const stockError = validateStockStatus(item.stockStatus);
    if (stockError)
        errors.push(stockError);
    // Validate Popular Item
    const popularError = validatePopularItem(item.popularItem);
    if (popularError)
        errors.push(popularError);
    // Comment is optional, no validation required
    return errors;
}
//# sourceMappingURL=validation.js.map