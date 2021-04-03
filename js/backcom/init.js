const TARGET_SERVER = "https://tech4news-1.herokuapp.net";

class BackendCommunicator {
    currentServerURL = "";
    currentTaskQueue = [];
    invokeChangeServer = () => { };

    constructor(serverURL, invokeChangeServer) {
        this.currentServerURL = serverURL;
        this.invokeChangeServer = invokeChangeServer;
    }

    async getPost(postID = 0) {
        let gr = () => { };
        let grj = () => { };
        let p = new Promise((r, j) => { gr = r; grj = j });

        this.currentTaskQueue.push({
            endpoint: "/getpost",
            query: {
                postID
            },
            method: "GET",
            r: gr,
            j: grj
        });
        if (!(this.currentTaskQueue.length - 1)) this.invokeTaskQueue(0);

        return p;
    }

    async getCatelogyPost(catelogyID = 0, limit = 6) {
        let gr = () => { };
        let grj = () => { };
        let p = new Promise((r, j) => { gr = r; grj = j });

        this.currentTaskQueue.push({
            endpoint: "/getcatelogypost",
            query: {
                catelogyID,
                limit
            },
            method: "GET",
            r: gr,
            j: grj
        });
        if (!(this.currentTaskQueue.length - 1)) this.invokeTaskQueue(0);

        return p;
    }

    async addComment(firebaseAuth, postID, content) {
        let token = await firebaseAuth?.currentUser?.getIdToken?.(true);
        if (!token) throw new Error("Authenticate first!");

        let gr = () => { };
        let grj = () => { };
        let p = new Promise((r, j) => { gr = r; grj = j });

        this.currentTaskQueue.push({
            endpoint: "/addcomment",
            body: JSON.stringify({
                token,
                content,
                postID
            }),
            method: "POST",
            r: gr,
            j: grj
        });
        if (!(this.currentTaskQueue.length - 1)) this.invokeTaskQueue(0);

        return p;
    }

    async deleteComment(firebaseAuth, commentID) {
        let token = await firebaseAuth?.currentUser?.getIdToken?.(true);
        if (!token) throw new Error("Authenticate first!");

        let gr = () => { };
        let grj = () => { };
        let p = new Promise((r, j) => { gr = r; grj = j });

        this.currentTaskQueue.push({
            endpoint: "/deletecomment",
            body: JSON.stringify({
                token,
                commentID
            }),
            method: "POST",
            r: gr,
            j: grj
        });
        if (!(this.currentTaskQueue.length - 1)) this.invokeTaskQueue(0);

        return p;
    }

    async listComment(postID = 0) {
        let gr = () => { };
        let grj = () => { };
        let p = new Promise((r, j) => { gr = r; grj = j });

        this.currentTaskQueue.push({
            endpoint: "/listcomment",
            body: JSON.stringify({
                postID
            }),
            method: "get",
            r: gr,
            j: grj
        });
        if (!(this.currentTaskQueue.length - 1)) this.invokeTaskQueue(0);

        return p;
    }

    // tail call optimization.
    /** @param {URL | Response} temp  */
    async invokeTaskQueue(task, temp) {
        if (task === 0) {
            task = this.currentTaskQueue[0];
            return this.invokeTaskQueue(task, temp);
        }

        temp = new URL(task.endpoint, this.currentServerURL);
        temp.search = Object.entries(task.query)
            .reduce((a, v) => a + encodeURIComponent(v[0]) + "=" + encodeURIComponent(v[1]), "");

        try {
            temp = await fetch({
                url: temp.toString(),
                headers: task.method === "POST" ? {
                    "Content-Type": "application/json"
                } : {},
                body: task.body,
                method: task.method
            });

            if (temp.ok) {
                task.r?.({
                    status: temp.status,
                    data: await temp.json()
                });

                this.currentTaskQueue.shift();

                if (this.currentTaskQueue.length) {
                    task = this.currentTaskQueue[0];
                    return this.invokeTaskQueue(task, temp);
                }
                    
                return null;
            } else {
                if (temp.status >= 500) {
                    await this.invokeChangeServer();
                    await new Promise(x => setTimeout(x, 1000));

                    return this.invokeTaskQueue(task, temp);
                } else {
                    task.j?.({
                        status: temp.status,
                        data: await temp.json()
                    });

                    this.currentTaskQueue.shift();

                    if (this.currentTaskQueue.length) {
                        task = this.currentTaskQueue[0];
                        return this.invokeTaskQueue(task, temp);
                    }

                    return null;
                }
            }
        } catch {
            await this.invokeChangeServer();
            await new Promise(x => setTimeout(x, 1000));

            return this.invokeTaskQueue(task, temp);
        }
    }
}

window.backcom = new BackendCommunicator(TARGET_SERVER);