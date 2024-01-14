import {
  component$,
  Slot,
  type PropsOf,
  useContext,
  sync$,
  $,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import {
  getIntialIndexOnKey,
  getNextEnabledOptionIndexFromDisabledArr,
  getPrevEnabledOptionIndexFromDisabledArr,
  houseKeepToggle,
  setTriggerText,
  toggleHiglightClass,
} from "./utils/utils";
import SelectContextId from "./select-context-id";

type SelectTriggerProps = PropsOf<"button">;
export const SelectTrigger = component$<SelectTriggerProps>((props) => {
  const context = useContext(SelectContextId);
  const indexHiglightSig = useSignal(-1);
  const handleClick$ = $(() => {
    context.isListboxOpenSig.value = !context.isListboxOpenSig.value;
  });
  const handleKeyDown$ = $((e: KeyboardEvent) => {
    // we migth want to consider making a ts type just for the strgs we care about
    // in the future, multiple keys need to open the popup
    const openPopup = ["ArrowDown", "ArrowUp"];
    const closedPopup = context.isListboxOpenSig.value === false;
    const shouldOpen = closedPopup && openPopup.includes(e.key);
    const elemArr = context.optionRefsArray.value.map((e) => e.value);
    const disabledArr = elemArr.map((e) => {
      return { disabled: e?.getAttribute("aria-disabled") === "true" };
    });
    if (shouldOpen) {
      context.isListboxOpenSig.value = true;
      const initalIndex = getIntialIndexOnKey(e.key);
      toggleHiglightClass(indexHiglightSig.value, initalIndex, elemArr);
      indexHiglightSig.value = initalIndex;
      return;
    }
    if (context.isListboxOpenSig.value) {
      if (e.key === "ArrowDown") {
        const nextIndex = getNextEnabledOptionIndexFromDisabledArr(
          indexHiglightSig.value,
          disabledArr,
        );
        houseKeepToggle(nextIndex, indexHiglightSig, elemArr);
        return;
      }
      if (e.key === "ArrowUp") {
        const nextIndex = getPrevEnabledOptionIndexFromDisabledArr(
          indexHiglightSig.value,
          disabledArr,
        );
        houseKeepToggle(nextIndex, indexHiglightSig, elemArr);
        return;
      }
      if (e.key === "Enter") {
        setTriggerText(indexHiglightSig, elemArr, context);
        return;
      }
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
      class="bg-slate-800 p-2 text-white"
    >
      <Slot />
      {context.selectedOptionRef.value?.textContent}
    </button>
  );
});
