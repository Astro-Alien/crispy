const DEFAULT_URL = ""

export default class MessengerApp extends crs.classes.BindableElement {
    #clickHandler = this.#click.bind(this);
    #RequestTypeActions = Object.freeze({
        GET: this.#getRequest.bind(this)
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
        this.shadowRoot.addEventListener("click", this.#clickHandler);
    }

    async disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#clickHandler = null;
        this.#RequestTypeActions = null;

        await super.disconnectedCallback();
    }

    /**
     * @method #click - Handles the click event
     * @param event {Object} - The event object
     * @returns {Promise<void>}
     */
    async #click(event) {
        const element = event.composedPath()[0]
        const action = element.dataset.action?.toUpperCase();

        if (this.#RequestTypeActions[action] != null) {
            await this.#RequestTypeActions[action]();
        }
    }

    /**
     * @method #getRequest - Makes a GET request
     * @returns {Promise<void>}
     */
    async #getRequest() {
        const url = await this.#buildURL("Greetings");
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @method #buildURL - Builds the URL for the request
     * @param resource {string} - The resource to be accessed
     * @returns {Promise<string>}
     */
    async #buildURL(resource) {
        return `${DEFAULT_URL}/${resource}`;
    }
}


