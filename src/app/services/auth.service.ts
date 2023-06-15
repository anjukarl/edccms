import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = false;
  isLoggedIn = new Subject<boolean>();

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  signIn(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.loggedIn = true;
        this.isLoggedIn.next(true);
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        this.loggedIn = false;
        this.isLoggedIn.next(false);
      });
  }

  isAuthenticated() {
    return this.loggedIn;
  }

  signOut() {
    this.loggedIn = false;
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}
