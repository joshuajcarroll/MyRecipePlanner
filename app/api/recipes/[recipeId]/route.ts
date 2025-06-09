// my-recipe-planner-v2/app/api/recipes/[recipeId]/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { recipeId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { recipeId } = params;

    if (!recipeId) {
      return new NextResponse("Recipe ID is required", { status: 400 });
    }

    // Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found in internal DB", { status: 404 });
    }

    // Fetch the specific recipe, ensuring it belongs to the authenticated user
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
        authorId: user.id, // Crucial: ensure user owns the recipe
      },
      // You can include related data if needed
      // include: {
      //   recipeIngredients: {
      //     include: {
      //       ingredient: true
      //     }
      //   }
      // }
    });

    if (!recipe) {
      return new NextResponse("Recipe not found or you don't have access", { status: 404 });
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("[RECIPE_GET_BY_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}