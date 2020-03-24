export class StringReader {
    #str: string;
    #currentInd = 0;

    constructor(str: string) {
        this.#str = str;
    }

    public isFinished() {
        return this.#currentInd == this.#str.length;
    }

    public readNext(): string {
        if (!this.isFinished()) {
            return this.#str[this.#currentInd++];
        }

        throw new Error("Reached EOF");
    }

    public readUntil(ch: string): string {
        let buf = [];
        while (!this.isFinished()) {
            let curentChar = this.#str[this.#currentInd];
            if (curentChar != ch) {
                buf.push(curentChar);
                this.#currentInd++;
            } else {
                break;
            }
        }

        return buf.join('');
    }

    public skip(ch: string) {
        while (this.#currentInd < this.#str.length && this.#str[this.#currentInd] == ch) {
            this.#currentInd++;
        }
    }
}