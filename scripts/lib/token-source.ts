import type { DesignTokens } from "style-dictionary/types";

export interface SourceToken extends Record<string, unknown> {
  type: string;
  value: unknown;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isToken(value: unknown): value is SourceToken {
  return isRecord(value) && typeof value.type === "string" && Object.hasOwn(value, "value");
}

// This boundary accepts this repository's type/value export, not arbitrary CSS or DTCG payloads.
export function validateTokenSource(input: unknown): asserts input is DesignTokens {
  if (!isRecord(input)) throw new Error("Token source must be an object");
  const tokens = new Map<string, SourceToken>();
  function visit(node: Record<string, unknown>, path: string[] = []): void {
    if (!Object.keys(node).length) throw new Error(`Empty token group: ${path.join(".")}`);
    for (const [key, value] of Object.entries(node)) {
      const next = [...path, key];
      if (!/^[a-zA-Z0-9-]+$/.test(key) || !isRecord(value)) {
        throw new Error(`Invalid token path: ${next.join(".")}`);
      }
      if (isToken(value)) tokens.set(next.join("."), value);
      else visit(value, next);
    }
  }
  visit(input);

  function color(value: unknown): boolean {
    if (typeof value !== "string") return false;
    if (/^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) return true;
    const rgba = value.match(
      /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?)\s*\)$/,
    );
    return !!rgba && rgba.slice(1, 4).every((channel) => Number(channel) <= 255);
  }
  const finite = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);
  for (const [path, token] of tokens) {
    const value = token.value;
    const reference = typeof value === "string" ? value.match(/^\{([^{}]+)\}$/)?.[1] : undefined;
    if (reference) {
      if (tokens.get(reference)?.type !== token.type) {
        throw new Error(`Missing or differently typed reference: ${path} -> ${reference}`);
      }
      // Style Dictionary owns reference resolution and cycle detection.
      continue;
    }
    let valid = false;
    switch (token.type) {
      case "color":
        valid = color(value);
        break;
      case "dimension":
        valid = finite(value)
          ? value >= 0
          : typeof value === "string" && /^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|%)$/.test(value);
        break;
      case "number":
        valid = finite(value) && value >= 0;
        if (path.includes(".opacity.")) valid = valid && (value as number) <= 1;
        if (path.endsWith(".lineHeight")) valid = valid && (value as number) > 0;
        if (path.endsWith(".fontWeight"))
          valid = valid && (value as number) >= 1 && (value as number) <= 1000;
        break;
      case "string":
        valid = typeof value === "string" && value.length > 0 && !/[;{}\n\r]/.test(value);
        break;
      case "custom-shadow":
        valid =
          isRecord(value) &&
          value.shadowType === "dropShadow" &&
          color(value.color) &&
          [value.radius, value.offsetX, value.offsetY, value.spread].every(finite) &&
          (value.radius as number) >= 0;
        break;
    }
    if (!valid) throw new Error(`Invalid ${token.type} value at ${path}`);
  }
  for (const path of [
    "ref.typo.family.sans",
    "ref.typo.family.mono",
    "ref.space.md",
    "sys.light.color.overlay.scrim",
    "sys.dark.color.overlay.scrim",
  ]) {
    if (!tokens.has(path)) throw new Error(`Required token is missing: ${path}`);
  }
  for (const prefix of ["sys", "comp"]) {
    const paths = (theme: string) =>
      [...tokens.keys()]
        .filter((p) => p.startsWith(`${prefix}.${theme}.`))
        .map((p) => p.slice(`${prefix}.${theme}.`.length))
        .sort();
    if (JSON.stringify(paths("light")) !== JSON.stringify(paths("dark"))) {
      throw new Error(`${prefix} light/dark roles must match`);
    }
  }
  if (!isRecord(input.typography)) throw new Error("Typography roles are missing");
  for (const [category, sizes] of Object.entries(input.typography)) {
    if (!isRecord(sizes)) throw new Error(`Invalid typography category: ${category}`);
    for (const size of Object.keys(sizes)) {
      for (const [property, type] of Object.entries({
        fontSize: "dimension",
        lineHeight: "number",
        fontWeight: "number",
        letterSpacing: "dimension",
      })) {
        if (tokens.get(`typography.${category}.${size}.${property}`)?.type !== type) {
          throw new Error(`Incomplete typography role: ${category}.${size}`);
        }
      }
    }
  }
}
