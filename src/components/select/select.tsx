import {
  component$,
  Slot,
  type PropsOf,
  useSignal,
  useContextProvider,
  type Signal,
  useTask$,
} from "@builder.io/qwik";
import { type SelectContext } from "./select-context.type";
import SelectContextId from "./select-context-id";

export type SelectProps = PropsOf<"div">;

export const SelectImpl = component$<SelectProps>((props) => {
  // refs
  const rootRef = useSignal<HTMLDivElement>();
  const triggerRef = useSignal<HTMLButtonElement>();
  const popoverRef = useSignal<HTMLElement>();
  const listboxRef = useSignal<HTMLUListElement>();

  /* 
    while this may seem unnecessary, Qwik renders without knowledge of its parents or children. As a result, we need to increment our option indexes alongside our options to get the proper index on the client. 
  */
  const optionRefsArray = useSignal<Signal<HTMLLIElement>[]>([]);
  const optionElementsSig = useSignal<HTMLLIElement[] | null>(null);

  // core state
  const selectedIndexSig = useSignal<number | null>(null);
  const selectedOptionRef = useSignal<HTMLLIElement | null>(null);
  const isListboxOpenSig = useSignal<boolean>(false);
  const isFirstOpenSig = useSignal<boolean>(true);

  useTask$(function deriveSelectedRef({ track }) {
    track(() => selectedIndexSig.value);

    if (selectedIndexSig.value !== null) {
      selectedOptionRef.value =
        optionRefsArray.value[selectedIndexSig.value].value;
    }
  });

  /* would prefer to use a computed, but can't due to issue #5378 */
  useTask$(function deriveOptions({ track }) {
    isFirstOpenSig.value && track(() => isListboxOpenSig.value);
    isFirstOpenSig.value = false;

    /* if the user has added more options */
    track(() => optionRefsArray.value);

    optionElementsSig.value = optionRefsArray.value.map((o) => o.value);
    console.log(optionElementsSig.value.map((o) => o.textContent));
  });

  const context: SelectContext = {
    triggerRef,
    popoverRef,
    listboxRef,
    selectedOptionRef,
    optionRefsArray,
    optionElementsSig,
    isListboxOpenSig,
    selectedIndexSig,
  };

  useContextProvider(SelectContextId, context);

  return (
    <div
      role="combobox"
      ref={rootRef}
      data-state={context.isListboxOpenSig.value ? "open" : "closed"}
      {...props}
    >
      <Slot />
    </div>
  );
});
