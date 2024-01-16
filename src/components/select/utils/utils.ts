import { Signal } from "@builder.io/qwik";
import { SelectContext } from "../select-context.type";
import { DisabledArr } from "../select-trigger";

export const getNextEnabledOptionIndexFromDisabledArr = (
  currentIndex: number,
  disabledArr: Array<{ disabled: boolean }>,
): number => {
  let offset = 1;
  const len = disabledArr.length;
  while (disabledArr[(currentIndex + offset) % len]?.disabled) {
    offset++;
    if (offset + currentIndex > len - 1) {
      currentIndex = 0;
      offset = 0;
    }

    // no enabled opt found
    if (offset >= len) {
      return -1;
    }
  }
  return (currentIndex + offset) % len;
};

export const getPrevEnabledOptionIndexFromDisabledArr = (
  currentIndex: number,
  disabledArr: Array<{ disabled: boolean }>,
) => {
  let offset = 1;
  const len = disabledArr.length;
  while (disabledArr[(currentIndex - offset + len) % len]?.disabled) {
    offset++;
    if (currentIndex - offset < 0) {
      currentIndex = len - 1;
      offset = 0;
    }
  }
  return (currentIndex - offset + len) % len;
};

export const getIntialIndexOnKey = (key: string): number => {
  // in the future, many options will need to select fist option
  // we also might need to filter for disbled items
  const sendFistOption = ["ArrowDown", "ArrowUp"];
  const shouldBeFirstOption = sendFistOption.includes(key);
  if (shouldBeFirstOption) {
    return 0;
  }
  return -1;
};

// this is done more inline with how W3C does it, but class could be change for attributes too
const toggleHiglightClass = (
  prevIndex: number,
  currentIndex: number,
  elemArr: (HTMLLIElement | undefined)[],
) => {
  const currElem = elemArr[currentIndex];
  if (currElem === undefined) {
    return;
  }
  // this should be passed as prop
  const className = "bg-red-500";
  if (prevIndex === -1) {
    currElem.classList.toggle(className);
    return;
  }
  const prevElem = elemArr[prevIndex];
  if (prevElem === undefined) {
    return;
  }
  prevElem.classList.toggle(className);
  currElem.classList.toggle(className);
};

// this fn could be replaced by checking in each option instead, just went for W3C
export const houseKeepToggle = (
  currentIndex: number,
  indexSig: Signal<number>,
  elemArr: (HTMLLIElement | undefined)[],
) => {
  const prevIndex = indexSig.value;
  toggleHiglightClass(prevIndex, currentIndex, elemArr);
  indexSig.value = currentIndex;
};

export const setTriggerText = (
  indexSig: Signal<number>,
  elemArr: (HTMLLIElement | undefined)[],
  selectContext: SelectContext,
) => {
  const highlightElem = elemArr[indexSig.value];
  const strg = highlightElem!.innerText;
  selectContext.triggerRef.value!.innerText = strg;
};

export const singleCharSearch = (
  char: string,
  deltaIndex: Signal<number>,
  elemArr: (HTMLLIElement | undefined)[],
): number => {
  const availableOptions = elemArr.filter(
    (option) => !(option?.getAttribute("aria-disabled") === "true"),
  );
  if (availableOptions[0] === undefined) {
    console.log("undefined");

    return -1;
  }
  const charOptions = availableOptions.map((e) => {
    return e!.textContent!.slice(0, 1).toLowerCase();
  });
  const charIndex = charOptions.indexOf(char);

  if (charIndex === -1) {
    return -1;
  }
  if (deltaIndex.value === -1) {
    const elemIndex = elemArr.indexOf(availableOptions[charIndex]);
    deltaIndex.value = elemIndex + 1;
    return elemIndex;
  }
  const isRepeat = charOptions[deltaIndex.value - 1] === char;

  if (isRepeat) {
    const nextChars = charOptions.slice(deltaIndex.value);
    const repeatIndex = nextChars.indexOf(char);
    if (repeatIndex !== -1) {
      const nextIndex = repeatIndex + deltaIndex.value;
      const nextElem = availableOptions[nextIndex];
      const nextElemIndex = elemArr.indexOf(nextElem);
      deltaIndex.value = nextIndex + 1;
      return nextElemIndex;
    }
    const elemIndex = elemArr.indexOf(availableOptions[charIndex]);
    deltaIndex.value = elemIndex + 1;
    return elemIndex;
  }
  const elemIndex = elemArr.indexOf(availableOptions[charIndex]);
  deltaIndex.value = elemIndex + 1;
  return elemIndex;
  console.log("bucko");

  return -1;
};
