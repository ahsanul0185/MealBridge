import { Link } from "react-router-dom";
import { Leaf, Store, Users, Globe, ShieldCheck } from "lucide-react";
import { GoArrowRight } from "react-icons/go";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E5F5E9] px-4 py-2 text-sm font-medium text-[#1E773D]">
              <Leaf size={16} className="shrink-0" />
              Connecting extra food with those who need it
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] text-dark-gray tracking-tight">
              Save extra food.<br />
              <span className="text-[#1E773D]">Feed more people.</span>
            </h1>
            
            <p className="max-w-lg text-base sm:text-[1.1rem] leading-relaxed text-text-secondary">
              MealBridge helps restaurants reduce food waste by connecting surplus meals with NGOs that serve communities. Together, we can build a better, more sustainable world.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto items-center">
              <Link to="/register?role=restaurant" className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-4 rounded-2xl bg-[#1E773D] px-6 py-3 text-white transition-all hover:bg-[#166534] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#1E773D]/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <Store size={26} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-start pr-4">
                  <span className="text-[1.05rem] font-semibold">I'm a Restaurant</span>
                  <span className="text-[0.85rem] text-white/90">Donate extra food</span>
                </div>
              </Link>
              
              <Link to="/register?role=ngo" className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-4 rounded-2xl border border-[#D5D9D7] bg-white px-6 py-3 text-dark-gray transition-all hover:border-[#1E773D] hover:bg-[#F9FCFA] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#1E773D]/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <Users size={26} strokeWidth={1.5} className="text-[#1E773D]" />
                </div>
                <div className="flex flex-col items-start pr-4">
                  <span className="text-[1.05rem] font-semibold">I'm an NGO</span>
                  <span className="text-[0.85rem] text-text-secondary">Receive and serve</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[0.95rem] text-[#64748B]">
              <ShieldCheck size={20} strokeWidth={1.5} />
              Trusted by restaurants. Powered by purpose.
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="relative mt-10 sm:mt-16 flex flex-col sm:flex-row gap-6 h-auto sm:h-120 w-full items-center justify-center lg:mt-0 xl:justify-end xl:-right-10">
            {/* Card 1 */}
            <div className="relative w-full max-w-[260px] sm:w-65 rounded-2xl shadow-lg">
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                <img src="/src/assets/rice.png" alt="Delicious Rice Dish" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>

              <div className="relative bg-white p-4 pt-12 rounded-2xl -mt-5">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-green-50 shadow-md">
                <Store size={26} className="text-[#1E773D]" />
              </div>

              <div className="pb-5 text-center">
                <h3 className="text-lg font-bold text-dark-gray">Restaurants Donate</h3>
                <p className="mt-1 text-sm text-[#64748B] leading-snug">List surplus food easily and<br />help fight hunger.</p>
              </div>
              </div>
            </div>

            {/* Arrow Connector */}
            <div className="absolute left-12 top-54 z-20 hidden h-12 w-12 translate-y-[-60%] items-center justify-center rounded-full bg-white shadow-lg border border-black/5 md:flex xl:left-72">
              <GoArrowRight size={25} className="text-[#1E773D]"/>
            </div>

            {/* Card 2 */}
            <div className="relative w-full max-w-[260px] sm:w-65 rounded-2xl shadow-lg sm:top-7">
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                <img src="/src/assets/curry.png" alt="Rich Curry Dish" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>

              <div className="relative bg-white p-4 pt-12 rounded-2xl -mt-5">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-green-50 shadow-md">
                  <Users size={26} className="text-[#1E773D]"/>
                </div>

                <div className="pb-5 text-center">
                  <h3 className="text-lg font-bold text-dark-gray">NGOs Receive</h3>
                  <p className="mt-1 text-sm text-[#64748B] leading-snug">Claim available food and<br />nourish communities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Bottom Section */}
        <div className="mt-16 sm:mt-24 lg:mt-32 rounded-3xl bg-[#F9FCFA] py-10 sm:py-12 px-6 shadow-sm border border-[#E5F5E9]/50 sm:px-12">
          <div className="grid gap-8 md:gap-10 md:grid-cols-3 md:divide-x md:divide-border/40">
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
