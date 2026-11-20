import { recipeSummaryModules, type AgentRecipe } from "@/lib/recipes-data";

export function RecipeShareCard({ recipe }: { recipe: AgentRecipe }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "56px 64px",
      backgroundColor: "#101418", color: "#F1F4F3",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 23 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontWeight: 700 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, border: "1px solid #4A5961", borderRadius: 5, backgroundColor: "#222B30",
          }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: "#9CE2DB" }} />
          </div>
          AgentCoach
        </div>
        <div style={{ color: "#9CE2DB", fontSize: 17 }}>AGENT RECIPE / SAMPLE</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 52 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 680 }}>
          <div style={{ color: "#9CE2DB", fontSize: 24, marginBottom: 20 }}>{recipe.domain}</div>
          <div style={{ fontSize: 64, lineHeight: 1.09, fontWeight: 700 }}>{recipe.name}</div>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", width: 330, borderLeft: "1px solid #3B454B", paddingLeft: 40,
        }}>
          <div style={{ color: "#B6C2C5", fontSize: 17, marginBottom: 18 }}>RECIPE STRUCTURE</div>
          {recipeSummaryModules.map((module, index) => (
            <div key={module} style={{
              display: "flex", alignItems: "center", gap: 18, height: 51,
              borderTop: "1px solid #3B454B", fontSize: 22,
            }}>
              <div style={{ color: "#9CE2DB", fontSize: 16 }}>{String(index + 1).padStart(2, "0")}</div>
              {module}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 22,
        borderTop: "1px solid #3B454B", color: "#B6C2C5", fontSize: 18,
      }}>
        <div>Illustrative sample / Not a live agent</div>
        <div style={{ color: "#E2C18A" }}>Human review required</div>
      </div>
    </div>
  );
}
