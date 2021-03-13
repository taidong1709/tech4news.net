let style = document.createElement("style");
style.innerText = "eclipse-img { display: block; }";
document.querySelector("head").appendChild(style);

customElements.define('ellipse-img', class EllipseImage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" })

        let id = Math.floor(Math.random() * 2 ** 16).toString("16").padStart(2, "0") +
            Math.floor(Math.random() * 2 ** 16).toString("16").padStart(2, "0") +
            Math.floor(Math.random() * 2 ** 16).toString("16").padStart(2, "0") +
            Math.floor(Math.random() * 2 ** 16).toString("16").padStart(2, "0");

        let rootSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        rootSvg.style.width = this.getAttribute("width") || this.style.width || "0px";
        rootSvg.style.height = this.getAttribute("height") || this.style.height || "0px";
        rootSvg.setAttribute("role", "img");

        let mask = rootSvg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "mask"));
        let eMask = mask.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "ellipse"));
        eMask.setAttribute("cx", (parseFloat(this.getAttribute("width") || this.style.width || "0")) / 2);
        eMask.setAttribute("cy", (parseFloat(this.getAttribute("height") || this.style.height || "0")) / 2);
        eMask.setAttribute("rx", (parseFloat(this.getAttribute("width") || this.style.width || "0")) / 2);
        eMask.setAttribute("ry", (parseFloat(this.getAttribute("height") || this.style.height || "0")) / 2);
        eMask.style.fill = "white";
        mask.id = "i" + id;

        let g = rootSvg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "g"));
        g.setAttribute("mask", `url(#i${id})`);

        let image = g.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "image"));
        image.setAttribute("xlink:href", this.getAttribute("src") || "");
        image.setAttribute("href", this.getAttribute("src") || "");
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("height", "100%");
        image.setAttribute("width", "100%");
        image.setAttribute("preserveAspectRatio", "xMidYMid slice");
        image.style.width = this.getAttribute("width") || this.style.width || "0px";
        image.style.height = this.getAttribute("height") || this.style.height || "0px";

        for (let oldChild of this.childNodes) this.removeChild(oldChild);
        this.shadowRoot.appendChild(rootSvg);
    }
});