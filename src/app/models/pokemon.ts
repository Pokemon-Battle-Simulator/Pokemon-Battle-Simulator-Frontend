import { Team } from "./team"

export class Pokemon {
    id:number
    pokeId:number
    move1:string
    move2:string
    move3:string
    move4:string

    constructor(id:number,
        pokeId:number,
        move1:string,
        move2:string,
        move3:string,
        move4:string) {
            this.id = id;
            this.pokeId = pokeId;
            this.move1 = move1;
            this.move2 = move2;
            this.move3 = move3;
            this.move4 = move4;
    }
}