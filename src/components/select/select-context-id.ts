import { createContextId } from "@builder.io/qwik";
import { type SelectContext } from "./select-context.type";

const SelectContextId = createContextId<SelectContext>("Select");

export default SelectContextId;
