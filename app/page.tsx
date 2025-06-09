// my-recipe-planner-v2/app/page.tsx
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth(); // Get the current user's ID

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24"
      style={{
        backgroundImage: 'url("/images/food-background.jpg")', // Path to your background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Content container - z-10 ensures it's above the overlay */}
      <div className="relative z-10 text-center text-white bg-white/10 p-8 rounded-lg shadow-xl backdrop-blur-sm max-w-lg mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
          Your Smart Recipe & Meal Planner
        </h1>
        <p className="text-lg sm:text-xl mb-10 opacity-90">
          Simplify your cooking, reduce food waste, and plan delicious meals effortlessly.
        </p>

        {userId ? (
          // User is signed in
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl font-semibold">Welcome back!</p>
            <UserButton afterSignOutUrl="/" /> {/* Clerk user management component */}
            <Link
              href="/dashboard" // You'll create this route later
              className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Go to Your Dashboard
            </Link>
          </div>
        ) : (
          // User is signed out
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </main>
  );
}