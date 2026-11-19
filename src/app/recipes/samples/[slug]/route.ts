import { agentRecipes, getRecipeBySlug } from "@/lib/recipes-data";
import { createRecipeSample, recipeSampleFilename } from "@/lib/recipe-sample";

export const dynamicParams = false;

export function generateStaticParams() {
  return agentRecipes.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const recipe = getRecipeBySlug((await params).slug);
  if (!recipe) return new Response(null, { status: 404 });

  return new Response(JSON.stringify(createRecipeSample(recipe), null, 2) + "\n", {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${recipeSampleFilename(recipe)}"`,
      "X-Robots-Tag": "noindex",
    },
  });
}
