import {
  component$,
  Slot,
  type PropsOf,
  useContext,
  sync$,
  $,
  useSignal,
} from "@builder.io/qwik";
import {
  getIntialIndexOnKey,
  getNextEnabledOptionIndexFromDisabledArr,
  getPrevEnabledOptionIndexFromDisabledArr,
  houseKeepToggle,
  setTriggerText,
  singleCharSearch,
} from "./utils/utils";
import SelectContextId from "./select-context-id";

type SelectTriggerProps = PropsOf<"button">;
export type DisabledArr = Array<{ disabled: boolean }>;
export const SelectTrigger = component$<SelectTriggerProps>((props) => {
  const context = useContext(SelectContextId);
  const indexHiglightSig = useSignal(-1);
  const handleClick$ = $(() => {
    context.isListboxOpenSig.value = !context.isListboxOpenSig.value;
  });
  const lettersTyped = useSignal("");
  const deltaIndexSig = useSignal(-1);
  const handleKeyDown$ = $((e: KeyboardEvent) => {
    // we migth want to consider making a ts type just for the strgs we care about
    // in the future, multiple keys need to open the popup
    const openPopup = ["ArrowDown", "ArrowUp"];
    const closedPopup = context.isListboxOpenSig.value === false;
    const shouldOpen = closedPopup && openPopup.includes(e.key);
    const elemArr = context.optionRefsArray.value.map((e) => e.value);
    const disabledArr: DisabledArr = elemArr.map((e) => {
      return { disabled: e?.getAttribute("aria-disabled") === "true" };
    });

    console.log("should open lol ", shouldOpen, closedPopup);

    if (shouldOpen) {
      console.log("chaning 1");
      context.isListboxOpenSig.value = true;
      const initalIndex = getIntialIndexOnKey(e.key);
      houseKeepToggle(initalIndex, indexHiglightSig, elemArr);
      return;
    }
    if (context.isListboxOpenSig.value) {
      lettersTyped.value = lettersTyped.value + e.key;
      console.log("so far: ", lettersTyped.value);
      const singleChar = /^[a-z]$/;
      if (singleChar.test(e.key)) {
        const posIndex = singleCharSearch(e.key, deltaIndexSig, elemArr);
        if (posIndex !== -1) {
          houseKeepToggle(posIndex, indexHiglightSig, elemArr);
        }
      }
      if (e.key === "ArrowDown") {
        const nextIndex = getNextEnabledOptionIndexFromDisabledArr(
          indexHiglightSig.value,
          disabledArr,
        );
        houseKeepToggle(nextIndex, indexHiglightSig, elemArr);
        return;
      }
      if (e.key === "ArrowUp") {
        if (indexHiglightSig.value === -1) {
          const initalIndex = getIntialIndexOnKey(e.key);
          houseKeepToggle(initalIndex, indexHiglightSig, elemArr);
          return;
        }
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
      if (e.key === "Home") {
        const firstOpt = disabledArr.findIndex((e) => e.disabled === false);
        houseKeepToggle(firstOpt, indexHiglightSig, elemArr);
        return;
      }
      if (e.key === "End") {
        // the things we do when no lastIndex :(
        for (let index = disabledArr.length - 1; index > -1; index--) {
          const elementStatus = disabledArr[index];
          if (!elementStatus.disabled) {
            houseKeepToggle(index, indexHiglightSig, elemArr);
            indexHiglightSig.value = index;
            break;
          }
        }
        return;
      }
      if (e.key === "Tab") {
        const tabIndex =
          indexHiglightSig.value === -1 ? 0 : indexHiglightSig.value;
        setTriggerText({ value: tabIndex }, elemArr, context);
        context.isListboxOpenSig.value = false;
        return;
      }
      if (e.key === "Escape") {
        context.isListboxOpenSig.value = false;
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
