setInterval(() => {
    [...document.querySelectorAll("a")].forEach(a => {
        if (!a.classList.contains("hookedSPA")) {
            a.addEventListener("click", e => {
                console.log(e.target);
                e.preventDefault();

                let newURL = new URL(e.target.href);
                if (newURL.hostname === location.hostname) {
                    e.preventDefault();

                    window.history.pushState("", "", `${newURL.pathname}${newURL.search}`);
                    updateUseURL();
                }
            });

            a.classList.add("hookedSPA");
        }
    });
});
