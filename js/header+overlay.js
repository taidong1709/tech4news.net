(async () => {
    // Overlay injecting
    {
        let main = document.querySelector("main");
        main.innerHTML = `
            <div id="overlay">
                <span v-html="overlayData"></span>
            </div>
        ` + main.innerHTML;

        let overlay = Vue.createApp({
            data() {
                return {
                    overlayData: ""
                }
            }
        }).mount("#overlay");
    
        window.changeOverlay = async function changeOverlay(overlayName) {
            if (overlayName === "none") {
                Object.assign(document.querySelector("#overlay").style, {
                    display: "none",
                    "position": "fixed",
                    "width": "100%",
                    "height": "100%",
                    "top": 0,
                    "left": 0
                });
                overlay.overlayData = "";
            } else {
                let overlayDataJSON = await (await fetch(`overlay/${overlayName}.json`)).json();
                let overlayData = await (await fetch(overlayDataJSON.url)).text();
    
                Object.assign(document.querySelector("#overlay").style, overlayDataJSON.style);
                overlay.overlayData = overlayData;
            }
    
            await new Promise(x => setTimeout(x, 200));
    
            /** @type {HTMLScriptElement[]} */
            let oldScriptList = [...document.querySelectorAll(".overlay_script_reloaded")];
            oldScriptList.forEach(s => s.parentNode.removeChild(s));
    
            /** @type {HTMLScriptElement[]} */
            let scriptList = [...document.querySelectorAll(".overlay_script_reload")];
            scriptList.forEach(s => {
                let parentNode = s.parentNode;
                parentNode.removeChild(s);
    
                let newScriptTag = document.createElement("script");
                newScriptTag.innerHTML = s.innerHTML;
                if (s.src) newScriptTag.src = s.src;
                newScriptTag.onload = () => console.log("Reloaded script", newScriptTag);
    
                newScriptTag.classList.add("overlay_script_reloaded");
                document.head.appendChild(newScriptTag);
            });
        }
    }

    // Header injecting
    {
        let container = document.querySelector(".main-container");
        container.innerHTML = `
            <header>
                <span v-html="header" v-once></span>
            </header>
        ` + container.innerHTML;

        let htmlData = await (await fetch("header.html")).text();
        let headerApp = Vue.createApp({
            data() {
                return {
                    header: htmlData
                }
            }
        });

        headerApp.mount("header");
    }
})();