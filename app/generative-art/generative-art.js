export default class GenerativeArt extends crs.classes.BindableElement {
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
    }

    async load() {
        return new Promise(async (resolve) => {
            requestAnimationFrame(async () => {
                await this.#initialiseCanvas();
                resolve();
            });
        });
    }

    async #initialiseCanvas() {
        const context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        context.fillRect(10, 10, 50, 50);
    }
}
