export class Filtro {
    constructor(
        public filter: string | undefined,
        public value?: string | undefined,
        public min?: number | undefined,
        public max?: number | undefined,
        public startDate?: string | undefined,
        public endDate?: string | undefined
    ) {}
}
