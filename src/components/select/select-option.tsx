import {
  component$,
  Slot,
  type PropsOf,
  useContext,
  useTask$,
  useSignal,
  $,
} from "@builder.io/qwik";
import SelectContextId from "./select-context";

type SelectOptionProps = PropsOf<"li"> & {
  index?: number;
};

export const SelectOption = component$<SelectOptionProps>((props) => {
  /* look at select-inline on how we get the index. */
  const { index, ...rest } = props;

  const context = useContext(SelectContextId);
  const optionRef = useSignal<HTMLLIElement>();
  const localIndexSig = useSignal<number | null>(null);
  useTask$(function getIndexTask() {
    if (index === undefined)
      throw Error(
        "Qwik UI: Select component option cannot find its proper index.",
      );

    localIndexSig.value = index;

    context.optionRefsArray.value[index] = optionRef;
  });

  const handleClick$ = $(() => {
    context.selectedIndexSig.value = localIndexSig.value;
    context.isListboxOpenSig.value = false;
  });

  // const handlePointerOver$ = $(() => {
  //   context.highlightedIndexSig.value = localIndexSig.value;
  // });

  return (
    <li
      onClick$={[handleClick$, props.onClick$]}
      {...rest}
      ref={optionRef}
      tabIndex={-1}
      aria-selected={localIndexSig.value === context.selectedIndexSig.value}
    >
      <Slot />
    </li>
  );
});
