import { watch, onBeforeUnmount, type Ref } from "vue";

// Native dialogs own focus containment and the modal stack, including nested dialogs.
export function useNativeDialog(
  element: Ref<HTMLDialogElement | undefined>,
  open: Ref<boolean>,
  modal: () => boolean,
) {
  let previousFocus: HTMLElement | null = null;
  watch(
    [element, open, modal],
    ([dialog, visible, isModal]) => {
      if (!dialog) return;
      if (!visible) {
        if (dialog.open) dialog.close();
        return;
      }
      if (dialog.open && dialog.matches(":modal") === isModal) return;
      if (dialog.open) dialog.close();
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (isModal) dialog.showModal();
      else dialog.show();
    },
    { flush: "post" },
  );
  onBeforeUnmount(() => {
    const dialog = element.value;
    const ownsFocus = dialog?.contains(document.activeElement);
    dialog?.close();
    if (ownsFocus && previousFocus?.isConnected) previousFocus.focus();
  });
}
