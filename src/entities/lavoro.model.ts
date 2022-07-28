import { Step } from "./step.model";

export class Lavoro {
    constructor(
        public id: number | null,
        public titolo: string | null,
        public status: string | null,
        public steps: Step[] | null
    ) {}
}
