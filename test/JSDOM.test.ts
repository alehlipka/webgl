import { describe, expect, test } from "vitest";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = `
<!doctype html>
<html lang="en">
<head></head>
<body>
    <p>test</p>
    <canvas id="gl-canvas" width="640" height="480">
        Your browser doesn't appear to support the HTML5 <code>canvas</code> element.
    </canvas>
</body>
</html>
`;

describe("JSDOM", () => {
  test("query selector", () => {
    const dom = new JSDOM(html);
    const text = dom.window.document.querySelector("p").textContent;

    expect(text).toBe("test");
  });
});
