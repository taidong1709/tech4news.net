export var InitConfigLayout = {
    main: { front: {}, post1: {}, post2: {}, post3: {} },
    catelogy: {
        software: { post1: {}, post2: {}, post3: {}, post4: {}, post5: {}, post6: {}},
        trick: { post1: {}, post2: {}, post3: {}, post4: {}, post5: {}, post6: {}},
        relax: { post1: {}, post2: {}, post3: {}, post4: {}, post5: {}, post6: {}},
        game: { post1: {}, post2: {}, post3: {}, post4: {}, post5: {}, post6: {}},
        techdevice: { post1: {}, post2: {}, post3: {}, post4: {}, post5: {}, post6: {}},
        service: { post1: {}, post2: {}, post3: {}, post4: {}, post5: {}, post6: {}},
    }
}

export class InitClass {
    constructor(vueTemplate, extraData) {
        this.vueTemplate = vueTemplate;
        this.extraData = extraData;

        Promise.all([
            window.backcom.getCatelogyPost(-1, 4),
            window.backcom.getCatelogyPost(1, 6),
            window.backcom.getCatelogyPost(2, 6),
            window.backcom.getCatelogyPost(3, 6),
            window.backcom.getCatelogyPost(4, 6),
            window.backcom.getCatelogyPost(5, 6),
            window.backcom.getCatelogyPost(6, 6)
        ]).then(v => {
            vueTemplate.main.front = formatPost(v[0].posts[0]);
            vueTemplate.main.post1 = formatPost(v[0].posts[1]);
            vueTemplate.main.post2 = formatPost(v[0].posts[2]);
            vueTemplate.main.post2 = formatPost(v[0].posts[3]);

            let catelogy = ["software", "trick", "relax", "game", "techdevice", "service"];
            for (let catelogyIndex in catelogy) {
                for (let i = 0; i < 5; i++) {
                    vueTemplate[catelogy[catelogyIndex]]["post" + (i + 1)] = formatPost(v[catelogyIndex + 1].posts[i]);
                }
            }
        });
    }

    async destroy() {}
}

function formatPost(p) {
    if (!p) return { 
        title: "", 
        thumbnail: "",
        description: "",
        url: "#",
        timestamp: ""
    }

    let ts = new Date(p.datePublished);

    return {
        title: p.title,
        thumbnail: p.thumbnail,
        description: p.description,
        url: (new URL(`/?type=view&articleID=${p.id}`, `${location.protocol}//${location.hostname}:${location.port}/`)).toString(),
        timestamp: `${ts.getHours()}:${ts.getMinutes()} ${ts.getDate().toString().padStart(2, "0")}/${(ts.getMonth() + 1).toString().padStart(2, "0")}/${ts.getFullYear()}`
    }
}