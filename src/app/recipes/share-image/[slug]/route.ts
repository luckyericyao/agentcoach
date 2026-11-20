import { createElement } from "react";
import { ImageResponse } from "next/og";
import { recipeShareImageSize } from "@/lib/recipe-share-image";
import { agentRecipes, getRecipeBySlug } from "@/lib/recipes-data";
import { RecipeShareCard } from "./card";

export const dynamicParams = false;

export function generateStaticParams() {
  return agentRecipes.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const recipe = getRecipeBySlug((await params).slug);
  if (!recipe) return new Response(null, { status: 404 });

  return new ImageResponse(createElement(RecipeShareCard, { recipe }), {
    ...recipeShareImageSize,
    headers: { "Cache-Control": "public, max-age=3600", "X-Robots-Tag": "noindex" },
  });
}
