const express = require("express");
const read = require("readability-js");
const fs = require("fs");

const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const template = fs.readFileSync("./template.html", "utf8");

const app = express();
const router = express.Router();

router.get("/", async (req, res) => {
  const url = req.query.convert;

  read(url, async (err, article, meta) => {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    }

    const title = article.title;

    const content = DOMPurify.sanitize(await article.content.html());

    res.send(
      template.replace("{{title}}", title).replace("{{content}}", content)
    );
  });
});

app.use(router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
