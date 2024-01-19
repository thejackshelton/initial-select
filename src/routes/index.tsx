import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { isBrowser } from "@builder.io/qwik/build";
import { SelectListbox } from "~/components/select/select-listbox";
import { SelectOption } from "~/components/select/select-option";
import { SelectTrigger } from "~/components/select/select-trigger";
import { Select } from "~/components/select/select-inline";

const mockUsers = ["Tim", "Ryan", "Jim"];

const moreUsers = ["Carla", "Rachel", "Monica", "Jessie", "Abby"];

export default component$(() => {
  const usersSig = useSignal<string[]>([]);
  const addMoreUsersSig = useSignal<boolean>(false);

  useTask$(async () => {
    usersSig.value = mockUsers;
  });

  useTask$(async ({ track }) => {
    track(() => addMoreUsersSig.value);

    if (isBrowser) {
      usersSig.value = [...usersSig.value, ...moreUsers];
    }
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
      <button onClick$={$(() => (addMoreUsersSig.value = true))}>
        Add more!
      </button>
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
