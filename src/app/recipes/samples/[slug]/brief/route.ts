import { createRecipeMarkdown } from "@/lib/recipe-markdown";
import { recipeSampleFilename } from "@/lib/recipe-sample";
import { agentRecipes, getRecipeBySlug } from "@/lib/recipes-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return agentRecipes.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const recipe = getRecipeBySlug((await params).slug);
  if (!recipe) return new Response(null, { status: 404 });

  return new Response(createRecipeMarkdown(recipe), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${recipeSampleFilename(recipe, "markdown")}"`,
      "X-Robots-Tag": "noindex",
    },
  });
}
