export default function SkeletonCard() {
  return (
    <div className="w-[250px] bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-700 animate-pulse">
      <div className="w-full aspect-[2/3] bg-slate-700"></div>
    </div>
  );
}