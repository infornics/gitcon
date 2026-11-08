import { useParams } from "revine";
import { ReadmeStudio } from "@/components/readme";

export default function UserReadmePage() {
  const { username } = useParams<{ username: string }>();

  return (
    <main className="h-full flex flex-col min-h-0 overflow-hidden !pb-0">
      <ReadmeStudio
        initialUsername={username || "rachit-bharadwaj"}
        backHref={username ? `/user/${username}` : undefined}
      />
    </main>
  );
}

