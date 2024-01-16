import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Select } from "~/components/select/select";
import { SelectListbox } from "~/components/select/select-listbox";
import { SelectOption } from "~/components/select/select-option";
import { SelectTrigger } from "~/components/select/select-trigger";

export default component$(() => {
  return (
    <div style={{ height: "1000px" }}>
      <Select>
        <SelectTrigger>Trigger</SelectTrigger>
        <SelectListbox
          style={{ padding: "0px", margin: "0px", listStyle: "none" }}
        >
          <SelectOption>Option 1</SelectOption>
          <SelectOption>Option 2</SelectOption>
          <SelectOption>Option 3</SelectOption>
          <SelectOption>Choice 1</SelectOption>
          <SelectOption>Choice 2</SelectOption>
          <SelectOption>Choice 3</SelectOption>
          <SelectOption>Selection 1</SelectOption>
          <SelectOption>Selection 2</SelectOption>
          <SelectOption>Selection 3</SelectOption>
        </SelectListbox>
      </Select>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
