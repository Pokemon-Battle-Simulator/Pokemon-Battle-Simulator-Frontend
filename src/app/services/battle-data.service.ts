import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { Session } from '../models/session';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class BattleDataService {
  private userSource = new BehaviorSubject<User>(undefined);
  user = this.userSource.asObservable();

  private pokemonSource = new BehaviorSubject<Pokemon>(undefined);
  pokemon = this.pokemonSource.asObservable();

  private sessionSource = new BehaviorSubject<Session>(undefined);
  session = this.sessionSource.asObservable();

  constructor() { }

  changeUser(user: User) {
    this.userSource.next(user);
  }

  changePokemon(pokemon: Pokemon) {
    this.pokemonSource.next(pokemon);
  }

  changeSession(session: Session) {
    this.sessionSource.next(session)
  }
}
