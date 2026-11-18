import assert from "node:assert/strict";
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";

const { values } = parseArgs({
  options: { "browser-executable": { type: "string" } },
});
const server = spawn(
  process.execPath,
  [
    fileURLToPath(
      new URL(
        "../packages/example-site/node_modules/@docusaurus/core/bin/docusaurus.mjs",
        import.meta.url,
      ),
    ),
    "serve",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
    "--no-open",
  ],
  {
    cwd: fileURLToPath(new URL("../packages/example-site", import.meta.url)),
    stdio: "inherit",
  },
);
let serverError;
server.on("error", (error) => {
  serverError = error;
});
let browser;

const origin = "http://127.0.0.1:4173";
const methodPath = "/docs/api-reference/methods/engine_newPayloadV4";
const storageKey = "openrpc:request-panel-open";
const runtimeErrors = [];

async function makeContext(options = {}) {
  const context = await browser.newContext(options);
  context.on("page", (page) => {
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === "http://127.0.0.1:8545") {
      if (route.request().method() === "OPTIONS") {
        return route.fulfill({
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }
      const request = JSON.parse(route.request().postData());
      return route.fulfill({
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: request.id,
          result: [
            "mock-success",
            ...Array(100).fill("disposable RPC response"),
          ],
        }),
      });
    }
    if (url.origin === origin) return route.continue();
    return route.abort();
  });
  return context;
}

async function navigate(page, path = methodPath) {
  await page.goto(origin + path, { waitUntil: "networkidle" });
  await page.locator("[data-request-open]").waitFor();
}

function toggle(page, open) {
  return page.getByRole("button", {
    name: open ? "Hide request" : "Show request",
    exact: true,
  });
}

async function checkState(page, open) {
  await toggle(page, open).waitFor();
  assert.equal(
    await toggle(page, open).getAttribute("aria-expanded"),
    String(open),
  );
  const id = await toggle(page, open).getAttribute("aria-controls");
  const panel = page.locator(`[id="${id}"]`);
  assert.equal(await panel.isVisible(), open);
  return panel;
}

async function checkNoOverflow(page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  assert.ok(widths.document <= widths.viewport + 1, JSON.stringify(widths));
}

try {
  const deadline = Date.now() + 60_000;
  while (true) {
    if (serverError) throw serverError;
    assert.equal(
      server.exitCode,
      null,
      "example server exited before readiness",
    );
    try {
      if ((await fetch(origin)).ok) break;
    } catch {
      /* Wait for the disposable local server. */
    }
    assert.ok(Date.now() < deadline, "example server did not become ready");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({
    executablePath: values["browser-executable"],
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const context = await makeContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  await navigate(page);
  await checkState(page, false);
  const content = page.locator('[class*="mainContent_"]');
  const collapsedWidth = (await content.boundingBox()).width;
  const gridWidth = (await page.locator("[data-request-open]").boundingBox())
    .width;
  assert.ok(
    Math.abs(collapsedWidth - gridWidth) < 2,
    "hidden panel leaves no unused column",
  );

  await toggle(page, false).focus();
  await page.keyboard.press("Enter");
  const panel = await checkState(page, true);
  const [mainBox, panelBox] = await Promise.all([
    content.boundingBox(),
    panel.boundingBox(),
  ]);
  assert.ok(
    panelBox.x > mainBox.x + mainBox.width,
    "wide layout places the panel beside the docs",
  );
  assert.ok(
    mainBox.width < collapsedWidth * 0.8,
    "collapsing meaningfully widens the docs",
  );
  assert.ok(
    panelBox.width < 500,
    "expanded panel is no longer a fixed 500px wide",
  );
  await checkNoOverflow(page);

  const request = JSON.stringify(
    { jsonrpc: "2.0", method: "eth_chainId", params: [], id: 77 },
    null,
    2,
  );
  await page
    .getByLabel("Server URL", { exact: true })
    .fill("http://127.0.0.1:8545/");
  await page.getByLabel("JSON-RPC request", { exact: true }).fill(request);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await panel.getByText(/mock-success/).waitFor();
  await toggle(page, true).focus();
  await page.keyboard.press("Space");
  await checkState(page, false);
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() =>
      Boolean(document.activeElement.closest('[aria-label="Request panel"]')),
    ),
    false,
  );
  assert.ok(Math.abs((await content.boundingBox()).width - collapsedWidth) < 2);
  await toggle(page, false).click();
  await checkState(page, true);
  assert.equal(
    await page.getByLabel("JSON-RPC request", { exact: true }).inputValue(),
    request,
  );
  assert.equal(
    await page.getByLabel("Server URL", { exact: true }).inputValue(),
    "http://127.0.0.1:8545/",
  );
  assert.ok(
    (await panel.textContent()).includes("mock-success"),
    "response survives hiding and showing",
  );

  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "dark"),
  );
  await page.evaluate(() => window.scrollTo(0, 1000));
  const stickyButton = await toggle(page, true).boundingBox();
  assert.ok(
    stickyButton.y >= 0 && stickyButton.y < 150,
    "toggle remains available while scrolling",
  );

  // A short desktop viewport must scroll the whole card, not clip its controls.
  await page.setViewportSize({ width: 1920, height: 420 });
  const cardSize = await page
    .getByLabel("JSON-RPC request", { exact: true })
    .evaluate((textarea) => {
      const card = textarea.closest('[class*="requestBox_"]');
      return { content: card.scrollHeight, visible: card.clientHeight };
    });
  assert.ok(
    cardSize.content <= cardSize.visible + 1,
    `request card clips controls: ${JSON.stringify(cardSize)}`,
  );
  for (const control of [
    page.getByLabel("JSON-RPC request", { exact: true }),
    page.getByRole("button", { name: "Send", exact: true }),
  ]) {
    await control.scrollIntoViewIfNeeded();
    assert.ok(
      await control.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return node.contains(
          document.elementFromPoint(
            box.x + box.width / 2,
            box.y + box.height / 2,
          ),
        );
      }),
      "request controls remain reachable in short viewports",
    );
  }
  await page.setViewportSize({ width: 1920, height: 1080 });
  console.log(
    "PASS: short desktop viewport keeps request controls reachable after a response.",
  );

  await navigate(page, "/docs/api-reference/methods/eth_chainId");
  await checkState(page, true);
  await toggle(page, true).click();
  await page.reload({ waitUntil: "networkidle" });
  await checkState(page, false);
  console.log(
    "PASS: full-width default; keyboard toggle; wider docs; draft, URL and response preservation; remembered visibility; sticky control.",
  );

  await navigate(page);
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    // Open from well down the documentation to verify the sticky disclosure
    // brings the stacked form into view, including with reduced motion.
    await page.emulateMedia({
      reducedMotion: width === 390 ? "reduce" : "no-preference",
    });
    await page.evaluate(() => window.scrollTo(0, 1800));
    await toggle(page, false).click();
    await page.waitForFunction(() => {
      const panel = document.querySelector('[aria-label="Request panel"]');
      const top = panel.getBoundingClientRect().top;
      return top >= 0 && top < 180;
    });
    const narrowPanel = await checkState(page, true);
    const [main, requestPanel] = await Promise.all([
      content.boundingBox(),
      narrowPanel.boundingBox(),
    ]);
    assert.ok(
      requestPanel.y + requestPanel.height <= main.y + 1,
      `panel stacks above the docs at ${width}px`,
    );
    await checkNoOverflow(page);
    const input = await page
      .getByLabel("Server URL", { exact: true })
      .boundingBox();
    const send = await page
      .getByRole("button", { name: "Send", exact: true })
      .boundingBox();
    assert.ok(
      send.x >= input.x + input.width,
      "server input and send button fit on one row",
    );
    await toggle(page, true).click();
    await checkState(page, false);
    await checkNoOverflow(page);
    console.log(
      `PASS: ${width}px responsive layout and no horizontal overflow in either state.`,
    );
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await toggle(page, false).click();
  const reducedPanel = await checkState(page, true);
  assert.equal(
    await reducedPanel.evaluate((node) => getComputedStyle(node).animationName),
    "none",
  );
  assert.equal(
    await toggle(page, true).evaluate(
      (node) => getComputedStyle(node).transitionDuration,
    ),
    "0s",
  );
  console.log("PASS: reduced-motion preference.");
  await context.close();

  const blocked = await makeContext({ viewport: { width: 1440, height: 900 } });
  await blocked.addInitScript((key) => {
    const getItem = Storage.prototype.getItem;
    const setItem = Storage.prototype.setItem;
    Storage.prototype.getItem = function (name) {
      if (name === key)
        throw new DOMException("Storage is disabled", "SecurityError");
      return getItem.call(this, name);
    };
    Storage.prototype.setItem = function (name, value) {
      if (name === key)
        throw new DOMException("Storage is disabled", "SecurityError");
      return setItem.call(this, name, value);
    };
  }, storageKey);
  const blockedPage = await blocked.newPage();
  await navigate(blockedPage);
  await checkState(blockedPage, false);
  await toggle(blockedPage, false).click();
  await checkState(blockedPage, true);
  await toggle(blockedPage, true).click();
  await checkState(blockedPage, false);
  await blocked.close();
  assert.deepEqual(
    runtimeErrors,
    [],
    "no client-side runtime or hydration errors",
  );
  console.log(
    "PASS: storage-disabled fallback and no runtime/hydration errors.",
  );
} finally {
  await browser?.close();
  server.kill();
}
