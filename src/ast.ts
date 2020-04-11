export abstract class Expression {
    public abstract evaluate(): string;
}

export class ComplexExpression extends Expression {
    #children: Expression[];

    constructor(children: Expression[]) {
        super();
        this.#children = children;
    }

    public evaluate(): string {
        return this.#children.map(e => e.evaluate()).join('');
    }
}

export class LiteralExpression extends Expression {
    #value: string;

    constructor(value: string) {
        super();
        this.#value = value;
    }

    public evaluate(): string {
        return this.#value;
    }
}