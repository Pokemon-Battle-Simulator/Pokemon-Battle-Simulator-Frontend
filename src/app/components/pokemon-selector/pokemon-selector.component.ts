import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//The map operator allows us to get some data and
//return new data which is then automatically re-wrapped
//into an observable to that we can still subscribe to it.
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-pokemon-selector',
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.css']
})
export class PokemonSelectorComponent implements OnInit {

  pokemonAPI = []
  pokemonDataObjects = []


  constructor(private http: HttpClient) { }

  //ngOnInit will run as soon as the page loads.
  ngOnInit(): void {
    this.fetchPokemon()
  }

  private fetchPokemon(){

    let fourMoves = []
    let pokemon = {
      name: '',
      order: '',
      characterSelectionSprite:'',
      showcaseSprite:'',
      moveOne:'',
      moveTwo:'',
      moveThree:'',
      moveFour:'',
    }

    this.http.get('https://pokeapi.co/api/v2/pokemon?limit=200&offset=0')
    .pipe(map(responseData => {

      const postArray = []
      for(const key in responseData){
        postArray.push(responseData[key])
      }

      const pokemonArray = postArray[3]

      for(let key in pokemonArray){
        this.pokemonAPI.push(pokemonArray[key].url)
      }

    //iterate through each pokemon API and get the properties.
    for(let key in this.pokemonAPI){
      this.http.get(this.pokemonAPI[key])
      .subscribe(pokemonData => {

          for(let key in pokemonData){
        if(key == 'name'){
          //console.log('name: ', pokemonData[key])
          pokemon.name = pokemonData[key]
        }if(key == 'order'){
          //console.log('order: ', pokemonData[key])
          pokemon.order = pokemonData[key]
        }
        if(key == 'sprites'){
          for(let spriteKey in pokemonData[key]){
            if(spriteKey == 'front_default'){
              //console.log('Character Selection Sprite URL: ', pokemonData[key][spriteKey])
              pokemon.characterSelectionSprite = pokemonData[key][spriteKey]
            }
            if(spriteKey == 'other'){
                for(let otherKey in pokemonData[key][spriteKey]){
                  if(otherKey == 'official-artwork'){
                    //console.log('Official-artwork: ', pokemonData[key][spriteKey][otherKey])
                    pokemon.showcaseSprite = pokemonData[key][spriteKey][otherKey]
                  }
                }
            }
          }
        }

        if(key == 'moves'){
           let numberOfMoves = 1
           for(let index = 0; index < pokemonData[key].length; index++){
             let moveData = pokemonData[key][index]
              for(let key in moveData){
              if(key == 'move' && numberOfMoves <= 4){
                fourMoves.push(moveData[key].name)
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

       console.log(pokemon)

       //We need Object.assign({}, object) to properly append objects to the array.
       //Otherwise it will not work properly. The previous object will always be overwritten
       //by the last inevidably returning a list that only contains the laste element in the array.
      this.pokemonDataObjects.push(Object.assign({}, pokemon))

      })
    }
      return this.pokemonDataObjects
    }))
    .subscribe(pokemonObjects => {
      console.log(pokemonObjects)
    })

  }

  public getPokemon(){
    return this.pokemonDataObjects
  }
}
