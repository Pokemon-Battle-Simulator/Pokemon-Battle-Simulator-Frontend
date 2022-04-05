import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { url } from '../../../environments/environment'
import { map } from 'rxjs/operators';
import { BattleDataService } from 'src/app/services/battle-data.service';
import { User } from 'src/app/models/user';
import { Session, Status } from 'src/app/models/session';
import { Pokemon } from 'src/app/models/pokemon';
import { Team } from 'src/app/models/team';
import { PokemonService } from 'src/app/services/pokemon.service';
import { SessionService } from 'src/app/services/session.service';

const sessionUrl = url + '/session'

@Component({
  selector: 'app-pokemon-selector',
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.css']
})
export class PokemonSelectorComponent implements OnInit {

  @ViewChild('showcase')
  div: ElementRef
  public pokemonDataObjects = []
  public messageBoolean = false
  public message = 'Waiting for other player.'
  public showcaseSprite = ''
  public showcaseName = ''

  constructor(private http: HttpClient, private router: Router, private battleDataService: BattleDataService, private pokemonService: PokemonService, private sessionService: SessionService) { }

  //ngOnInit will run as soon as the page loads.
  ngOnInit(): void {
    this.fetchPokemon()
  }

  private fetchPokemon() {

    let fourMoves = []
    let pokemonAPI = []
    let pokemon = {
      pokemonAPIObject: {},
      name: '',
      id: 0,
      characterSelectionSprite: '',
      showcaseSprite: '',
      moveOne: {
        name: '',
        APIurl: '',
        moveOneAPIObject: {}
      },
      moveTwo: {
        name: '',
        APIurl: '',
        moveTwoAPIObject: {}
      },
      moveThree: {
        name: '',
        APIurl: '',
        moveThreeAPIObject: {}
      },
      moveFour: {
        name: '',
        APIurl: '',
        moveFourAPIObject: {}
      },
    }

    this.http.get('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0')
      .pipe(map(responseData => {

        const postArray = []
        for (const key in responseData) {
          postArray.push(responseData[key])
        }

        const pokemonArray = postArray[3]

        for (let key in pokemonArray) {
          pokemonAPI.push(pokemonArray[key].url)
        }

        //iterate through each pokemon API and get the properties.
        for (let key in pokemonAPI) {
          this.http.get(pokemonAPI[key])
            .subscribe(pokemonData => {

              //console.log(pokemonData)

              for (let key in pokemonData) {
                if (key == 'name') {
                  //console.log('name: ', pokemonData[key])
                  pokemon.name = pokemonData[key]
                } if (key == 'id') {
                  //console.log('order: ', pokemonData[key])
                  pokemon.id = pokemonData[key]
                }
                if (key == 'sprites') {
                  for (let spriteKey in pokemonData[key]) {
                    if (spriteKey == 'front_default') {
                      //console.log('Character Selection Sprite URL: ', pokemonData[key][spriteKey])
                      pokemon.characterSelectionSprite = pokemonData[key][spriteKey]
                    }
                    if (spriteKey == 'other') {
                      for (let otherKey in pokemonData[key][spriteKey]) {
                        if (otherKey == 'official-artwork') {
                          //console.log('Official-artwork: ', pokemonData[key][spriteKey][otherKey])
                          pokemon.showcaseSprite = pokemonData[key][spriteKey][otherKey]
                        }
                      }
                    }
                  }
                }
                fourMoves = []
                if (key == 'moves') {
                  let numberOfMoves = 1
                  for (let index = 0; index < pokemonData[key].length; index++) {
                    let moveData = pokemonData[key][index]
                    for (let key in moveData) {
                      if (key == 'move' && numberOfMoves <= 4) {
                        fourMoves.push({
                          name: moveData[key].name
                        })
                        //console.log(moveData[key].name)
                        numberOfMoves++
                      }
                      pokemon.moveOne = fourMoves[0]
                      pokemon.moveTwo = fourMoves[1]
                      pokemon.moveThree = fourMoves[2]
                      pokemon.moveFour = fourMoves[3]

                    }
                  }
                }

              }

              //Need to figure out why api is fetching extra empty data.
              if (pokemon.name !== undefined) {

                this.http.get(pokemon.moveOne.APIurl).pipe(map(responseData => {
                  pokemon.moveOne.moveOneAPIObject = responseData
                })


                ).subscribe()

                this.http.get(pokemon.moveTwo.APIurl).pipe(map(responseData => {
                  pokemon.moveTwo.moveTwoAPIObject = responseData
                })


                ).subscribe()

                this.http.get(pokemon.moveThree.APIurl).pipe(map(responseData => {
                  pokemon.moveThree.moveThreeAPIObject = responseData
                })


                ).subscribe()

                this.http.get(pokemon.moveFour.APIurl).pipe(map(responseData => {
                  pokemon.moveFour.moveFourAPIObject = responseData
                })


                ).subscribe()

                //We need Object.assign({}, object) to properly append objects to the array.
                //Otherwise it will not work properly. The previous object will always be overwritten
                //by the last inevidably returning a list that only contains the laste element in the array.
                this.pokemonDataObjects.push(Object.assign({}, pokemon))

              }

            })
        }

        return this.pokemonDataObjects
      }))
      .subscribe()

  }

  public getPokemon() {
    return this.pokemonDataObjects
  }

  public cancelCharacterSelection() {
    this.http.delete(`${sessionUrl}/delete`).subscribe()
    this.router.navigateByUrl('/main-menu')
  }

  public toggleMessage() {
    if (this.messageBoolean == false) {
      this.messageBoolean = true
    } else {
      this.messageBoolean = false
    }
  }

  public setPokemonShowcase(image: string, name: string) {
    this.showcaseSprite = image
    this.showcaseName = name

    this.div.nativeElement.scrollIntoView({ behavior: 'smooth' });

  }

  public async connectToSession(pokeid: number, move1: string, move2: string, move3: string, move4: string) {
    // for testing purposes only
    // let user = new User(1, "Ash", "Ketchum", "ash@pallet.net", "ashketchum", "gottacatchemall", "Pikachu");
    let opp = new User(2, "Gary", "Oak", "gary@pallet.net", "blue", "smellyalater", "Raticate");
    let user: User;
    await this.battleDataService.user
      .subscribe(
        response => {
          user = response;
          console.log(`Selector: loaded user ${user.username}`);
        }
        , error => console.log(`Selector: unable to load current user`)
      );
    let dummy_team = new Team(0, "placeholder", new User(0, "placeholder", "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"), []);
    let user_poke = new Pokemon(0, pokeid, move1, move2, move3, move4);
    let opp_poke = new Pokemon(0, 6, "mega-punch", "fire-punch", "thunder-punch", "scratch");
    let session = new Session(1, true, user, opp, Status.CONNECTED, Status.CONNECTED, "", "", user_poke, opp_poke);

    // await this.pokemonService.addPokemon(user_poke).subscribe(
    //   response => {
    //     user_poke = response;
    //     console.log(`Selector: added pokemon pokeId = ${response.pokeId}, id = ${response.id}`)
    //   },
    //   error => console.log(`Selector: unable to add pokemon ${user_poke.pokeId} to db`)
    // );

    // await this.sessionService.joinSession()
    //   .subscribe(
    //     response => {
    //       session = response;
    //       console.log(`Selector: found active session ${session.id}`);
    //     },
    //     error => console.log(`Selector: unable to join a session`)
    // );

    // if (!session) {
    //   session = new Session(0, true, user, user, Status.CONNECTED, Status.EMPTY, "", "", user_poke, opp_poke);
    //   session = await this.sessionService.createSession(session).toPromise();
    // }

    // while (session.user1_status != Status.CONNECTED || session.user2_status != Status.CONNECTED) {
    //   session = await this.sessionService.getSession(session.id).toPromise();
    //   console.log(`${session.user1_status} + ${session.user2_status}`)
    // }

    this.battleDataService.changeSession(session);
    this.battleDataService.changeUser(user);
    this.battleDataService.changePokemon(user_poke);

    setTimeout(() => this.router.navigateByUrl('/session'), 5000);
  }
}
