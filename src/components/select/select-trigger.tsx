import {
  component$,
  Slot,
  type PropsOf,
  useContext,
  sync$,
  $,
  useSignal,
} from "@builder.io/qwik";
import { useSelect } from "./use-select";
import SelectContextId from "./select-context-id";

type SelectTriggerProps = PropsOf<"button">;
export type DisabledArr = Array<{ disabled: boolean }>;
export const SelectTrigger = component$<SelectTriggerProps>((props) => {
  const {
    getNextEnabledOptionIndexFromDisabledArr,
    getPrevEnabledOptionIndexFromDisabledArr,
    getIntialIndexOnKey,
    manageToggle,
    setTriggerText,
    singleCharSearch,
  } = useSelect();

  const context = useContext(SelectContextId);
  const highlightedIndexSig = useSignal(-1);
  const typedLettersSig = useSignal("");
  const deltaIndexSig = useSignal(-1);

  const handleClick$ = $(() => {
    context.isListboxOpenSig.value = !context.isListboxOpenSig.value;
  });

  const handleKeyDown$ = $(async (e: KeyboardEvent) => {
    // we migth want to consider making a ts type just for the strgs we care about
    // in the future, multiple keys need to open the popup
    const openPopupKeys = ["ArrowDown", "ArrowUp"];
    const elemArr = context.optionRefsArray.value.map((e) => e.value);
    const disabledArr: DisabledArr = elemArr.map((e) => {
      return { disabled: e?.getAttribute("aria-disabled") === "true" };
    });

    const singleCharRegex = /^[a-z]$/;
    const isSingleChar = singleCharRegex.test(e.key);
    // TODO: refactor each if statement with a function inside of it instead of the current pattern of:
    // if(true){lines of code}
    //to
    //if(true){fun(...)}

    // this whole section in the if statement could be refactored into a "closed behavior" fn
    if (!context.isListboxOpenSig.value) {
      if (isSingleChar) {
        context.isListboxOpenSig.value = true;
        const posIndex = await singleCharSearch(e.key, deltaIndexSig, elemArr);
        if (posIndex !== -1) {
          manageToggle(posIndex, highlightedIndexSig, elemArr);
        }
        return;
      }

      if (e.key === "Home") {
        context.isListboxOpenSig.value = true;
        const firstOpt = disabledArr.findIndex((e) => e.disabled === false);
        manageToggle(firstOpt, highlightedIndexSig, elemArr);
        return;
      }
      if (e.key === "End") {
        context.isListboxOpenSig.value = true;
        for (let index = disabledArr.length - 1; index > -1; index--) {
          const elementStatus = disabledArr[index];
          if (!elementStatus.disabled) {
            manageToggle(index, highlightedIndexSig, elemArr);
            highlightedIndexSig.value = index;
            break;
          }
        }
        return;
      }
    }
    if (!context.isListboxOpenSig.value && openPopupKeys.includes(e.key)) {
      context.isListboxOpenSig.value = true;
      if (highlightedIndexSig.value !== -1) {
        return;
      }
      const initalIndex = getIntialIndexOnKey(e.key);
      manageToggle(await initalIndex, highlightedIndexSig, elemArr);
      return;
    }
    if (context.isListboxOpenSig.value) {
      typedLettersSig.value = typedLettersSig.value + e.key;
      if (isSingleChar) {
        const posIndex = await singleCharSearch(e.key, deltaIndexSig, elemArr);
        if (posIndex !== -1) {
          manageToggle(posIndex, highlightedIndexSig, elemArr);
          return;
        }
        return;
      }
      if (e.key === "ArrowDown") {
        const nextIndex = getNextEnabledOptionIndexFromDisabledArr(
          highlightedIndexSig.value,
          disabledArr,
        );
        manageToggle(await nextIndex, highlightedIndexSig, elemArr);
        return;
      }
      if (e.key === "ArrowUp") {
        if (highlightedIndexSig.value === -1) {
          const initalIndex = getIntialIndexOnKey(e.key);
          manageToggle(await initalIndex, highlightedIndexSig, elemArr);
          return;
        }
        const nextIndex = getPrevEnabledOptionIndexFromDisabledArr(
          highlightedIndexSig.value,
          disabledArr,
        );
        manageToggle(await nextIndex, highlightedIndexSig, elemArr);
        return;
      }
      if (e.key === "Enter") {
        setTriggerText(highlightedIndexSig, elemArr);
        return;
      }
      if (e.key === "Home") {
        const firstOpt = disabledArr.findIndex((e) => e.disabled === false);
        manageToggle(firstOpt, highlightedIndexSig, elemArr);
        return;
      }
      if (e.key === "End") {
        // the things we do when no lastIndex :(
        for (let index = disabledArr.length - 1; index > -1; index--) {
          const elementStatus = disabledArr[index];
          if (!elementStatus.disabled) {
            manageToggle(index, highlightedIndexSig, elemArr);
            highlightedIndexSig.value = index;
            break;
          }
        }
        return;
      }
      if (e.key === "Tab") {
        const tabIndex =
          highlightedIndexSig.value === -1 ? 0 : highlightedIndexSig.value;
        setTriggerText({ value: tabIndex }, elemArr);
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
