import { Component, OnInit } from '@angular/core';
import { Session, Status } from 'src/app/models/session';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { BattleDataService } from 'src/app/services/battle-data.service';
import { Type } from 'src/app/models/type';
import { Move } from 'src/app/models/move';
import { BattlePokemon } from 'src/app/models/battlePokemon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  // all for the dummy session object
  // public user1: User = new User(0, "placeholder", "placeholder", "placeholder", "placeholder", "placeholder", "placeholder");
  // public user2: User = new User(0, "placeholder", "placeholder", "placeholder", "placeholder", "placeholder", "placeholder");
  // public user1_team: Team = new Team(0, "placeholder", this.user1, []);
  // public user2_team: Team = new Team(0, "placeholder", this.user2, []);
  // public user1_poke: Pokemon = new Pokemon(0, this.user1_team, 0, 0, 0, 0, 0);
  // public user2_poke: Pokemon = new Pokemon(0, this.user2_team, 0, 0, 0, 0, 0);
  // public session: Session = new Session(0, true, this.user1, this.user2, "EMPTY", "EMPTY", 0, 0, this.user1_poke, this.user2_poke, this.user1_team, this.user2_team);

  public move_ready: boolean = false;
  public turn_result: boolean = false;
  public endscreen: boolean = false;
  public winner: User = null;
  public first_move_text: string;
  public first_move_effectiveness: string;
  public first_move_result: string;
  public first_move_effect_text: boolean = false;
  public second_move_text: string;
  public second_move_effectiveness: string;
  public second_move_result: string;
  public second_move_effect_text: boolean = false;
  public effective: number = 1;

  private cur_user: User;

  public session: Session;
  public cur_pokemon: BattlePokemon = new BattlePokemon();
  public opp_pokemon: BattlePokemon = new BattlePokemon();

  constructor(private http: HttpClient, private sessionService: SessionService, private battleDataService: BattleDataService, private router: Router) {
    this.battleDataService.user
      .subscribe(
        user => {
          this.cur_user = user;
          console.log(`Session: loaded user ${this.cur_user.id}, ${this.cur_user.username}`);
        },
        error => console.log('Session: unable to get current user info')
      );
    this.battleDataService.pokemon
      .subscribe(
        pokemon => {
          this.cur_pokemon.object = pokemon
          console.log(`Session: loaded pokemon ${this.cur_pokemon.object.id}, ${this.cur_pokemon.object.pokeId}`);
        },
        error => console.log('Session: unable to get current pokemon info')
      );
    this.battleDataService.session
      .subscribe(
        session => this.session = session,
        error => console.log(`Session: unable to get session information`)
      )
  }

  ngOnInit(): void {

    // this.sessionService.joinSession()
    //   .subscribe(
    //     session => {
    //       if (session) {
    //         session.
    //       } else {
    //         this.session.user1 = this.cur_user;
    //         this.session.user1_poke = this.cur_pokemon.object;
    //         this.session.user1_status = "CONNECTED";

    //         this.sessionService.createSession(this.session)
    //           .subscribe(
    //             session => {
    //               this.session = session;
    //               console.log("Session: successfully created new session")
    //             },
    //             error => console.log("Session: unable to create a new session")
    //           )
    //       }
    //     },
    //     error => console.log('Session: unable to find a session')
    //   );

    // get the moves of the current pokemon
    if (this.cur_user.id == this.session.user1.id) {
      this.getMove(this.session.user1_poke.move1).then(move => this.cur_pokemon.moves.push(move));
      this.getMove(this.session.user1_poke.move2).then(move => this.cur_pokemon.moves.push(move));
      this.getMove(this.session.user1_poke.move3).then(move => this.cur_pokemon.moves.push(move));
      this.getMove(this.session.user1_poke.move4).then(move => this.cur_pokemon.moves.push(move));

      this.getMove(this.session.user2_poke.move1).then(move => this.opp_pokemon.moves.push(move));
      this.getMove(this.session.user2_poke.move2).then(move => this.opp_pokemon.moves.push(move));
      this.getMove(this.session.user2_poke.move3).then(move => this.opp_pokemon.moves.push(move));
      this.getMove(this.session.user2_poke.move4).then(move => this.opp_pokemon.moves.push(move));
    } else {
      this.getMove(this.session.user2_poke.move1).then(move => this.cur_pokemon.moves.push(move));
      this.getMove(this.session.user2_poke.move2).then(move => this.cur_pokemon.moves.push(move));
      this.getMove(this.session.user2_poke.move3).then(move => this.cur_pokemon.moves.push(move));
      this.getMove(this.session.user2_poke.move4).then(move => this.cur_pokemon.moves.push(move));

      this.getMove(this.session.user1_poke.move1).then(move => this.opp_pokemon.moves.push(move));
      this.getMove(this.session.user1_poke.move2).then(move => this.opp_pokemon.moves.push(move));
      this.getMove(this.session.user1_poke.move3).then(move => this.opp_pokemon.moves.push(move));
      this.getMove(this.session.user1_poke.move4).then(move => this.opp_pokemon.moves.push(move));
    }

    console.log(this.cur_pokemon.object.pokeId);

    // get all needed information from pokemon api for the current pokemon
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${this.cur_pokemon.object.pokeId}`)
      .subscribe(p => {
        // get the name of the current pokemon
        if (!p.hasOwnProperty('name')) {
          console.log(`Session: unable to load pokemon name from https://pokeapi.co/api/v2/pokemon/${this.cur_pokemon.object.id}`);
          return;
        }
        this.cur_pokemon.name = p['name'];

        // calculate all of the stats for the current pokemon
        if (!p.hasOwnProperty('stats')) {
          console.log(`Session: unable to load stats of ${this.cur_pokemon.name}`);
          return;
        }

        for (let stat of p['stats']) {

          if (!stat.hasOwnProperty('base_stat') || !stat.hasOwnProperty('stat')) {
            console.log(`Session: unable to load stat info for ${this.cur_pokemon.name}`);
            return;
          }

          let info = stat['stat'];
          if (!info.hasOwnProperty('name')) {
            console.log(`Session: unable to load name of stat for ${this.cur_pokemon.name}`);
            return;
          }

          this.cur_pokemon.stats.push(this.calculateStat(stat['base_stat'], info['name']));
        }

        this.cur_pokemon.current_hp = this.cur_pokemon.stats[0];

        // get the types of the current pokemon
        if (!p.hasOwnProperty('types')) {
          console.log(`Session: unable to load types of ${this.cur_pokemon.name}`);
          return;
        }

        for (let type of p['types']) {
          if (!type.hasOwnProperty('type') || !type['type'].hasOwnProperty('url')) {
            console.log(`Session: unable to load type for ${this.cur_pokemon.name}`);
            return;
          }

          let typeUrl: string = type['type']['url'];
          this.http.get(typeUrl)
            .subscribe(
              type => {
                let typeInfo: Type = new Type();

                // get the name of the type
                if (!type.hasOwnProperty('name')) {
                  console.log(`Session: unable to load name of type @ ${typeUrl}`);
                  return;
                }
                typeInfo.name = type['name'];

                // get the relations of the type
                if (!type.hasOwnProperty('damage_relations')) {
                  console.log(`Session: unable to load damage_relations of ${typeInfo.name}`);
                  return;
                }

                // get double_damage_from of the type
                let relations: Object = type['damage_relations'];
                if (!relations.hasOwnProperty('double_damage_from')) {
                  console.log(`Session: unable to load double_damage_from of ${typeInfo.name}`);
                  return;
                }

                let double_damage_from: Object[] = relations['double_damage_from'];
                for (let double_damage_type of double_damage_from) {
                  if (!double_damage_type.hasOwnProperty('name')) {
                    console.log(`Session: unable to load double_damage_from[].name of ${typeInfo.name}`);
                    return;
                  }

                  typeInfo.double_damage_from.push(double_damage_type['name']);
                }

                // get half_damage_from of the type
                if (!relations.hasOwnProperty('half_damage_from')) {
                  console.log(`Session: unable to load half_damage_from of ${typeInfo.name}`);
                  return;
                }

                let half_damage_from: Object[] = relations['half_damage_from'];
                for (let half_damage_type of half_damage_from) {
                  if (!half_damage_type.hasOwnProperty('name')) {
                    console.log(`Session: unable to load half_damage_from[].name of ${typeInfo.name}`);
                    return;
                  }

                  typeInfo.half_damage_from.push(half_damage_type['name']);
                }

                // get no_damage_from of the type
                if (!relations.hasOwnProperty('no_damage_from')) {
                  console.log(`Session: unable to load no_damage_from of ${typeInfo.name}`);
                  return;
                }

                let no_damage_from: Object[] = relations['no_damage_from'];
                for (let no_damage_type of no_damage_from) {
                  if (!no_damage_type.hasOwnProperty('name')) {
                    console.log(`Session: unable to load no_damage_from[].name of ${typeInfo.name}`);
                    return;
                  }

                  typeInfo.no_damage_from.push(no_damage_type['name']);
                }

                this.cur_pokemon.types.push(typeInfo);
              },
              error => console.log(`Session: unable to get type information from ${typeUrl}`)
            );
        }

        // get the back sprite of the current pokemon
        if (!p.hasOwnProperty('sprites') || !p['sprites'].hasOwnProperty('back_default')) {
          console.log(`Session: unable to load sprite for ${this.cur_pokemon.name}`);
          return;
        }

        this.cur_pokemon.sprite = p['sprites']['back_default'];

        console.log(`Session: loaded current pokemon ${this.cur_pokemon.name}`);
      });

    // get all needed information from pokemon api for the opponent's pokemon
    this.opp_pokemon.object = this.session.user2_poke;
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${this.opp_pokemon.object.pokeId}`)
      .subscribe(p => {
        // get the name of the current pokemon
        if (!p.hasOwnProperty('name')) {
          console.log(`Session: unable to load pokemon species from https://pokeapi.co/api/v2/pokemon/${this.opp_pokemon.object.pokeId}`);
          return;
        }
        this.opp_pokemon.name = p['name'];

        // calculate all of the stats for the current pokemon
        if (!p.hasOwnProperty('stats')) {
          console.log(`Session: unable to load stats of ${this.opp_pokemon.name}`);
          return;
        }

        for (let stat of p['stats']) {

          if (!stat.hasOwnProperty('base_stat') || !stat.hasOwnProperty('stat')) {
            console.log(`Session: unable to load stat info for ${this.opp_pokemon.name}`);
            return;
          }

          let info = stat['stat'];
          if (!info.hasOwnProperty('name')) {
            console.log(`Session: unable to load name of stat for ${this.cur_pokemon.name}`);
            return;
          }

          this.opp_pokemon.stats.push(this.calculateStat(stat['base_stat'], info['name']));
        }

        this.opp_pokemon.current_hp = this.opp_pokemon.stats[0];

        // get the types of the current pokemon
        if (!p.hasOwnProperty('types')) {
          console.log(`Session: unable to load types of ${this.opp_pokemon.name}`);
          return;
        }

        for (let type of p['types']) {
          if (!type.hasOwnProperty('type') || !type['type'].hasOwnProperty('url')) {
            console.log(`Session: unable to load type for ${this.opp_pokemon.name}`);
            return;
          }

          let typeUrl: string = type['type']['url'];
          this.http.get(typeUrl)
            .subscribe(
              type => {
                let typeInfo: Type = new Type();

                // get the name of the type
                if (!type.hasOwnProperty('name')) {
                  console.log(`Session: unable to load name of type @ ${typeUrl}`);
                  return;
                }
                typeInfo.name = type['name'];

                // get the relations of the type
                if (!type.hasOwnProperty('damage_relations')) {
                  console.log(`Session: unable to load damage_relations of ${typeInfo.name}`);
                  return;
                }

                // get double_damage_from of the type
                let relations: Object = type['damage_relations'];
                if (!relations.hasOwnProperty('double_damage_from')) {
                  console.log(`Session: unable to load double_damage_from of ${typeInfo.name}`);
                  return;
                }

                let double_damage_from: Object[] = relations['double_damage_from'];
                for (let double_damage_type of double_damage_from) {
                  if (!double_damage_type.hasOwnProperty('name')) {
                    console.log(`Session: unable to load double_damage_from[].name of ${typeInfo.name}`);
                    return;
                  }

                  typeInfo.double_damage_from.push(double_damage_type['name']);
                }

                // get half_damage_from of the type
                if (!relations.hasOwnProperty('half_damage_from')) {
                  console.log(`Session: unable to load half_damage_from of ${typeInfo.name}`);
                  return;
                }

                let half_damage_from: Object[] = relations['half_damage_from'];
                for (let half_damage_type of half_damage_from) {
                  if (!half_damage_type.hasOwnProperty('name')) {
                    console.log(`Session: unable to load half_damage_from[].name of ${typeInfo.name}`);
                    return;
                  }

                  typeInfo.half_damage_from.push(half_damage_type['name']);
                }

                // get no_damage_from of the type
                if (!relations.hasOwnProperty('no_damage_from')) {
                  console.log(`Session: unable to load no_damage_from of ${typeInfo.name}`);
                  return;
                }

                let no_damage_from: Object[] = relations['no_damage_from'];
                for (let no_damage_type of no_damage_from) {
                  if (!no_damage_type.hasOwnProperty('name')) {
                    console.log(`Session: unable to load no_damage_from[].name of ${typeInfo.name}`);
                    return;
                  }

                  typeInfo.no_damage_from.push(no_damage_type['name']);
                }

                this.opp_pokemon.types.push(typeInfo);
              },
              error => console.log(`Session: unable to get type information from ${typeUrl}`)
            );
        }

        // get the back sprite of the current pokemon
        if (!p.hasOwnProperty('sprites') || !p['sprites'].hasOwnProperty('front_default')) {
          console.log(`Session: unable to load sprite for ${this.opp_pokemon.name}`);
          return;
        }

        this.opp_pokemon.sprite = p['sprites']['front_default'];

        console.log(`Session: loaded opponent pokemon ${this.opp_pokemon.name}`);
      });

    // start out each pokemon with max hp
    this.cur_pokemon.current_hp = this.cur_pokemon.stats[0];
    this.opp_pokemon.current_hp = this.opp_pokemon.stats[0];
  }

  private calculateStat(basestat, statType) {
    let level = 50;

    switch (statType) {
      case ("hp"):
        return Math.round(2 * basestat * level / 100 - 0.5) + level + 10;
      case ("attack"):
      case ("defense"):
      case ("special-attack"):
      case ("special-defense"):
      case ("speed"):
        return Math.round(2 * basestat * level / 100 - 0.5) + 5;
      default:
        return -1;
    }
  }

  public async moveSelect(move_name: string) {
    // this.sessionService.getSession(this.session.id).subscribe(
    //   session => this.session = session,
    //   error => console.log(`Session: unable to get session`)
    // );

    if (this.cur_user.id == this.session.user1.id) {
      this.session.user1_move = move_name;
      this.session.user1_status = Status.READY;

      this.session.user2_move = this.opp_pokemon.moves[Math.round(Math.random() * 4 - 0.5)].name;
    } else {
      this.session.user2_move = move_name;
      this.session.user2_status = Status.READY;

      this.session.user1_move = this.opp_pokemon.moves[Math.round(Math.random() * 4 - 0.5)].name;
    }

    // this.sessionService.updateSessionUserOnly(this.session, this.cur_user.id).subscribe(
    //   session => this.session = session,
    //   error => console.log(`Session: unable to fetch session ${this.session.id}`)
    // );

    this.move_ready = true;

    // this.session = await this.sessionService.updateSessionUserOnly(this.session, this.cur_user.id).toPromise();

    // if (this.session.user1_status != Status.READY || this.session.user2_status != Status.READY) {
    //   while (this.session.user1_status != Status.READY || this.session.user2_status != Status.READY) {
    //     this.session = await this.sessionService.getSession(this.session.id).toPromise();
    //   }

    //   // play out the turn
    //   await this.playTurn();


    // } else {
    //   // play out the turn
    //   await this.playTurn();

    //   // persist the new session to the database
    //   this.session = await this.sessionService.updateSession(this.session).toPromise();
    // }

    switch (await this.playTurn()) {
      case 0:
        console.log(`neither pokemon has fainted yet`);
        break;
      case 1:
        console.log(`current pokemon has fainted`);
        this.endscreen = true;
        this.winner = this.session.user2;
        break;
      case 2:
        console.log(`current pokemon has fainted`);
        this.endscreen = true;
        this.winner = this.session.user1;
        break;
    }

    this.move_ready = false;
  }

  private async getMove(move_name: string): Promise<Move> {
    let foundMove: Move = new Move();

    const move = await this.http.get(`https://pokeapi.co/api/v2/move/${move_name}`).toPromise();

    foundMove = new Move();
    foundMove.name = move_name;

    // get the accuracy of the move
    if (!move.hasOwnProperty('accuracy')) {
      console.log(`Session: unable to get accuracy of move ${move_name}`);
      foundMove = undefined;
      return;
    }
    foundMove.accuracy = move['accuracy'];

    // get the power of the move
    if (!move.hasOwnProperty('power')) {
      console.log(`Session: unable to get power of move ${move_name}`);
      foundMove = undefined;
      return;
    }
    foundMove.power = move['power'];

    // get the priority of the move
    if (!move.hasOwnProperty('priority')) {
      console.log(`Session: unable to get priority of move ${move_name}`);
      foundMove = undefined;
      return;
    }
    foundMove.priority = move['priority'];

    // get the damage_class of the move
    if (!move.hasOwnProperty('damage_class') || !move['damage_class'].hasOwnProperty('name')) {
      console.log(`Session: unable to get damage_class of move ${move_name}`);
      foundMove = undefined;
      return;
    }
    foundMove.damage_class = move['damage_class']['name'];

    // get the type of the move
    if (!move.hasOwnProperty('type') || !move['type'].hasOwnProperty('name')) {
      console.log(`Session: unable to get type of move ${move_name}`);
      foundMove = undefined;
      return;
    }
    foundMove.type = move['type']['name'];

    console.log(`Session: loaded move ${move_name}`);

    console.log(foundMove);
    return foundMove;
  }

  private async playTurn(): Promise<number> {
    let user1_move: Move;
    let user2_move: Move;

    this.first_move_text = "";
    this.first_move_effectiveness = "";
    this.first_move_result = "";
    this.first_move_effect_text = false;
    this.second_move_text = "";
    this.second_move_effectiveness = "";
    this.second_move_result = "";
    this.second_move_effect_text = false;

    console.log(`${this.session.user1_move}, ${this.session.user2_move}`);
    await this.getMove(this.session.user1_move).then(move => user1_move = move);
    await this.getMove(this.session.user2_move).then(move => user2_move = move);
    let first: number;

    // which move has the highest priority?
    if (user1_move.priority > user2_move.priority) {
      first = 1;
    } else if (user1_move.priority < user2_move.priority) {
      first = 2
    } else {
      // the moves have the same priority, moving to the pokemon's speed
      // which pokemon is faster?
      if (this.cur_pokemon.stats[5] > this.opp_pokemon.stats[5]) {
        first = 1;
      } else if (this.cur_pokemon.stats[5] < this.opp_pokemon.stats[5]) {
        first = 2;
      } else {
        // both of the pokemon have the same spped, moving to a coin flip
        // let a coin flip decide which pokemon goes first
        first = Math.round(Math.random() * 2 + 0.5);
      }
    }

    console.log(`first = ${first}`);

    // calculate the first move's damage
    let damage1: number = this.damage(user1_move, this.cur_pokemon, this.opp_pokemon);
    let effective1 = this.effective;
    // calculate the second move's damage
    let damage2: number = this.damage(user2_move, this.opp_pokemon, this.cur_pokemon);
    let effective2 = this.effective;

    console.log(`${effective1}, ${damage1}, ${effective2}, ${damage2}`);

    // calculate the moves in order
    if (first == 1) {
      // poke1's move goes first
      this.first_move_text = `${this.cur_pokemon.name} used ${user1_move.name}!`

      if (damage1 >= 0) {
        this.opp_pokemon.current_hp -= Math.max(damage1, 1);
        this.first_move_result = `Opponent's ${this.opp_pokemon.name} took ${Math.max(damage1, 1)} damage!`

        // is the move effective/not effective?
        if (effective1 > 1) {
          this.first_move_effectiveness = "It's super effective!";
          this.first_move_effect_text = true;
        } else if (effective1 < 1) {
          this.first_move_effectiveness = "It's not very effective...";
          this.first_move_effect_text = true;
        }

        // did the pokemon faint?
        if (this.opp_pokemon.current_hp <= 0) {
          this.opp_pokemon.current_hp = 0;
          return 2;
        }
      } else if (damage1 == -1) {
        this.first_move_result = "the move missed!";
      } else {
        this.first_move_result = "the move had no effect!";
      }

      // poke2's move goes last
      this.second_move_text = `Opponent's ${this.opp_pokemon.name} used ${user2_move.name}!`

      if (damage2 >= 0) {
        this.cur_pokemon.current_hp -= Math.max(damage2, 1);
        this.second_move_result = `${this.cur_pokemon.name} took ${Math.max(damage2, 1)} damage!`

        // is the move effective/not effective?
        if (effective2 > 1) {
          this.second_move_effectiveness = "It's super effective!";
          this.second_move_effect_text = true;
        } else if (effective2 < 1) {
          this.second_move_effectiveness = "It's not very effective...";
          this.second_move_effect_text = true;
        }

        // did the pokemon faint?
        if (this.cur_pokemon.current_hp <= 0) {
          this.cur_pokemon.current_hp = 0;
          return 1;
        }
      } else if (damage1 == -1) {
        this.second_move_result = "the move missed!";
      } else {
        this.second_move_result = "the move had no effect!";
      }
    } else {
      // poke2's move goes first
      this.first_move_text = `Opponent's ${this.opp_pokemon.name} used ${user2_move.name}!`

      if (damage2 >= 0) {
        this.cur_pokemon.current_hp -= Math.max(damage2, 1);
        this.first_move_result = `${this.cur_pokemon.name} took ${Math.max(damage2, 1)} damage!`

        // is the move effective/not effective?
        if (effective2 > 1) {
          this.first_move_effectiveness = "It's super effective!";
          this.first_move_effect_text = true;
        } else if (effective2 < 1) {
          this.first_move_effectiveness = "It's not very effective...";
          this.first_move_effect_text = true;
        }

        // did the pokemon faint?
        if (this.cur_pokemon.current_hp <= 0) {
          this.cur_pokemon.current_hp = 0;
          return 1;
        }
      } else if (damage1 == -1) {
        this.first_move_result = "the move missed!";
      } else {
        this.first_move_result = "the move had no effect!";
      }

      // poke1's move goes last
      this.second_move_text = `${this.cur_pokemon.name} used ${user1_move.name}!`

      if (damage1 >= 0) {
        this.opp_pokemon.current_hp -= Math.max(damage1, 1);
        this.second_move_result = `Opponent's ${this.opp_pokemon.name} took ${Math.max(damage1, 1)} damage!`

        // is the move effective/not effective?
        if (effective1 > 1) {
          this.second_move_effectiveness = "It's super effective!";
          this.second_move_effect_text = true;
        } else if (effective1 < 1) {
          this.second_move_effectiveness = "It's not very effective...";
          this.second_move_effect_text = true;
        }

        // did the pokemon faint?
        if (this.opp_pokemon.current_hp <= 0) {
          this.opp_pokemon.current_hp = 0;
          return 2;
        }
      } else if (damage1 == -1) {
        this.second_move_result = "the move missed!";
      } else {
        this.second_move_result = "the move had no effect!";
      }
    }

    // neither pokemon fainted this turn
    this.turn_result = true;

    setTimeout(() => this.turn_result = false, 10000);
    return 0;
  }

  damage(move: Move, attacker: BattlePokemon, defender: BattlePokemon): number {
    let level: number = 50;

    console.log(`${move.name}, ${attacker.name}, ${defender.name}`);

    // does the move affect the defending pokemon?
    if (defender.types[0].no_damage_from.find(t => t == move.type) ||
      (defender.types[1] && defender.types[1].no_damage_from.find(t => t == move.type)))
      return -2;

    // does the move hit?
    let hit = Math.random() * 100 + 1;
    if (hit > move.accuracy)
      return -1;

    // attacking pokemon's attack stat
    let attack = move.damage_class == "physical" ? attacker.stats[1] : attacker.stats[3];

    // defending pokemon's defensive stat
    let defense = move.damage_class == "physical" ? defender.stats[2] : defender.stats[4];

    // Base damage
    let damage = (2 * level / 5 + 2) * move.power * attack / defense / 50 + 2;

    // Critical
    if (1 > Math.random() * 24)
      damage *= 1.5;

    // random
    damage *= Math.round(Math.random() * 16 + 85 - 0.5) / 100;

    // STAB (same type attack bonus)
    if (attacker.types[0].name == move.type ||
      (attacker.types[1] && attacker.types[1].name == move.type))
      damage *= 1.5;

    // type effectiveness
    let effective = 1

    // double damage
    if (defender.types[0].double_damage_from.find(t => t == move.type))
      effective *= 2;

    if (defender.types[1] && defender.types[1].double_damage_from.find(t => t == move.type))
      effective *= 2;

    // half damage
    if (defender.types[0].half_damage_from.find(t => t == move.type))
      effective /= 2;

    if (defender.types[1] && defender.types[1].half_damage_from.find(t => t == move.type))
      effective /= 2;

    this.effective = effective;
    damage *= effective;

    return Math.round(damage - 0.5);
  }

  public getMoves(): Move[] {
    return this.cur_pokemon.moves;
  }

  public exit(): void {
    this.router.navigateByUrl("/pokemon-selector");
  }
}
