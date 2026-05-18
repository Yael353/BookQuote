import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Books } from './components/books/books';
import { Quotes } from './components/quotes/quotes';
import { Navbar } from './components/navbar/navbar';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Books,
    Quotes,
    Navbar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
