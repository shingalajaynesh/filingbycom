const DATA_SCRIPT_ID = "__FILINGBY_PRERENDER_DATA__";
const SHELL_SELECTOR = "[data-prerender-shell]";
const ACTIVE_CLASS = "prerender-shell-active";
const DELAYED_REVEAL_KINDS = new Set(["blog-post", "service-page"]);

let parsedData;

function parsePrerenderData() {
  if (parsedData !== undefined) {
    return parsedData;
  }

  if (typeof document === "undefined") {
    parsedData = null;
    return parsedData;
  }

  const script = document.getElementById(DATA_SCRIPT_ID);
  if (!script?.textContent) {
    parsedData = null;
    return parsedData;
  }

  try {
    parsedData = JSON.parse(script.textContent);
  } catch (error) {
    console.error("Failed to parse prerender data:", error);
    parsedData = null;
  }

  return parsedData;
}

export function getPrerenderData() {
  return parsePrerenderData();
}

export function getInitialBlogPayload(slug) {
  const data = parsePrerenderData();
  if (data?.kind !== "blog-post" || data.slug !== slug) {
    return null;
  }

  return data;
}

export function getInitialServicePayload(slug) {
  const data = parsePrerenderData();
  if (data?.kind !== "service-page" || data.slug !== slug) {
    return null;
  }

  return data;
}

export function preparePrerenderShell() {
  if (typeof document === "undefined") {
    return;
  }

  const shell = document.querySelector(SHELL_SELECTOR);
  if (!shell) {
    return;
  }

  document.documentElement.classList.add(ACTIVE_CLASS);

  const data = parsePrerenderData();
  if (!DELAYED_REVEAL_KINDS.has(data?.kind)) {
    requestAnimationFrame(() => {
      revealPrerenderShell();
    });
  }

  window.setTimeout(() => {
    revealPrerenderShell();
  }, 4000);
}

export function revealPrerenderShell() {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.remove(ACTIVE_CLASS);
  document.querySelector(SHELL_SELECTOR)?.remove();
}
