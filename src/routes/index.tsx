import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { SelectListbox } from "~/components/select/select-listbox";
import { SelectOption } from "~/components/select/select-option";
import { SelectTrigger } from "~/components/select/select-trigger";
import { Select } from "~/components/select/select-inline";

export default component$(() => {
  const mockUsers = ["Tim", "Ryan", "Jim"];
  const moreUsers = ["Carla", "Rachel", "Monica", "Jessie", "Abby"];

  const usersSig = useSignal<string[]>([]);

  useTask$(async () => {
    usersSig.value = mockUsers;
  });

  const handleClick$ = $(() => {
    usersSig.value = [...usersSig.value, ...moreUsers];
  });

  return (
    <div style={{ height: "1000px" }}>
      <Select>
        <SelectTrigger>Trigger</SelectTrigger>
        <SelectListbox
          style={{ padding: "0px", margin: "0px", listStyle: "none" }}
        >
          {usersSig.value.map((user) => (
            <SelectOption key={user}>{user}</SelectOption>
          ))}
        </SelectListbox>
      </Select>
      {/* somehow this adds more js on page load? / wakes up the framework? */}
      <button onClick$={handleClick$}>Add more!</button>
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
