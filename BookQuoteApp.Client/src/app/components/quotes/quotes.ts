import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { QuoteService, Quote } from '../../services/services.quote';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-quotes',
  standalone: false,
  templateUrl: './quotes.html',
  styleUrl: './quotes.css'
})
export class Quotes implements OnInit {
  quotes: Quote[] = [];
  showForm = false;
  editingQuote: Quote | null = null;
  loading = true;
  quoteModel = {
    text: '',
    author: ''
  };

  constructor(
    private quoteService: QuoteService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef  
  ) { }

  ngOnInit(): void {
    this.loadQuotes();
  }

  async loadQuotes(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      setTimeout(() => this.loadQuotes(), 500);
      return;
    }

    this.loading = true;

    try {
      const data = await firstValueFrom(this.quoteService.getQuotes());
      this.quotes = data || [];
    } catch (err) {
      console.error('Fel vid laddning:', err);
      alert('Kunde inte ladda citat');
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); 
    }
  }

  refresh(): void {
    this.loadQuotes();
  }

  showAddForm(): void {
    this.showForm = true;
    this.editingQuote = null;
    this.quoteModel = { text: '', author: '' };
  }

  editQuote(quote: Quote): void {
    this.showForm = true;
    this.editingQuote = quote;
    this.quoteModel = {
      text: quote.text,
      author: quote.author || ''
    };
  }

  saveQuote(): void {
    if (this.editingQuote) {
      this.quoteService.updateQuote(this.editingQuote.id, this.quoteModel).subscribe({
        next: () => {
          this.loadQuotes();
          this.cancelForm();
          alert('Citatet uppdaterades!');
        },
        error: () => alert('Kunde inte uppdatera citatet')
      });
    } else {
      this.quoteService.createQuote(this.quoteModel).subscribe({
        next: () => {
          this.loadQuotes();
          this.cancelForm();
          alert('Citatet lades till!');
        },
        error: () => alert('Kunde inte lägga till citatet')
      });
    }
  }

  deleteQuote(id: number): void {
    if (confirm('Är du säker på att du vill radera detta citat?')) {
      this.quoteService.deleteQuote(id).subscribe({
        next: () => {
          this.loadQuotes();
          alert('Citatet raderades!');
        },
        error: () => alert('Kunde inte radera citatet')
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingQuote = null;
    this.quoteModel = { text: '', author: '' };
  }
}
