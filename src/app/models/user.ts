export class User {

  id:number
  firstName:string
  lastName:string
  email:string
  username:string
  password:string
  favoritePokemon:string

  //For user registration
  constructor(id: number, firstName:string, lastName:string, email:string, username:string, password:string, favoritePokemon:string){
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.username = username
    this.password = password
    this.favoritePokemon = favoritePokemon
  }

}
