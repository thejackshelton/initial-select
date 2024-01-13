import {
  component$,
  Slot,
  type PropsOf,
  useContext,
  useTask$,
  useSignal,
  $,
} from "@builder.io/qwik";
import SelectContextId from "./select-context-id";

type SelectOptionProps = PropsOf<"li">;

export const SelectOption = component$<SelectOptionProps>((props) => {
  const context = useContext(SelectContextId);
  const localIndexSig = useSignal<number | null>(null);
  const optionRef = useSignal<HTMLLIElement>();

  const handleClick$ = $(() => {
    context.selectedIndexSig.value = localIndexSig.value;
    context.isListboxOpenSig.value = false;
  });

  useTask$(function getIndexTask() {
    // assigns a local index according to the array length
    localIndexSig.value = context.optionRefsArray.value.length;

    // pushing in refs
    context.optionRefsArray.value = [
      ...context.optionRefsArray.value,
      optionRef,
    ];
  });

  return (
    <li
      onClick$={[handleClick$, props.onClick$]}
      {...props}
      ref={optionRef}
      tabIndex={-1}
      aria-selected={localIndexSig.value === context.selectedIndexSig.value}
    >
      <Slot />
    </li>
  );
});
