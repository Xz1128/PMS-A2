/**
 * app.module.ts - Root Application Module
 *
 * As per requirements, the app must include at least one module.
 * This NgModule declares and configures the application.
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { App } from './app';
import { routes } from './app.routes';

// Import standalone components so they are available via routing
import { HomeComponent } from './components/home/home.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { SearchComponent } from './components/search/search.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { HelpComponent } from './components/help/help.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    // Standalone components imported here
    App,
    HomeComponent,
    InventoryComponent,
    SearchComponent,
    PrivacyComponent,
    HelpComponent
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule {}
