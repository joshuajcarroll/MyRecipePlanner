// my-recipe-planner-v2/app/api/recipes/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  // Get the userId from the authenticated session
  const { userId } = await auth();

  // If no userId, return unauthorized
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      category,
      cuisine,
      difficulty,
      imageUrl,
      // userId is now coming from Clerk's auth() on the server, not the client body
      // No need to destructure userId from body anymore
    } = body;

    // Create the recipe, including the userId from Clerk's auth
    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        description,
        instructions,
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        category,
        cuisine,
        difficulty,
        imageUrl,
        userId: userId, // Assign the authenticated user's ID
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("[RECIPES_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found in internal DB", { status: 404 });
    }

    // Fetch all recipes authored by this user
    const recipes = await prisma.recipe.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc", // Order by most recent first
      },
      // You can also include related data if needed, e.g.:
      // include: {
      //   recipeIngredients: {
      //     include: {
      //       ingredient: true
      //     }
      //   }
      // }
    });

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("[RECIPES_GET_ALL]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}