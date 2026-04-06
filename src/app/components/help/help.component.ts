/**
 * HelpComponent - FAQ and troubleshooting guidance page.
 * Provides common questions and step-by-step instructions.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  /** FAQ items with expand/collapse state */
  faqs: { question: string; answer: string; open: boolean }[] = [
    {
      question: 'How do I add a new item to the inventory?',
      answer: 'Navigate to the "Inventory" page and click the "Add Item" button. Fill in all required fields (marked with *) including Item ID, Item Name, Category, Quantity, Price, Supplier Name, Stock Status, and Popular Item. The Comment field is optional. Click "Add Item" to save.',
      open: false
    },
    {
      question: 'How do I edit an existing item?',
      answer: 'On the "Inventory" page, enter the exact item name in the "Item name to edit..." input field and click "Edit". The form will open pre-filled with the current values. Make your changes and click "Update Item" to save.',
      open: false
    },
    {
      question: 'How do I delete an item?',
      answer: 'On the "Inventory" page, enter the item name in the "Item name to delete..." field and click "Delete". A confirmation dialog will appear showing the item details. Click "Yes, Delete" to confirm, or "Cancel" to abort.',
      open: false
    },
    {
      question: 'Why does the Item ID field reject my input?',
      answer: 'The Item ID must be a unique positive integer. If you see an error, the ID may already be in use by another item, or you may have entered a non-numeric value. Try a different number.',
      open: false
    },
    {
      question: 'How do I search for items?',
      answer: 'Go to the "Search" page. Type part or all of an item name in the search bar. You can also filter by Category, Stock Status, and Popularity using the dropdown filters. Click "Search" to see results.',
      open: false
    },
    {
      question: 'How do I view only popular items?',
      answer: 'On the "Inventory" page, click the "Popular" button in the toolbar. This filters the table to show only items marked as Popular = Yes.',
      open: false
    },
    {
      question: 'Why is my data lost after refreshing the page?',
      answer: 'This application stores data in-memory only. Data is not saved to a database or local storage. When you refresh or close the browser, the data resets to the default sample items. This is by design for this demonstration application.',
      open: false
    },
    {
      question: 'Can I enter letters in the Quantity or Price fields?',
      answer: 'No. Quantity and Price fields are validated as numeric inputs. The form uses type="number" inputs and will show an error if you attempt to enter alphabetic characters.',
      open: false
    }
  ];

  /** Toggle a FAQ item open/closed */
  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
