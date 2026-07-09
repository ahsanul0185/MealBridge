import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-warm-white text-dark-gray">
        {/* User will add routes and layout here */}
        <main className="p-4">
          <h1 className="text-2xl font-bold text-primary">MealBridge</h1>
          <p>Frontend scaffold ready. Add your routes and components!</p>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
