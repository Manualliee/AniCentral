export default function ErrorMessage({ message }) {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
      <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-red-500 mb-2">An Error Occurred</h2>
        <p className="text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </div>
  );
}