"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory`,
        {
          method: "POST",

          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        }
      );

      if (response.status !== 200) {
        console.log("error", response);
        throw Error;
      }

      const data = await response.json();
    } catch (e) {}
  }
  async function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/search`,
        {
          method: "POST",

          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filters: { name: formData.get("name") } }),
        }
      );

      if (response.status !== 200) {
        console.log("error", response);
        throw Error;
      }

      const data = await response.json();
      console.log(data);
      setItems(data.items);
    } catch (e) {}
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-12 gap-4 mx-8">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 border p-4 w-full"
      >
        <span className="flex flex-col gap-2">
          <label className="text-sm">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            className="rounded p-1 border"
          ></input>
          <span className="flex flex-col">
            <label className="text-sm">Price</label>
            <input type="text" name="price" className="rounded p-1 border" />
          </span>
          <label className="text-sm">Category</label>
          <input type="text" name="category" className="rounded p-1 border" />
        </span>
        <div className="ml-auto flex text-sm self-end py-2 col-span-2">
          <button type="reset" className="px-2 rounded py-1">
            Clear
          </button>
          <button className="px-3 rounded-full h-fit bg-blue-500 py-2 text-white">
            Submit
          </button>
        </div>
      </form>
      <form
        onSubmit={onSearch}
        className="flex gap-4 border p-4 w-full text-sm"
      >
        <input
          className="rounded p-1 border w-full"
          placeholder="Search items..."
          type="text"
          name="name"
        ></input>

        <button className="px-3 rounded-full h-fit bg-blue-500 py-2 text-white">
          Search
        </button>
      </form>
      <div className="border p-4 w-full">
        {items.map((item, index) => (
          <div key={index}>
            <div></div>
          </div>
        ))}
      </div>
    </main>
  );
}
