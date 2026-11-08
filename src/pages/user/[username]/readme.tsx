import { useParams } from "revine";
import { ReadmeStudio } from "@/components/readme";

export default function UserReadmePage() {
  const { username } = useParams<{ username: string }>();

  return (
    <main className="min-h-screen">
      <ReadmeStudio
        initialUsername={username || "rachit-bharadwaj"}
        backHref={username ? `/user/${username}` : undefined}
      />
    </main>
  );
}

