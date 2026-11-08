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
    <main className="h-full flex flex-col min-h-0 overflow-hidden !pb-0">
      <ReadmeStudio initialUsername={queryUser} />
    </main>
  );
}

