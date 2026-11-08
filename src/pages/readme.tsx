import { useLocation } from "revine";
import { ReadmeStudio } from "@/components/readme";

export default function ReadmePage() {
  const location = useLocation();

  let queryUser = "rachit-bharadwaj";
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(location.search);
    const u = params.get("user") || params.get("username") || params.get("q");
    if (u) queryUser = u;
  }

  return (
    <main className="min-h-screen">
      <ReadmeStudio initialUsername={queryUser} />
    </main>
  );
}

