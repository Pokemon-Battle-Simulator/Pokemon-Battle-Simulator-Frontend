import { User } from "./user"
import { Pokemon } from "./pokemon"

export enum Status {
    EMPTY,
    CONNECTED,
    CHOOSING,
    READY,
    NO_POKEMON,
    DISCONNECTED
}

export class Session {
    id: number
    active: boolean
    user1: User
    user2: User
    user1_status: Status
    user2_status: Status
    user1_move: string
    user2_move: string
    user1_poke: Pokemon
    user2_poke: Pokemon

    constructor(id: number,
        active: boolean,
        user1: User,
        user2: User,
        user1_status: Status,
        user2_status: Status,
        user1_move: string,
        user2_move: string,
        user1_poke: Pokemon,
        user2_poke: Pokemon) {
        
        this.active = active;
        this.user1 = user1;
        this.user2 = user2;
        this.user1_status = user1_status
        this.user2_status = user2_status
        this.user1_move = user1_move;
        this.user2_move = user2_move;
        this.user1_poke = user1_poke;
        this.user2_poke = user2_poke;
    }
}