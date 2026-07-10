import { Link } from "react-router-dom";
import { Leaf, Store, Users, Globe, ArrowRight, ShieldCheck } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col items-start space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E5F5E9] px-4 py-2 text-sm font-medium text-[#1E773D]">
              <Leaf size={16} className="shrink-0" />
              Connecting extra food with those who need it
            </div>
            
            <h1 className="text-[3.5rem] font-extrabold leading-[1.1] text-dark-gray sm:text-6xl tracking-tight">
              Save extra food.<br />
              <span className="text-[#1E773D]">Feed more people.</span>
            </h1>
            
            <p className="max-w-lg text-[1.1rem] leading-relaxed text-text-secondary">
              MealBridge helps restaurants reduce food waste by connecting surplus meals with NGOs that serve communities. Together, we can build a better, more sustainable world.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
              <Link to="/register" className="flex items-center gap-4 rounded-[1.25rem] bg-[#1E773D] px-6 py-4 text-white transition-all hover:bg-[#166534] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#1E773D]/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <Store size={26} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-start pr-4">
                  <span className="text-[1.05rem] font-bold">I'm a Restaurant</span>
                  <span className="text-[0.85rem] font-medium text-white/90">Donate extra food</span>
                </div>
              </Link>
              
              <Link to="/register" className="flex items-center gap-4 rounded-[1.25rem] border border-[#D5D9D7] bg-white px-6 py-4 text-dark-gray transition-all hover:border-[#1E773D] hover:bg-[#F9FCFA] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#1E773D]/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <Users size={26} strokeWidth={1.5} className="text-[#1E773D]" />
                </div>
                <div className="flex flex-col items-start pr-4">
                  <span className="text-[1.05rem] font-bold">I'm an NGO</span>
                  <span className="text-[0.85rem] font-medium text-text-secondary">Receive and serve</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[0.95rem] text-[#64748B]">
              <ShieldCheck size={20} strokeWidth={1.5} />
              Trusted by restaurants. Powered by purpose.
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="relative mt-16 flex h-[480px] w-full items-center justify-center lg:mt-0 xl:justify-end xl:-right-10">
            {/* Card 1 */}
            <div className="absolute left-[5%] top-4 z-10 w-[280px] rounded-4xl bg-white p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-2 lg:left-[10%] border border-black/5">
              <div className="relative h-48 w-full overflow-hidden rounded-[1.25rem]">
                <img src="/src/assets/rice.png" alt="Delicious Rice Dish" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="absolute -bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary-50 shadow-md border-4 border-white">
                <Store size={22} className="text-[#1E773D]" strokeWidth={2} />
              </div>
              <div className="mt-8 pb-5 text-center">
                <h3 className="text-lg font-bold text-dark-gray">Restaurants Donate</h3>
                <p className="mt-1 text-sm text-[#64748B] leading-snug">List surplus food easily and<br />help fight hunger.</p>
              </div>
            </div>

            {/* Arrow Connector */}
            <div className="absolute left-[300px] top-1/2 z-20 hidden h-12 w-12 translate-y-[-60%] items-center justify-center rounded-full bg-white shadow-lg border border-black/5 md:flex xl:left-[350px]">
              <ArrowRight size={20} className="text-[#1E773D]" strokeWidth={2.5} />
            </div>

            {/* Card 2 */}
            <div className="absolute right-0 top-24 z-0 w-[280px] rounded-4xl bg-white p-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-2 border border-black/5">
              <div className="relative h-48 w-full overflow-hidden rounded-[1.25rem]">
                <img src="/src/assets/curry.png" alt="Rich Curry Dish" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="absolute -bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary-50 shadow-md border-4 border-white">
                <Users size={22} className="text-[#1E773D]" strokeWidth={2} />
              </div>
              <div className="mt-8 pb-5 text-center">
                <h3 className="text-lg font-bold text-dark-gray">NGOs Receive</h3>
                <p className="mt-1 text-sm text-[#64748B] leading-snug">Claim available food and<br />nourish communities.</p>
              </div>
            </div>
            
            {/* Subtle Leaf Decorative Background */}
            <div className="absolute -right-24 top-1/2 -z-10 -translate-y-1/2 opacity-20">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C12 21 21 16 21 9C21 5.5 18 3 14 3C12.5 3 11 3.5 10 4.5C9 3.5 7.5 3 6 3C2 3 3 5.5 3 9C3 16 12 21 12 21Z" fill="#1E773D" />
                <path d="M12 21V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Feature Bottom Section */}
        <div className="mt-32 rounded-3xl bg-[#F9FCFA] py-12 px-6 shadow-sm border border-[#E5F5E9]/50 sm:px-12">
          <div className="grid gap-10 md:grid-cols-3 md:divide-x md:divide-border/40">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:items-start text-center sm:text-left md:px-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E5F5E9] text-[#1E773D]">
                <Leaf size={28} strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-[1.05rem] font-bold text-dark-gray">Reduce Food Waste</h4>
                <p className="mt-2 text-[0.95rem] text-text-secondary leading-relaxed">Help restaurants put surplus<br className="hidden sm:block" />food to good use.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:items-start text-center sm:text-left md:px-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E5F5E9] text-[#1E773D]">
                <Users size={28} strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-[1.05rem] font-bold text-dark-gray">Support Communities</h4>
                <p className="mt-2 text-[0.95rem] text-text-secondary leading-relaxed">NGOs get the food they need<br className="hidden sm:block" />to serve more people.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:items-start text-center sm:text-left md:px-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E5F5E9] text-[#1E773D]">
                <Globe size={28} strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-[1.05rem] font-bold text-dark-gray">Build a Better World</h4>
                <p className="mt-2 text-[0.95rem] text-text-secondary leading-relaxed">Together, we create a more<br className="hidden sm:block" />sustainable future.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
