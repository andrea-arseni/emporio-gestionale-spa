export class Lavoro {
    constructor(
        public id: number,
        public titolo: string,
        public status: string,
        public steps: Step[]
    ) {}
}
