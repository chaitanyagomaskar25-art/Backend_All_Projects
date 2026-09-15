export function Header({ totalTodos = 0, completedTodos = 0 }) {
  return (
    <header className="bg-stone-100 border-b border-stone-200">
      <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif tracking-tight text-stone-900 font-medium">
            Daily Focus
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Simplify your daily routine</p>
        </div>
        
        {totalTodos > 0 && (
          <div className="text-xs font-mono tracking-wider uppercase px-3 py-1 bg-stone-200/70 text-stone-700 rounded">
            {completedTodos}/{totalTodos} Completed
          </div>
        )}
      </div>
    </header>
  );
}