import { Download } from "lucide-react";
import type { AgentRecipe } from "@/lib/recipes-data";
import { recipeSampleFilename, recipeSamplePath } from "@/lib/recipe-sample";

export function RecipeDownloadLink({ recipe, includeRecipeName = false }: {
  recipe: AgentRecipe;
  includeRecipeName?: boolean;
}) {
  return (
    <a href={recipeSamplePath(recipe.slug)} download={recipeSampleFilename(recipe)}
      aria-label={includeRecipeName ? `Download sample JSON for ${recipe.name}` : "Download sample JSON"}
      title="Download sample JSON"
      className="grid size-11 shrink-0 place-items-center rounded border border-white/20 text-platinum transition hover:bg-white/10">
      <Download aria-hidden="true" className="size-4" />
    </a>
  );
}
