import { querySuggestedTitles } from "@/services/query";
import Poster from "@/components/Poster";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;
  const suggestedTitles = await querySuggestedTitles(query);

  const handleSearch = async (formData: FormData) => {
    "use server";

    const query = formData.get("query");
    redirect(query ? `/?q=${query}` : `/`);
  };

  return (
    <main id="root" className=" mx-auto max-w-screen-lg p-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Besok Nonton Apa?</h1>
        <p className="text-white">Cari film yang mau kamu tonton besok</p>
      </div>
      <form action={handleSearch}>
        <input
          type="text"
          name="query"
          className="w-full rounded-lg p-2"
          defaultValue={query}
        />
      </form>
      <h1>Search Result for: {query}</h1>
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        }}
      >
        {suggestedTitles.data.data.popularTitles.edges.map((item) => (
          <Poster
            key={item.node.id}
            title={item.node.content.originalTitle}
            synopsis={item.node.content.shortDescription}
            runtime={item.node.content.runtime}
            genres={item.node.content.genres.map((genre) => genre.translation)}
            credits={item.node.content.credits.map((credit) => credit.name)}
            originalReleaseYear={item.node.content.originalReleaseYear}
            imdbScore={item.node.content.scoring.imdbScore}
            imdbVotes={item.node.content.scoring.imdbVotes}
            poster={
              item.node.content.fullPosterUrl
                ? `https://images.justwatch.com${item.node.content.fullPosterUrl}`
                : ""
            }
            backdrop={
              item.node.content.fullBackdrops?.[0]?.backdropUrl
                ? `https://images.justwatch.com${item.node.content.fullBackdrops?.[0]?.backdropUrl}`
                : undefined
            }
            watchNowOffer={item.node.watchNowOffer}
            offers={item.node.offers}
          />
        ))}
      </div>
    </main>
  );
}
