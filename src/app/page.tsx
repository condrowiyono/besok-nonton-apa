// import Poster from "@/component/Poster";
import { querySuggestedTitles } from "@/services/query";
import Poster from "@/components/Poster";

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  // get query string from app router next js
  const query = searchParams.q;

  const suggestedTitles = await querySuggestedTitles(query);

  return (
    <main className="mx-auto max-w-screen-lg p-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Besok Nonton Apa?</h1>
        <p className="text-white">Cari film yang mau kamu tonton besok</p>
      </div>
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
            title={item.node.content.title}
            synopsis={item.node.content.shortDescription}
            runtime={item.node.content.runtime}
            genres={item.node.content.genres.map((genre) => genre.shortName)}
            credits={item.node.content.credits.map((credit) => credit.name)}
            originalReleaseYear={item.node.content.originalReleaseYear}
            imdbScore={item.node.content.scoring.imdbScore}
            imdbVotes={item.node.content.scoring.imdbVotes}
            poster={`https://images.justwatch.com${item.node.content.fullPosterUrl}`}
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
