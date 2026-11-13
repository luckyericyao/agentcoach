import { Bookmark, BriefcaseBusiness, Workflow } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const futureAreas = [
  { title: "Saved Agent Recipes", body: "A personal collection of expert workflows.", icon: Bookmark },
  { title: "Coach Studio", body: "A space to develop and evaluate your Agent Recipes.", icon: Workflow },
  { title: "Client Workspace", body: "Private workflows and review history for your team.", icon: BriefcaseBusiness },
];

export function AccountPanel({ email }: { email: string }) {
  return (
    <div>
      <section className="border-b border-white/10 pb-10">
        <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ion">Signed in</p>
            <h2 className="mt-3 break-all text-2xl font-semibold leading-tight text-platinum sm:text-3xl">{email}</h2>
            <p className="mt-4 text-base leading-7 text-steel">Account status: early access.</p>
          </div>
          <SignOutButton />
        </div>
      </section>
      <p className="mt-10 text-sm font-semibold text-steel">Coming later</p>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {futureAreas.map((area) => {
          const Icon = area.icon;
          return (
            <article key={area.title}>
              <Icon aria-hidden="true" className="size-5 text-ember" />
              <h3 className="mt-5 text-lg font-semibold text-platinum">{area.title}</h3>
              <p className="mt-3 text-sm leading-6 text-steel">{area.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
