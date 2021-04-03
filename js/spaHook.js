setInterval(() => {
    [...document.querySelectorAll("a")].forEach(a => {
        if (!a.classList.contains("hookedSPA")) {
            a.addEventListener("click", e => {
                let a = e.target.closest("a");
                e.preventDefault();

                let newURL = new URL(a.href);
                if (newURL.hostname === location.hostname && !newURL.hash) {
                    e.preventDefault();

                    window.history.pushState("", "", `${newURL.pathname}${newURL.search}`);
                    updateUseURL();
                }
            });

            a.classList.add("hookedSPA");
        }
    });
});

window.onpopstate = e => updateUseURL();
