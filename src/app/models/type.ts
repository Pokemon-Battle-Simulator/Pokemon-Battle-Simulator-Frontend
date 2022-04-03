export class Type {
    name:string
    double_damage_from: string[]
    half_damage_from: string[]
    no_damage_from: string[]

    constructor () {
        this.name = "";
        this.double_damage_from = [];
        this.half_damage_from = [];
        this.no_damage_from = [];
    }
}