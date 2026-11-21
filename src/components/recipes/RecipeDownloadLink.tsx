import { Download, FileText } from "lucide-react";
import type { AgentRecipe } from "@/lib/recipes-data";
import { recipeSampleFilename, recipeSamplePath, type RecipeSampleFormat } from "@/lib/recipe-sample";

export function RecipeDownloadLink({ recipe, includeRecipeName = false, format = "json" }: {
  recipe: AgentRecipe;
  includeRecipeName?: boolean;
  format?: RecipeSampleFormat;
}) {
  const markdown = format === "markdown";
  const Icon = markdown ? FileText : Download;
  const label = markdown ? "Download Markdown review brief" : "Download sample JSON";
  return (
    <a href={recipeSamplePath(recipe.slug, format)} download={recipeSampleFilename(recipe, format)}
      aria-label={includeRecipeName ? `${label} for ${recipe.name}` : label}
      title={label}
      className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded border border-white/20 text-xs font-medium text-platinum transition hover:bg-white/10 ${includeRecipeName ? "w-11" : "px-3"}`}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {!includeRecipeName ? (markdown ? "Markdown" : "JSON") : null}
    </a>
  );
}
