// my-recipe-planner-v2/app/(recipe)/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast"; // You'll need to install react-hot-toast

export default function AddRecipePage() {
  const {  } = useUser(); // Get the user object for potential pre-filling or checks
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | undefined>(undefined);
  const [cookTimeMinutes, setCookTimeMinutes] = useState<number | undefined>(undefined);
  const [servings, setServings] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation (you can expand this)
    if (!title || !instructions) {
      toast.error("Title and Instructions are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          instructions,
          prepTimeMinutes: prepTimeMinutes !== undefined ? Number(prepTimeMinutes) : undefined,
          cookTimeMinutes: cookTimeMinutes !== undefined ? Number(cookTimeMinutes) : undefined,
          servings: servings !== undefined ? Number(servings) : undefined,
          category,
          cuisine,
          difficulty,
          imageUrl: imageUrl || undefined, // Send as undefined if empty string
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add recipe.");
      }

      toast.success("Recipe added successfully!");
      router.push("/dashboard"); // Redirect back to the dashboard to see the new recipe
    } catch (error) {
      console.error("Error adding recipe:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Recipe</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="instructions" className="block text-gray-700 text-sm font-bold mb-2">
            Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            id="instructions"
            rows={6}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="prepTimeMinutes" className="block text-gray-700 text-sm font-bold mb-2">
              Prep Time (min)
            </label>
            <input
              type="number"
              id="prepTimeMinutes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={prepTimeMinutes === undefined ? '' : prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label htmlFor="cookTimeMinutes" className="block text-gray-700 text-sm font-bold mb-2">
              Cook Time (min)
            </label>
            <input
              type="number"
              id="cookTimeMinutes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={cookTimeMinutes === undefined ? '' : cookTimeMinutes}
              onChange={(e) => setCookTimeMinutes(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label htmlFor="servings" className="block text-gray-700 text-sm font-bold mb-2">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={servings === undefined ? '' : servings}
              onChange={(e) => setServings(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="cuisine" className="block text-gray-700 text-sm font-bold mb-2">
              Cuisine
            </label>
            <input
              type="text"
              id="cuisine"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-gray-700 text-sm font-bold mb-2">
              Difficulty
            </label>
            <input
              type="text"
              id="difficulty"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">
            Image URL (optional)
          </label>
          <input
            type="url" // Use type="url" for URL input
            id="imageUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g., https://via.placeholder.com/600x400"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding Recipe..." : "Add Recipe"}
          </button>
          <button
            type="button"
            onClick={() => router.back()} // Go back to previous page
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}