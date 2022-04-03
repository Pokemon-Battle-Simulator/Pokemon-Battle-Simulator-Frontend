import { Team } from "./team"

export class Pokemon {
    id:number
    team:Team
    pokeId:number
    move1_name:string
    move2_name:string
    move3_name:string
    move4_name:string

    constructor(id:number,
        team:Team,
        pokeId:number,
        move1_name:string,
        move2_name:string,
        move3_name:string,
        move4_name:string) {
            this.id = id;
            this.team = team;
            this.pokeId = pokeId;
            this.move1_name = move1_name;
            this.move2_name = move2_name;
            this.move3_name = move3_name;
            this.move4_name = move4_name;
    }
}