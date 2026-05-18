import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BookService, Book } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-books',
  standalone: false,
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class Books implements OnInit {
  books: Book[] = [];
  showForm = false;
  editingBook: Book | null = null;
  loading = true;  
  bookModel = {
    title: '',
    author: '',
    publishDate: ''
  };

  constructor(
    private bookService: BookService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  async loadBooks(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      setTimeout(() => this.loadBooks(), 500);
      return;
    }

    this.loading = true;

    try {
      const data = await firstValueFrom(this.bookService.getBooks());
      this.books = data || [];
    } catch (err) {
      console.error('Fel vid laddning:', err);
      alert('Kunde inte ladda böcker');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  refresh(): void {
    this.loadBooks();
  }

  showAddForm(): void {
    this.showForm = true;
    this.editingBook = null;
    this.bookModel = { title: '', author: '', publishDate: '' };
  }

  editBook(book: Book): void {
    this.showForm = true;
    this.editingBook = book;
    this.bookModel = {
      title: book.title,
      author: book.author,
      publishDate: book.publishDate.substring(0, 10)
    };
  }

  saveBook(): void {
    if (this.editingBook) {
      this.bookService.updateBook(this.editingBook.id, this.bookModel).subscribe({
        next: () => {
          this.loadBooks();
          this.cancelForm();
          alert('Boken uppdaterades!');
        },
        error: () => alert('Kunde inte uppdatera boken')
      });
    } else {
      this.bookService.createBook(this.bookModel).subscribe({
        next: () => {
          this.loadBooks();
          this.cancelForm();
          alert('Boken lades till!');
        },
        error: () => alert('Kunde inte lägga till boken')
      });
    }
  }

  deleteBook(id: number): void {
    if (confirm('Är du säker på att du vill radera den här boken?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.loadBooks();
          alert('Boken raderades!');
        },
        error: () => alert('Kunde inte radera boken')
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingBook = null;
    this.bookModel = { title: '', author: '', publishDate: '' };
  }
}
