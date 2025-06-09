// my-recipe-planner-v2/app/(dashboard)/page.tsx (or app/dashboard-test-page.tsx if you are still using that name)
"use client"; // This is a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { UserButton, useUser } from "@clerk/nextjs"; // Keep useUser
import { Recipe } from "@prisma/client"; // Import Prisma model type
import Image from "next/image"; // Import Image component
//import { toast } from "react-hot-toast"; // For toast notifications

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser(); // Get isLoaded too
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // --- DEBUGGING CONSOLE LOGS ---
  console.log("Dashboard Page - isLoaded:", isLoaded, "isSignedIn:", isSignedIn, "User:", user);

  useEffect(() => {
    // Only redirect if Clerk has finished loading AND the user is not signed in
    if (isLoaded && !isSignedIn) {
      console.log("Redirecting to homepage because not signed in or isLoaded is false");
      router.push("/");
      return;
    }

    // Only fetch recipes if Clerk is loaded and user is signed in
    if (isLoaded && isSignedIn) {
      const fetchRecipes = async () => {
        try {
          const response = await fetch("/api/recipes"); // Call your new GET API route
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          const data: Recipe[] = await response.json();
          setRecipes(data);
        } catch (err: unknown) {
          console.error("Failed to fetch recipes:", err);
          if (err instanceof Error) {
            setError(err.message || "Failed to load recipes.");
          } else {
            setError("Failed to load recipes.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchRecipes();
    }
  }, [isSignedIn, isLoaded, router]); // Add isLoaded to dependency array

  // Render nothing or a loading spinner if Clerk isn't loaded yet
  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-100 p-8 text-center">Loading authentication state...</div>;
  }

  // If Clerk is loaded but user is NOT signed in, this return path should be hit before useEffect's redirect
  if (!isSignedIn) {
    return null; // Or a simple message like "You are not signed in. Redirecting..."
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Recipes</h1>
        <div className="flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
          <button
            onClick={() => router.push("/new")} // Navigates to the new recipe creation page
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Add New Recipe
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-600">Loading recipes...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && recipes.length === 0 && (
        <p className="text-center text-gray-600">You haven&#39;t created any recipes yet. Click &quot;Add New Recipe&quot; to get started!</p>
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
              {/* Image container to define dimensions for 'fill' */}
              <div className="w-full h-48">
                <Image
                  src={recipe.imageUrl || "/images/food-background.jpg"}
                  alt={recipe.title}
                  fill // Image will fill its parent container
                  className="object-cover" // Ensures the image covers the area, cropping if necessary
                  priority={true} // For LCP images, consider this for first few items
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description || "No description provided."}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Prep: {recipe.prepTimeMinutes || '-'}min</span>
                  <span>Cook: {recipe.cookTimeMinutes || '-'}min</span>
                  <span>Servings: {recipe.servings || '-'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}