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

type SelectProps = PropsOf<"div">;

export const Select = component$<SelectProps>((props) => {
  // refs
  const rootRef = useSignal<HTMLDivElement>();
  const triggerRef = useSignal<HTMLButtonElement>();
  const popoverRef = useSignal<HTMLElement>();
  const listboxRef = useSignal<HTMLUListElement>();
  const optionRefsArray = useSignal<Signal<HTMLLIElement>[]>([]);

  // core state
  const selectedIndexSig = useSignal<number | null>(null);
  const selectedOptionRef = useSignal<HTMLLIElement | null>(null);
  const isListboxOpenSig = useSignal<boolean>(false);

  useTask$(function deriveSelectedRef({ track }) {
    track(() => selectedIndexSig.value);

    if (selectedIndexSig.value !== null) {
      selectedOptionRef.value =
        optionRefsArray.value[selectedIndexSig.value].value;
    }
  });

  const context: SelectContext = {
    triggerRef,
    popoverRef,
    listboxRef,
    selectedOptionRef,
    optionRefsArray,
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
