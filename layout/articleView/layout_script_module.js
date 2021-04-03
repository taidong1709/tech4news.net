import "./lib/showdown.min.js";
let showdownConverter = new showdown.Converter();

export var InitConfigLayout = {
    article: {
        title: "",
        description: "",
        thumbnail: "",
        viewCount: "0",
        renderedContent: ""
    }
}

export class InitClass {
    constructor(vueTemplate, extraData) {
        this.vueTemplate = vueTemplate;
        this.extraData = extraData;

        window.backcom.getPost(+extraData?.postID)
            .then(post => {
                let renderedContent = showdownConverter.makeHtml(post.content);

                vueTemplate.article = {
                    title: post.title,
                    descripttion: post.description,
                    thumbnail: post.thumbnail,
                    viewCount: post.viewCount.toString̣(),
                    renderedContent
                }
            })
            .catch(_error => initLayout("404", "Bài viết không tồn tại"));
    }

    async destroy() {}
}