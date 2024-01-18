import { type Signal } from "@builder.io/qwik";

export type SelectContext = {
  // refs
  triggerRef: Signal<HTMLButtonElement | undefined>;
  popoverRef: Signal<HTMLElement | undefined>;
  listboxRef: Signal<HTMLUListElement | undefined>;
  selectedOptionRef: Signal<HTMLLIElement | null>;
  // core state
  optionRefsArray: Signal<Array<Signal<HTMLLIElement | undefined>>>;
  optionElementsSig: Signal<Array<HTMLLIElement> | null>;
  // optionIndexesSig: Signal<Array<number>>;
  isListboxOpenSig: Signal<boolean>;
  selectedIndexSig: Signal<number | null>;
};
