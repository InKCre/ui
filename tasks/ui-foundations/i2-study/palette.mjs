export const candidate = {
  light: {
    "text-base": "#1f1f1f",
    "text-on-primary": "#f9f9f9",
    "text-on-danger": "#f9f9f9",
    "surface-primary": "#1f1f1f",
    "surface-primary-hover": "#303030",
    "surface-danger": "#825955",
    "surface-danger-hover": "#704947",
    "feedback-success": "#19713d",
    "feedback-warning": "#8a5900",
    "feedback-info": "#1267a7",
    "feedback-error": "#b3342b",
  },
  dark: {
    "text-base": "#e2e2e2",
    "text-subtle": "#ababab",
    "text-on-primary": "#1f1f1f",
    "text-on-danger": "#1f1f1f",
    "surface-base": "#1f1f1f",
    "surface-subtle": "#303030",
    "surface-primary": "#e2e2e2",
    "surface-primary-hover": "#c6c6c6",
    "surface-subtle-hover": "#3a3a3a",
    "surface-base-hover": "#303030",
    "surface-danger": "#c8a19d",
    "surface-danger-hover": "#b9918b",
    "border-base": "#919191",
    "border-subtle": "#5e5e5e",
    "feedback-success": "#67c88c",
    "feedback-warning": "#e5b951",
    "feedback-info": "#70b5ed",
    "feedback-error": "#ed9690",
  },
};

export const candidateElevation = {
  low: { offsetX: 0, offsetY: 1, radius: 2, spread: 0, color: "#0000001a" },
  md: { offsetX: 0, offsetY: 2, radius: 6, spread: 0, color: "#00000029" },
  high: { offsetX: 0, offsetY: 4, radius: 12, spread: 0, color: "#0000002e" },
};

export function sceneTokens(theme, proposed) {
  if (!proposed) return {};
  const variables = Object.fromEntries(
    Object.entries(candidate[theme]).map(([name, value]) => [`--sys-color-${name}`, value]),
  );
  variables["--comp-switch-track-bg"] = theme === "light" ? "#1f1f1f" : "#e2e2e2";
  variables["--comp-switch-handle-bg"] = theme === "light" ? "#f9f9f9" : "#1f1f1f";
  variables["--comp-switch-label-color"] = variables["--comp-switch-track-bg"];
  for (const level of ["low", "md", "high"]) {
    const effect = candidateElevation[level];
    for (const [key, field] of Object.entries({
      "offset-x": "offsetX",
      "offset-y": "offsetY",
      radius: "radius",
      spread: "spread",
      color: "color",
    })) {
      variables[`--sys-elevation-raised-${level}-${key}`] =
        field === "color" ? effect[field] : `${effect[field]}px`;
    }
  }
  return variables;
}
