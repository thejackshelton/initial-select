import {
  component$,
  Slot,
  type PropsOf,
  useContext,
  sync$,
  $,
} from "@builder.io/qwik";
import SelectContextId from "./select-context-id";

type SelectTriggerProps = PropsOf<"button">;

export const SelectTrigger = component$<SelectTriggerProps>((props) => {
  const context = useContext(SelectContextId);

  const handleClick$ = $(() => {
    context.isListboxOpenSig.value = !context.isListboxOpenSig.value;
  });

  const handleKeyDown$ = $((e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      context.isListboxOpenSig.value = true;
    }
  });

  const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
    const keys = ["ArrowUp", "ArrowDown", "Home", "End", "PageDown", "PageUp"];

    if (keys.includes(e.key)) {
      e.preventDefault();
    }
  });

  return (
    <button
      {...props}
      ref={context.triggerRef}
      onClick$={[handleClick$, props.onClick$]}
      aria-expanded={context.isListboxOpenSig.value}
      onKeyDown$={[handleKeyDownSync$, handleKeyDown$, props.onKeyDown$]}
      data-state={context.isListboxOpenSig.value ? "open" : "closed"}
    >
      <Slot />
      {context.selectedOptionRef.value?.textContent}
    </button>
  );
});
