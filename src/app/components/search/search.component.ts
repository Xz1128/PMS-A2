/**
 * SearchComponent - Item search page with filtering options.
 * Search by name and filter by category, stock status, and popularity.
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
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  categories: Category[] = VALID_CATEGORIES;
  stockStatuses: StockStatus[] = VALID_STOCK_STATUSES;
  popularOptions: PopularItem[] = VALID_POPULAR_OPTIONS;

  /** Search & filter inputs */
  searchName: string = '';
  filterCategory: Category | '' = '';
  filterStock: StockStatus | '' = '';
  filterPopular: PopularItem | '' = '';

  /** Results */
  results: InventoryItem[] = [];
  hasSearched: boolean = false;

  constructor(private inventoryService: InventoryService) {}

  /** Perform search with all filters */
  onSearch(): void {
    this.results = this.inventoryService.filterItems({
      name: this.searchName,
      category: this.filterCategory,
      stockStatus: this.filterStock,
      popularItem: this.filterPopular
    });
    this.hasSearched = true;
  }

  /** Clear all search fields and results */
  onClear(): void {
    this.searchName = '';
    this.filterCategory = '';
    this.filterStock = '';
    this.filterPopular = '';
    this.results = [];
    this.hasSearched = false;
  }
}
