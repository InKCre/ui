import type { PropType } from "vue";
import DOMPurify from "dompurify";
import { Marked } from "marked";

export const inkContentReaderProps = {
  content: { type: String, required: true },
  format: { type: String as PropType<"html" | "markdown">, required: true },
} as const;

export function readingDocument(content: string, format: "html" | "markdown"): string {
  const source =
    format === "markdown"
      ? new Marked({ gfm: true, pedantic: false, breaks: false }).parse(content, { async: false })
      : content;
  const body = DOMPurify.sanitize(source, {
    RETURN_DOM: true,
    SANITIZE_NAMED_PROPS: true,
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "link", "meta", "base"],
    FORBID_ATTR: ["style", "srcset", "background", "formaction", "autofocus", "contenteditable"],
  });
  if (!(body instanceof HTMLElement)) throw new Error("Content sanitization returned no HTML body");
  for (const element of body.querySelectorAll<HTMLElement>("[src],[poster]")) {
    for (const attribute of ["src", "poster"]) {
      const address = element.getAttribute(attribute);
      if (!address) continue;
      const link = body.ownerDocument.createElement("a");
      link.textContent = element.getAttribute("alt") || element.getAttribute("label") || address;
      link.setAttribute("href", address);
      // Put references outside media fallback content so they remain visible.
      const media = element.closest("video,audio") || element;
      media.after(link);
      element.removeAttribute(attribute);
    }
  }
  for (const media of body.querySelectorAll("video,audio")) media.replaceWith(...media.childNodes);
  for (const media of body.querySelectorAll("img,source,track")) media.remove();
  for (const input of body.querySelectorAll("input")) {
    if (input.type === "checkbox") input.disabled = true;
    else input.remove();
  }
  for (const anchor of body.querySelectorAll("a[href]")) {
    const href = anchor.getAttribute("href") || "";
    if (href.startsWith("#")) {
      // Match DOMPurify's isolated IDs without inheriting the host page's base URL.
      anchor.setAttribute("href", `about:srcdoc#user-content-${href.slice(1)}`);
      continue;
    }
    try {
      const url = new URL(href);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("unsupported link");
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    } catch {
      anchor.removeAttribute("href");
    }
  }
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-inkcre-reader'"><meta name="referrer" content="no-referrer"><style nonce="inkcre-reader">:root{color-scheme:light dark}body{margin:0;font:16px/1.65 system-ui,sans-serif;overflow-wrap:anywhere}h1,h2,h3,h4,h5,h6{line-height:1.35;font-weight:600}h1{font-size:1.5em}h2{font-size:1.25em}h3,h4,h5,h6{font-size:1.1em}pre{overflow-x:auto;white-space:pre;tab-size:4}code{font-family:ui-monospace,monospace}table{border-collapse:collapse}th,td{padding:.35em .7em;border:1px solid GrayText;text-align:start}blockquote{margin-inline:0;padding-inline-start:1em;border-inline-start:2px solid GrayText}a{color:inherit}input{pointer-events:none}</style></head><body>${body.innerHTML}</body></html>`;
}
