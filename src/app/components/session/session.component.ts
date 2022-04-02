import { Component, OnInit } from '@angular/core';
import { Session } from 'src/app/models/session';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { BattleDataService } from 'src/app/services/battle-data.service';
import { Type } from 'src/app/models/type';
import { Move } from 'src/app/models/move';
import { BattlePokemon } from 'src/app/models/battlePokemon';

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

  private cur_user: User;

  public session: Session;
  public cur_pokemon: BattlePokemon = new BattlePokemon();
  public opp_pokemon: BattlePokemon = new BattlePokemon();

  constructor(private http: HttpClient, private sessionService: SessionService, private battleDataService: BattleDataService, private router: Router) {
    this.battleDataService.user
      .subscribe(
        user => this.cur_user = user,
        error => console.log('Session: unable to get current user info')
      );
    this.battleDataService.pokemon
      .subscribe(
        pokemon => this.cur_pokemon.object = pokemon,
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

    if (this.cur_user.id == this.session.user1.id) {
      this.cur_pokemon.moves.push(this.getMove(this.session.user1_poke.move1_id));
      this.cur_pokemon.moves.push(this.getMove(this.session.user1_poke.move2_id));
      this.cur_pokemon.moves.push(this.getMove(this.session.user1_poke.move3_id));
      this.cur_pokemon.moves.push(this.getMove(this.session.user1_poke.move4_id));
    } else {
      this.cur_pokemon.moves.push(this.getMove(this.session.user2_poke.move1_id));
      this.cur_pokemon.moves.push(this.getMove(this.session.user2_poke.move2_id));
      this.cur_pokemon.moves.push(this.getMove(this.session.user2_poke.move3_id));
      this.cur_pokemon.moves.push(this.getMove(this.session.user2_poke.move4_id));
    }

    // get all needed information from pokemon api for the current pokemon
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${this.cur_pokemon.object.id}`)
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

                for (let double_damage_type of type['double_damage_from']) {
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

                for (let half_damage_type of type['half_damage_from']) {
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

                for (let no_damage_type of type['no_damage_from']) {
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

                for (let double_damage_type of type['double_damage_from']) {
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

                for (let half_damage_type of type['half_damage_from']) {
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

                for (let no_damage_type of type['no_damage_from']) {
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

  public moveSelect(move_id) {
    // this.sessionService.getSession(this.session.id).subscribe(
    //   session => this.session = session,
    //   error => console.log(`Session: unable to get session`)
    // );

    if (this.cur_user.id == this.session.user1.id) {
      this.session.user1_move = move_id;
      this.session.user1_status = "READY";
    } else {
      this.session.user2_move = move_id;
      this.session.user2_status = "READY";
    }

    this.sessionService.updateSessionUserOnly(this.session, this.cur_user.id).subscribe(
      session => this.session = session,
      error => console.log(`Session: unable to fetch session ${this.session.id}`)
    );

    this.move_ready = true;

    if (this.session.user1_status != 'READY' && this.session.user1_status != 'READY') {
      let interval = setInterval(() => this.sessionService.getSession(this.session.id), 1000);

      // wait for both players to be ready
      while (this.session.user1_status != 'READY' && this.session.user2_status != 'READY');

      // stop making requests to the database
      clearInterval(interval);

      // play out the turn
      this.playTurn();
    } else {
      // play out the turn
      this.playTurn();

      // persist the new session to the database
      this.sessionService.updateSession(this.session);
    }

    this.move_ready = false;
  }

  private getMove(move_id: number): Move {
    let foundMove: Move;

    this.http.get(`https://pokeapi.co/api/v2/move/${move_id}`)
      .subscribe(
        move => {
          foundMove = new Move();

          // get the name of the move
          if (!move.hasOwnProperty('name')) {
            console.log(`Session: unable to get name of move with id ${move_id}`);
            foundMove = undefined;
            return;
          }
          foundMove.name = move['name'];

          // get the accuracy of the move
          if (!move.hasOwnProperty('accuracy')) {
            console.log(`Session: unable to get accuracy of move ${foundMove.name}`);
            foundMove = undefined;
            return;
          }
          foundMove.accuracy = move['accuracy'];

          // get the power of the move
          if (!move.hasOwnProperty('power')) {
            console.log(`Session: unable to get power of move ${foundMove.name}`);
            foundMove = undefined;
            return;
          }
          foundMove.power = move['power'];

          // get the priority of the move
          if (!move.hasOwnProperty('priority')) {
            console.log(`Session: unable to get priority of move ${foundMove.name}`);
            foundMove = undefined;
            return;
          }
          foundMove.priority = move['priority'];

          // get the damage_class of the move
          if (!move.hasOwnProperty('damage_class') || !move['damage_class'].hasOwnProperty('name')) {
            console.log(`Session: unable to get damage_class of move ${foundMove.name}`);
            foundMove = undefined;
            return;
          }
          foundMove.damage_class = move['damage_class']['name'];

          // get the type of the move
          if (!move.hasOwnProperty('type') || !move['type'].hasOwnProperty('name')) {
            console.log(`Session: unable to get type of move ${foundMove.name}`);
            foundMove = undefined;
            return;
          }
          foundMove.type = move['type']['name'];
        },
        error => {
          console.log(`failed to get move with id ${move_id}`);
        }
      );

    return foundMove;
  }

  private playTurn(): number {
    let user1_move: Move = this.getMove(this.session.user1_move);
    let user2_move: Move = this.getMove(this.session.user2_move);
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

    // calculate the first move's damage
    let damage1: number = this.damage(user1_move, this.cur_pokemon, this.opp_pokemon);
    // calculate the second move's damage
    let damage2: number = this.damage(user2_move, this.opp_pokemon, this.cur_pokemon);

    // calculate the moves in order
    if (first == 1) {
      // poke1's move goes first
      if (damage1 >= 0) {
        this.opp_pokemon.current_hp -= Math.max(damage1, 1);

        // did the pokemon faint?
        if (this.opp_pokemon.current_hp <= 0)
          return 2;
      }

      // poke2's move goes last
      if (damage2 >= 0) {
        this.cur_pokemon.current_hp -= Math.max(damage2, 1);

        // did the pokemon faint?
        if (this.cur_pokemon.current_hp <= 0)
          return 1;
      }
    } else {
      // poke2's move goes first 
      if (damage2 >= 0) {
        this.cur_pokemon.current_hp -= Math.max(damage2, 1);

        // did the pokemon faint?
        if (this.cur_pokemon.current_hp <= 0)
          return 1;
      }

      // poke1's move goes last
      if (damage1 >= 0) {
        this.opp_pokemon.current_hp -= Math.max(damage1, 1);

        // did the pokemon faint?
        if (this.opp_pokemon.current_hp <= 0)
          return 2;
      }
    }

    // neither pokemon fainted this turn
    return 0;
  }

  damage(move: Move, attacker: BattlePokemon, defender: BattlePokemon): number {
    let level: number = 50;

    // does the move affect the defending pokemon?
    if (defender.types[0].no_damage_from.find(t => t == move.type) ||
      defender.types[1].no_damage_from.find(t => t == move.type))
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
    let damage = (2 * level / 5 + 2) * move.power * attack / defense + 2;

    // Critical
    if (1 > Math.random() * 24)
      damage *= 1.5;

    // random
    damage *= Math.round(Math.random() * 16 + 85 - 0.5) / 100;

    // STAB (same type attack bonus)
    if (attacker.types[0].name == move.type ||
      attacker.types[1].name == move.type)
      damage *= 1.5;

    // type effectiveness
    let effective = 1

    // double damage
    if (defender.types[0].double_damage_from.find(t => t == move.type))
      effective *= 2;

    if (defender.types[1].double_damage_from.find(t => t == move.type))
      effective *= 2;

    // half damage
    if (defender.types[0].half_damage_from.find(t => t == move.type))
      effective /= 2;

    if (defender.types[1].half_damage_from.find(t => t == move.type))
      effective /= 2;

    damage *= effective;

    return Math.round(damage - 0.5);
  }
}
