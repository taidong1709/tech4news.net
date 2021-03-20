export var InitConfigLayout = {
    RANDOM_NUMBER: "0"
}

export class InitClass {
    constructor(vueTemplate, extraData) {
        console.log(vueTemplate, extraData);
        this.vueTemplate = vueTemplate;
        this.extraData = extraData;

        this.interval = setInterval(() => {
            this.vueTemplate.RANDOM_NUMBER = Math.random().toFixed(20);
        });
    }

    async destroy() {
        clearInterval(this.interval);
    }
}