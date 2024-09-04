export default class Teleprompter extends crs.classes.BindableElement {
    #speed = 5;
    #scrolling;
    #windowEventHandler = this.#windowEvent.bind(this);

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
        this.addEventListener("load", this.#windowEventHandler);
    }

    async disconnectedCallback() {
        this.#speed = null;
        this.#scrolling = null;
        this.removeEventListener("load", this.#windowEventHandler);
        this.#windowEventHandler = null;
    }

    async #play(timeout) {
        if (!this.#scrolling) {
            this.#scrolling = setInterval(await this.#scrollingText, 50);
        }
    }

    async #pause() {
        clearInterval(this.#scrolling);
        this.#scrolling = null;
    }

    async #scrollingText() {
        this.text.style.top = `${parseFloat(this.text.style.top) - (this.#speed / 10)}%`;

        if (parseFloat(text.style.top) <= -100) {
            this.text.style.top = '100%';
        }
    }

    async #adjustSpeed(newSpeed) {
        this.#speed = newSpeed;
    }

   async #windowEvent(event) {
       this.text.style.top = '100%';
       await this.#play();
   }
}