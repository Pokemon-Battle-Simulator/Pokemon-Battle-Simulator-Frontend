import { Move } from "./move"
import { Pokemon } from "./pokemon"
import { Type } from "./type"

export class BattlePokemon {
    object: Pokemon
    name: string
    stats: number[]
    types: Type[]
    moves: Move[]
    current_hp: number
    sprite: string

    constructor() {}
}