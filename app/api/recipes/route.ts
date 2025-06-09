// my-recipe-planner-v2/app/api/recipes/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Parse the request body
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
    } = body;

    // --- Basic Validation ---
    if (!title || !instructions) {
      return new NextResponse("Title and Instructions are required", {
        status: 400,
      });
    }

    // 3. Find or Create the user in our database using their clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.log(`Clerk user ${userId} not found in internal DB. Creating new user record.`);
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@clerk-temp.com`, // Placeholder email for now
        },
      });
    }

    // 4. Create the recipe in the database
    const recipe = await prisma.recipe.create({
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
        authorId: user.id, // Link to our internal User ID
      },
    });

    // 5. Return the created recipe
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("[RECIPES_POST]", error);
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
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found in internal DB", { status: 404 });
    }

    // Fetch all recipes authored by this user
    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: user.id,
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