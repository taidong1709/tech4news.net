window.updateUseURL = async function updateUseURL() {
    let query = new URLSearchParams(location.search);
    
    switch (query.get("type")) {
        case null:
            await initLayout("mainPage"); break;
        case "view":
            await initLayout("articleView", { postID: query.get("articleID") }); break;
        default:
            await initLayout("404", "URL không tồn tại");
    }
}

window.updateUseURL();