const ExclusionWords = Object.freeze({
    PROTO: "__proto__"
});

export default class Teleprompter extends crs.classes.BindableElement {
    #speed = 0.25;
    #scrolling = false;
    #textAreaHandler = this.#hideTextArea.bind(this);
    #requestId;
    #HotKeyActions = Object.freeze({
        ShiftQ: async () => { await this.play() },
        ShiftW: async () => { await this.pause() },
        ShiftE: () => { this.textArea.setAttribute("hidden", true) },
        ShiftR: () => { this.textArea.removeAttribute("hidden") }
    });


    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    get hasStyle() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.dataset.position = "350%";
        globalThis.addEventListener("keydown", this.#textAreaHandler);
    }

    async disconnectedCallback() {
        this.#speed = null;
        this.#scrolling = null;
        globalThis.removeEventListener("keydown", this.#textAreaHandler);
        this.#textAreaHandler = null;
        this.#HotKeyActions = null;
        cancelAnimationFrame(this.#requestId);
    }

    async play() {
        if (this.#scrolling === false) {
            this.#scrolling = true;
            await this.#scroll();
        }
    }

    async pause() {
        this.#scrolling = false;
        cancelAnimationFrame(this.#requestId);
    }
    async #populateText(text) {
        //Todo: sanitize the input
        this.text.innerHTML = text;
    }

    async #hideTextArea(event) {
        const shiftKey = event.shiftKey === true ? "Shift" : null;

        if (event.key === "Enter" && this.textArea.value !== "") {
            await this.#populateText(this.textArea.value);
        }

        if (shiftKey === null) return;

        const combination = shiftKey + event.key;
        event.preventDefault();
        if (this.#HotKeyActions[combination] != null && combination !== ExclusionWords.PROTO) {
            await this.#HotKeyActions[combination]();
        }
    }

    async #scroll() {
        if (this.#scrolling === false) return;

        const currentPosition = this.dataset.position;
        const topValue = parseFloat(currentPosition);
        const newTopValue = topValue - this.#speed;
        await this.#setPositionProperty(newTopValue);

        if (newTopValue <= -100) {
            this.#scrolling = false;
            return;
        }

        this.#requestId = requestAnimationFrame(async() => {
            await this.#scroll();
        });
    }

    async #setPositionProperty(value) {
        const valueInPercentage = `${value}%`;
        this.style.setProperty("--top", valueInPercentage);
        this.dataset.position = value;

        if (value <= -100) {
            this.dataset.position = "350%";
        }
    }

    async updateSpeedChanged(value) {
        this.#speed = parseFloat(value);
    }
}