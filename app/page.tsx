"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    console.log("items", items);
    if (selectedCategory == "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        // @ts-ignore
        items.filter((item) => item.category == selectedCategory)
      );
    }
  }, [selectedCategory, items]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category`,
          {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 200) {
          console.log("error", response);
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.unique_categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
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
          body: JSON.stringify({
            filters: {
              name: formData.get("name"),
              ...(selectedCategory !== "All"
                ? { category: selectedCategory }
                : {}),
            },
          }),
        }
      );

      if (response.status !== 200) {
        console.log("error", response);
        throw Error;
      }

      const data = await response.json();
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
        <select
          className="py-2"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
        >
          {categories.map((category: string, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
          11
          <option value="All">All</option>
        </select>
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 py-2 border-y justify-between"
          >
            {/* @ts-ignore */}
            <div>{item.item_name}</div>
            {/* @ts-ignore */}
            <div>{item.category}</div>
            {/* @ts-ignore */}
            <div>{item.price}</div>
            {/* @ts-ignore */}
            <div>{item.last_updated_at}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
