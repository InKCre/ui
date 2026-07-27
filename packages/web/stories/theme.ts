export type StoryTheme = "light" | "dark";

const observerKey = Symbol.for("@inkcre/ui-web/histoire-theme-observer");

interface ThemeRoot extends HTMLElement {
  [observerKey]?: MutationObserver;
}

export function resolveStoryTheme(root: HTMLElement): StoryTheme {
  return root.classList.contains("dark") ? "dark" : "light";
}

export function synchronizeStoryTheme(root: HTMLElement): StoryTheme {
  const theme = resolveStoryTheme(root);
  root.dataset.theme = theme;
  return theme;
}

export function installThemeBridge(root: ThemeRoot = document.documentElement): () => void {
  root[observerKey]?.disconnect();
  synchronizeStoryTheme(root);

  const observer = new MutationObserver(() => {
    synchronizeStoryTheme(root);
  });
  observer.observe(root, { attributes: true, attributeFilter: ["class"] });
  root[observerKey] = observer;

  return () => {
    observer.disconnect();
    if (root[observerKey] === observer) {
      delete root[observerKey];
    }
  };
}
