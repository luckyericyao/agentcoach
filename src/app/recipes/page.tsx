import type { Metadata } from "next";
import { connection } from "next/server";
import { RecipeCatalog } from "@/components/recipes/RecipeCatalog";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { TopNavigation } from "@/components/landing/TopNavigation";
import { industries } from "@/lib/industries-data";
import { agentRecipes, getRecipeBySlug } from "@/lib/recipes-data";
import { recipePreviewPath } from "@/lib/recipe-sample";
import { recipeShareImagePath, recipeShareImageSize } from "@/lib/recipe-share-image";

const catalogMetadata = {
  title: "Agent Recipes | AgentCoach",
  description:
    "Browse reusable expert workflows that combine instruction, workflow, evaluation, risk boundaries, and deployment logic.",
  alternates: { canonical: "/recipes" },
};

export async function generateMetadata({ searchParams }: PageProps<"/recipes">): Promise<Metadata> {
  const { recipe: slug } = await searchParams;
  const recipe = typeof slug === "string" ? getRecipeBySlug(slug) : undefined;
  const title = recipe ? `${recipe.name} | AgentCoach` : catalogMetadata.title;
  const description = recipe ? `Illustrative sample, not a live agent. ${recipe.shortDescription}` : catalogMetadata.description;
  const image = recipe ? {
    url: recipeShareImagePath(recipe.slug),
    alt: `${recipe.name}: illustrative AgentCoach recipe sample`,
    ...recipeShareImageSize,
  } : undefined;

  return {
    ...catalogMetadata,
    openGraph: {
      type: "website",
      siteName: "AgentCoach",
      title,
      description,
      url: recipe ? recipePreviewPath(recipe.slug) : "/recipes",
      images: image ? [image] : undefined,
    },
    twitter: image ? { card: "summary_large_image", title, description, images: [image] } : undefined,
  };
}

export default async function RecipesPage() {
  await connection();
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-carbon text-platinum">
      <TopNavigation />

      <section className="relative border-b border-white/10 px-5 pb-8 pt-24 sm:px-8 lg:pb-14 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(127,212,255,0.11),transparent_34rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase text-ion">Agent Recipes</p>
          <h1 className="mt-5 max-w-5xl text-balance text-4xl font-semibold leading-tight text-platinum sm:text-6xl sm:leading-none">
            Find a reusable workflow.
          </h1>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-steel sm:text-lg sm:leading-8">
            Compare sample inputs, outputs, and review boundaries.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 pt-8 sm:px-8 lg:pb-28 lg:pt-14">
        <div className="mx-auto max-w-7xl">
          <RecipeCatalog recipes={agentRecipes} industries={industries} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
