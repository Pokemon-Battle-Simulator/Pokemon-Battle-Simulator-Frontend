import { User } from "./user"
import { Pokemon } from "./pokemon"
import { Team } from "./team"

export class Session {
    id: number
    active: boolean
    user1: User
    user2: User
    user1_status: string
    user2_status: string
    user1_move: string
    user2_move: string
    user1_poke: Pokemon
    user2_poke: Pokemon
    user1_team: Team
    user2_team: Team

    constructor(id: number,
        active: boolean,
        user1: User,
        user2: User,
        user1_status: string,
        user2_status: string,
        user1_move: string,
        user2_move: string,
        user1_poke: Pokemon,
        user2_poke: Pokemon,
        user1_team: Team,
        user2_team: Team) {
        
        this.active = active;
        this.user1 = user1;
        this.user2 = user2;
        this.user1_status = user1_status
        this.user2_status = user2_status
        this.user1_move = user1_move;
        this.user2_move = user2_move;
        this.user1_poke = user1_poke;
        this.user2_poke = user2_poke;
        this.user1_team = user1_team;
        this.user2_team = user2_team;
    }
}