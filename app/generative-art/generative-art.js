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
        this.canvas.width = window.innerWidth * 0.5;
        this.canvas.height = window.innerHeight * 0.5;

        context.fillStyle = "purple";
        context.strokeStyle = "yellow";
        context.lineWidth = 20;
        context.lineCap = "round";

        context.fillRect(50, 50, 50, 50);

        let size = 200;

        //create a line on the canvas
        context.beginPath();
        context.moveTo( this.canvas.width/2, this.canvas.height/2);
        context.lineTo( size, this.canvas.height/2);
        context.stroke();
    }
}
