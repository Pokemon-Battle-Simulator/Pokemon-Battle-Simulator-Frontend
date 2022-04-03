import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { url } from '../../../environments/environment'
import { map } from 'rxjs/operators';

const sessionUrl = url + '/session'

@Component({
  selector: 'app-pokemon-selector',
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.css']
})
export class PokemonSelectorComponent implements OnInit {

  public pokemonDataObjects = []
  public messageBoolean = false
  message = 'Waiting for other player.'
  public showcaseSprite = ''
  public showcaseName = ''

  constructor(private http: HttpClient, private router: Router) { }

  //ngOnInit will run as soon as the page loads.
  ngOnInit(): void {
    this.fetchPokemon()
  }

  private fetchPokemon(){

    let fourMoves = []
    let pokemonAPI =[]
    let pokemon = {
      pokemonAPIObject:{},
      name: '',
      order: '',
      characterSelectionSprite:'',
      showcaseSprite:'',
      moveOne:{
        name:'',
        APIurl:'',
        moveOneAPIObject:{}
      },
      moveTwo:{
        name:'',
        APIurl:'',
        moveTwoAPIObject:{}
      },
      moveThree:{
        name:'',
        APIurl:'',
        moveThreeAPIObject:{}
      },
      moveFour:{
        name:'',
        APIurl:'',
        moveFourAPIObject:{}
      },
    }

    this.http.get('https://pokeapi.co/api/v2/pokemon?limit=200&offset=0')
    .pipe(map(responseData => {

      const postArray = []
      for(const key in responseData){
        postArray.push(responseData[key])
      }

      const pokemonArray = postArray[3]

      for(let key in pokemonArray){
        pokemonAPI.push(pokemonArray[key].url)
      }

    //iterate through each pokemon API and get the properties.
    for(let key in pokemonAPI){
      this.http.get(pokemonAPI[key])
      .subscribe(pokemonData => {

        //console.log(pokemonData)

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
            fourMoves = []
            if(key == 'moves'){
              let numberOfMoves = 1
              for(let index = 0; index < pokemonData[key].length; index++){
                let moveData = pokemonData[key][index]
                  for(let key in moveData){
                  if(key == 'move' && numberOfMoves <= 4){
                    fourMoves.push({
                      name:moveData[key].name
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
       if(pokemon.name !== undefined){

        this.http.get(pokemon.moveOne.APIurl).pipe(map(responseData =>
          {
            pokemon.moveOne.moveOneAPIObject = responseData
          })


        ).subscribe()

        this.http.get(pokemon.moveTwo.APIurl).pipe(map(responseData =>
          {
            pokemon.moveTwo.moveTwoAPIObject = responseData
          })


        ).subscribe()

        this.http.get(pokemon.moveThree.APIurl).pipe(map(responseData =>
          {
            pokemon.moveThree.moveThreeAPIObject = responseData
          })


        ).subscribe()

        this.http.get(pokemon.moveFour.APIurl).pipe(map(responseData =>
          {
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

  public getPokemon(){
    return this.pokemonDataObjects
  }

  public cancelCharacterSelection(){
    this.http.delete(`${sessionUrl}/delete`).subscribe()
    this.router.navigateByUrl('/main-menu')
  }

  public toggleMessage(){
    if(this.messageBoolean == false){
      this.messageBoolean = true
    }else{
      this.messageBoolean = false
    }
  }

  public setPokemonShowcase(image:string, name:string){
    this.showcaseSprite = image
    this.showcaseName = name
  }

  public connectToSession() {
    this.router.navigateByUrl('/session');
  }
}
