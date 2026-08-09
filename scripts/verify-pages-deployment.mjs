const mode = process.env.INKCRE_PAGES_MODE;
const address = process.env.INKCRE_PAGES_URL;

if (!["preview", "production", "closed"].includes(mode)) {
  throw new Error(`Unknown Pages verification mode: ${mode}`);
}
if (!address) {
  throw new Error("INKCRE_PAGES_URL is required");
}

const origin = new URL(address);
if (origin.protocol !== "https:") {
  throw new Error(`Pages verification requires HTTPS: ${origin.href}`);
}

async function verifyOnce() {
  const response = await fetch(origin, {
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
  const body = await response.text();

  if (response.status !== 200) {
    throw new Error(`${origin.href} returned HTTP ${response.status}`);
  }
  if (!response.headers.get("content-type")?.startsWith("text/html")) {
    throw new Error(`${origin.href} did not return HTML`);
  }

  const robots = response.headers.get("x-robots-tag")?.toLowerCase() ?? "";
  if (mode === "closed") {
    if (!body.includes("This preview is closed")) {
      throw new Error(`${origin.href} did not return the closed-preview marker`);
    }
    if (!robots.includes("noindex")) {
      throw new Error(`${origin.href} is missing its noindex header`);
    }
    return;
  }

  const isHistoireShell =
    body.includes("<title>InKCre Web UI</title>") && body.includes('<div id="app"></div>');
  if (!isHistoireShell) {
    throw new Error(`${origin.href} did not return the Histoire application shell`);
  }
  if (mode === "preview" && !robots.includes("noindex")) {
    throw new Error(`${origin.href} preview is missing its noindex header`);
  }
  if (mode === "production" && robots.includes("noindex")) {
    throw new Error(`${origin.href} production is unexpectedly marked noindex`);
  }
}

let lastError;
for (let attempt = 1; attempt <= 30; attempt += 1) {
  try {
    await verifyOnce();
    console.log(`Verified ${mode} Pages delivery at ${origin.href}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 30) {
      await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
  }
}

throw lastError;
