export class StringReader {
    #str: string;
    #currentInd = -1;

    constructor(str: string) {
        this.#str = str;
    }

    public isFinished(): boolean {
        return this.#currentInd + 1 >= this.#str.length;
    }

    public peekNext(): string {
        if (!this.isFinished()) {
            return this.#str[this.#currentInd + 1];
        }

        throw new Error("Can't peek beyond EOF");
    }

    public readNext(): string {
        if (!this.isFinished()) {
            return this.#str[++this.#currentInd];
        }

        throw new Error("Reached EOF");
    }

    public current(): string {
        if (this.#str.length > 0 && this.#currentInd != -1) {
            return this.#str[this.#currentInd];
        }

        throw new Error("Not initialized or empty string");
    }

    public readUntilAny(...chars: string[]): string {
        const ind = this.indexOfNextMatch(ch => chars.indexOf(ch) != -1);
        if (ind != -1) {
            const result = this.#str.substring(this.#currentInd + 1, ind);
            this.#currentInd = ind - 1;
            return result;
        } else {
            const result = this.#str.substring(this.#currentInd + 1);
            this.#currentInd = this.#str.length - 1;
            return result;
        }
    }

    public skipAny(...chars: string[]): void {
        const ind = this.indexOfNextMatch(ch => chars.indexOf(ch) == -1);
        if (ind != -1) {
            this.#currentInd = ind - 1;
        } else {
            this.#currentInd = this.#str.length - 1;
        }
    }

    private indexOfNextMatch(isMatch: (ch: string) => boolean): number {
        let ind = this.#currentInd + 1;
        for (; ind < this.#str.length && !isMatch(this.#str[ind]); ind++);
        return ind < this.#str.length ? ind : -1;
    }
}