import { Pokemon } from "./pokemon"
import { User } from "./user"

export class Team {
    id: number
    name: string
    user: User
    pokemon: Pokemon[]

    constructor(id: number,
        name: string,
        user: User,
        pokemon: Pokemon[]) {

        this.id = id;
        this.name = name;
        this.user = user;
        this.pokemon = pokemon;
    }
}