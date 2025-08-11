import DsaStatsCard from "../../components/DsaStatsCard"; // use correct relative path

export async function generateStaticParams() {
  return []; // optional if you want pre-rendering
}

export async function generateMetadata({ params }) {
  return {
    title: `${params.userId}'s DSA Stats | CoderStat`,
  };
}

export default async function EmbedCard({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/public-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: params.userId }),
    cache: "force-cache", // or `no-store` for live always
  });

  const data = await res.json();

  return (
    <div className="w-[350px] border rounded-xl shadow p-4 bg-white">
      {data?.stats ? <DsaStatsCard stats={data.stats} /> : <p>Not Found</p>}
    </div>
  );
}
