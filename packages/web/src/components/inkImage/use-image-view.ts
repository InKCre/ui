import { computed, onBeforeUnmount, reactive, ref, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";

interface Point {
  x: number;
  y: number;
}

const MAX_SCALE = 8;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export function useImageView(viewport: Ref<HTMLElement | undefined>) {
  const size = reactive({ width: 0, height: 0, imageWidth: 0, imageHeight: 0 });
  const scale = ref(1);
  const position = reactive({ x: 0, y: 0 });
  const dragging = ref(false);
  const pointers = new Map<number, Point>();
  let gesture: { center: Point; imagePoint: Point; distance: number; scale: number } | undefined;
  let moved = false;
  let travel = 0;
  let startedOnImage = false;
  let lastPointerType = "";
  let lastTap: { point: Point; time: number } | undefined;

  const ready = computed(() => size.imageWidth > 0 && size.width > 0 && size.height > 0);
  const fitScale = computed(() =>
    ready.value ? Math.min(1, size.width / size.imageWidth, size.height / size.imageHeight) : 1,
  );
  const isFit = computed(() => Math.abs(scale.value - fitScale.value) < 0.000001);

  function setView(nextScale: number, x: number, y: number) {
    scale.value = clamp(nextScale, fitScale.value, MAX_SCALE);
    const width = size.imageWidth * scale.value;
    const height = size.imageHeight * scale.value;
    position.x = width <= size.width ? (size.width - width) / 2 : clamp(x, size.width - width, 0);
    position.y =
      height <= size.height ? (size.height - height) / 2 : clamp(y, size.height - height, 0);
  }

  function fit() {
    setView(fitScale.value, 0, 0);
    if (pointers.size) beginGesture();
  }

  function zoomTo(nextScale: number, point = { x: size.width / 2, y: size.height / 2 }) {
    if (!ready.value) return;
    const boundedScale = clamp(nextScale, fitScale.value, MAX_SCALE);
    const ratio = boundedScale / scale.value;
    setView(
      boundedScale,
      point.x - (point.x - position.x) * ratio,
      point.y - (point.y - position.y) * ratio,
    );
    if (pointers.size) beginGesture();
  }

  function releasePointers() {
    for (const id of pointers.keys()) {
      if (viewport.value?.hasPointerCapture(id)) viewport.value.releasePointerCapture(id);
    }
    pointers.clear();
    gesture = undefined;
    dragging.value = false;
    lastTap = undefined;
  }

  function resetImage() {
    releasePointers();
    moved = false;
    travel = 0;
    startedOnImage = false;
    lastPointerType = "";
    size.imageWidth = 0;
    size.imageHeight = 0;
    scale.value = 1;
    position.x = 0;
    position.y = 0;
  }

  function setImage(image: HTMLImageElement) {
    size.imageWidth = image.naturalWidth;
    size.imageHeight = image.naturalHeight;
    fit();
  }

  useResizeObserver(viewport, () => {
    const element = viewport.value;
    if (!element) return;
    const wasFit = isFit.value;
    const imagePoint = {
      x: (size.width / 2 - position.x) / scale.value,
      y: (size.height / 2 - position.y) / scale.value,
    };
    releasePointers();
    size.width = element.clientWidth;
    size.height = element.clientHeight;
    if (wasFit) {
      fit();
    } else {
      const nextScale = Math.max(scale.value, fitScale.value);
      setView(
        nextScale,
        size.width / 2 - imagePoint.x * nextScale,
        size.height / 2 - imagePoint.y * nextScale,
      );
    }
  });
  onBeforeUnmount(releasePointers);

  function pointInView(event: { clientX: number; clientY: number }): Point {
    const rect = viewport.value!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function beginGesture() {
    const [first, second] = [...pointers.values()];
    dragging.value = !!first;
    if (!first) {
      gesture = undefined;
      return;
    }
    const center = second ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 } : first;
    gesture = {
      center,
      imagePoint: {
        x: (center.x - position.x) / scale.value,
        y: (center.y - position.y) / scale.value,
      },
      distance: second ? Math.max(1, distance(first, second)) : 1,
      scale: scale.value,
    };
  }

  function pointerDown(event: PointerEvent) {
    if (!ready.value || event.button !== 0 || pointers.size === 2) return;
    if (pointers.size === 0) {
      moved = false;
      travel = 0;
      startedOnImage = event.target instanceof HTMLImageElement;
      lastPointerType = event.pointerType;
      viewport.value?.focus({ preventScroll: true });
    } else {
      moved = true;
      lastTap = undefined;
    }
    pointers.set(event.pointerId, pointInView(event));
    viewport.value?.setPointerCapture(event.pointerId);
    beginGesture();
  }

  function pointerMove(event: PointerEvent) {
    if (!pointers.has(event.pointerId) || !gesture) return;
    pointers.set(event.pointerId, pointInView(event));
    const [first, second] = [...pointers.values()];
    const center = second ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 } : first;
    travel += distance(center, gesture.center);
    if (second || travel > 3) {
      moved = true;
      lastTap = undefined;
    }
    const nextScale = second
      ? clamp(
          (gesture.scale * distance(first, second)) / gesture.distance,
          fitScale.value,
          MAX_SCALE,
        )
      : gesture.scale;
    setView(
      nextScale,
      center.x - gesture.imagePoint.x * nextScale,
      center.y - gesture.imagePoint.y * nextScale,
    );
    // Rebase at clamped edges so reversing a drag or pinch responds immediately.
    beginGesture();
  }

  function toggleZoom(point: Point) {
    if (isFit.value) zoomTo(Math.max(1, fitScale.value * 2), point);
    else fit();
  }

  function pointerUp(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) return;
    if (
      event.type === "pointerup" &&
      pointers.size === 1 &&
      event.pointerType === "touch" &&
      !moved &&
      startedOnImage
    ) {
      const point = pointInView(event);
      const time = Date.now();
      if (lastTap && time - lastTap.time < 300 && distance(lastTap.point, point) < 24) {
        toggleZoom(point);
        lastTap = undefined;
      } else {
        lastTap = { point, time };
      }
    }
    if (event.type !== "pointerup") {
      moved = true;
      lastTap = undefined;
    }
    pointers.delete(event.pointerId);
    if (viewport.value?.hasPointerCapture(event.pointerId))
      viewport.value.releasePointerCapture(event.pointerId);
    beginGesture();
  }

  function wheel(event: WheelEvent) {
    if (!ready.value) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size.height : 1;
    const delta = clamp(event.deltaY * unit, -100, 100);
    zoomTo(scale.value * Math.exp(-delta * (event.ctrlKey ? 0.01 : 0.002)), pointInView(event));
  }

  function doubleClick(event: MouseEvent) {
    if (lastPointerType !== "touch" && !moved && startedOnImage) toggleZoom(pointInView(event));
  }

  function keydown(event: KeyboardEvent) {
    if (!ready.value || event.ctrlKey || event.metaKey || event.altKey) return;
    switch (event.key) {
      case "+":
      case "=":
        zoomTo(scale.value * 1.25);
        break;
      case "-":
        zoomTo(scale.value / 1.25);
        break;
      case "0":
        fit();
        break;
      case "1":
        zoomTo(1);
        break;
      case "ArrowLeft":
        setView(scale.value, position.x + 40, position.y);
        break;
      case "ArrowRight":
        setView(scale.value, position.x - 40, position.y);
        break;
      case "ArrowUp":
        setView(scale.value, position.x, position.y + 40);
        break;
      case "ArrowDown":
        setView(scale.value, position.x, position.y - 40);
        break;
      case "PageUp":
        setView(scale.value, position.x, position.y + size.height * 0.8);
        break;
      case "PageDown":
        setView(scale.value, position.x, position.y - size.height * 0.8);
        break;
      case "Home":
        setView(scale.value, 0, 0);
        break;
      case "End":
        setView(
          scale.value,
          size.width - size.imageWidth * scale.value,
          size.height - size.imageHeight * scale.value,
        );
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return reactive({
    scale,
    isFit,
    dragging,
    canZoomIn: computed(() => ready.value && scale.value < MAX_SCALE),
    canZoomOut: computed(() => ready.value && !isFit.value),
    isOriginal: computed(() => Math.abs(scale.value - 1) < 0.000001),
    imageStyle: computed(() => ({
      width: `${size.imageWidth}px`,
      height: `${size.imageHeight}px`,
      transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale.value})`,
    })),
    fit,
    zoomTo,
    resetImage,
    setImage,
    pointerDown,
    pointerMove,
    pointerUp,
    wheel,
    doubleClick,
    keydown,
    shouldCloseOnClick: (event: MouseEvent) =>
      event.target === event.currentTarget && !moved && !startedOnImage,
  });
}
