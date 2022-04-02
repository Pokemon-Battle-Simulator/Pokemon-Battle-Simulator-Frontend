import { Team } from "./team"

export class Pokemon {
    id:number
    team:Team
    pokeId:number
    move1_id:number
    move2_id:number
    move3_id:number
    move4_id:number

    constructor(id:number,
        team:Team,
        pokeId:number,
        move1_id:number,
        move2_id:number,
        move3_id:number,
        move4_id:number) {
            this.id = id;
            this.team = team;
            this.pokeId = pokeId;
            this.move1_id = move1_id;
            this.move2_id = move2_id;
            this.move3_id = move3_id;
            this.move4_id = move4_id;
    }
}