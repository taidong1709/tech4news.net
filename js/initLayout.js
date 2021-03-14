window.initLayout = async function initLayout(layoutName, customParameter) {
    try {
        /** @type {[string, string]} */
        let html_css = await Promise.all((await Promise.all([
            fetch(`layout/${layoutName}/layout.html`),
            fetch(`layout/${layoutName}/layout_style.css`)
        ])).map(x => x.text()));

        if (window.vueLayoutHandler) {
            window.vueLayoutHandler.unmount();
            window.vueLayoutHandler = null;
        }
        if (window.layoutCHandler) {
            await window.layoutCHandler.destroy?.();
            window.layoutCHandler = null;
        }

        [...document.querySelectorAll(".dynamic_layout_object")].map(e => e.parentNode.removeChild(e));
        let styleElement = document.createElement("style");
        styleElement.classList.add("dynamic_layout_object");
        styleElement.innerHTML = html_css[1];

        let layoutSpan = document.createElement("span");
        layoutSpan.classList.add("dynamic_layout_object");
        layoutSpan.classList.add("vue_layout_selector");
        layoutSpan.innerHTML = html_css[0];

        document.head.appendChild(styleElement);

        let footer = document.querySelector("footer");
        if (footer) {
            document.querySelector(".main-container").insertBefore(layoutSpan, footer);
        } else {
            document.querySelector(".main-container").appendChild(layoutSpan);
        }

        let exportData = await import(`../layout/${layoutName}/layout_script_module.js`);
        window.vueLayoutHandler = Vue.createApp({
            data() { return exportData.InitConfigLayout }
        });
        let InitClass = exportData.InitClass;
        window.layoutCHandler = new InitClass(window.vueLayoutHandler.mount(".vue_layout_selector"), customParameter);
    } catch (e) {
        console.log(e); return void 0;
        initLayout("404", e);
    }
}