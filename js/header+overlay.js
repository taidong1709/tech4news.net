const NOT_LOGGED_IN = `
<a onclick="changeOverlay('login+register')" style="text-decoration: none; color: rgba(0, 0, 255, 0.6); font-weight: 600;" href="#">
    Đăng\xA0nhập\xA0/\xA0Đăng\xA0kí
</a>
`;
const LOGGED_IN = `
<ellipse-img width="32" height="32" src="{{ AVATAR_URL }}" style="margin-right: 6px;"></ellipse-img>
{{ USER_NAME }}\xA0\xA0<a onclick="execLogout()" style="text-decoration: none; color: rgba(0, 0, 255, 0.6); font-weight: 600;" href="#">Đăng\xA0xuất</a>
`;

const BLANK_IMAGE = `/img/gender-neutral-user.svg`;

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
                if (s.type) newScriptTag.type = s.type;
                if (s.noModule) newScriptTag.noModule = s.noModule;
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

        let changedState = false;
        firebase.auth().onAuthStateChanged(user => {
            changedState = true;
            if (user) {
                // Logged in!
                document.querySelector("#profile-info").innerHTML = LOGGED_IN
                    .replace("{{ AVATAR_URL }}", BLANK_IMAGE)
                    .replace("{{ USER_NAME }}", (user.displayName ?? user.uid).replace(/ /g, "\xA0"));
            } else {
                // Logged out
                document.querySelector("#profile-info").innerHTML = NOT_LOGGED_IN;
            }
        });

        await new Promise(x => setTimeout(x, 500));
        if (!changedState) {
            document.querySelector("#profile-info").innerHTML = NOT_LOGGED_IN;
        }
    }
})();