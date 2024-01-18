import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Select } from "~/components/select/select";
import { SelectListbox } from "~/components/select/select-listbox";
import { SelectOption } from "~/components/select/select-option";
import { SelectTrigger } from "~/components/select/select-trigger";

export default component$(() => {
  const usersSig = useSignal<RandomUser[]>([]);

  useTask$(async () => {
    const users = await fetchRandomUsers();

    usersSig.value = users;
  });

  return (
    <div style={{ height: "1000px" }}>
      <Select>
        <SelectTrigger>Trigger</SelectTrigger>
        <SelectListbox
          style={{ padding: "0px", margin: "0px", listStyle: "none" }}
        >
          {usersSig.value.map((user) => (
            <SelectOption key={user.email}>{user.name.first}</SelectOption>
          ))}
        </SelectListbox>
      </Select>
    </div>
  );
});

async function fetchRandomUsers(): Promise<RandomUser[]> {
  try {
    const apiUrl = `https://randomuser.me/api/?results=15`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    const randomUsers: RandomUser[] = data.results;
    return randomUsers;
  } catch (error) {
    console.error("Error fetching random users:", error);
    throw error;
  }
}

interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  email: string;
}

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
