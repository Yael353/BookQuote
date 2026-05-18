import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        alert('Registrering lyckades! Du kan nu logga in.');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Registrering misslyckades. Användarnamnet kan redan finnas.');
      }
    });
  }
}
