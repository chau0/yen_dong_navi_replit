import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { ExchangeRateCard } from "@/components/exchange-rate-card";
import { HistoricalChart } from "@/components/historical-chart";
import { AIForecast } from "@/components/ai-forecast";
import { CommunityPoll } from "@/components/community-poll";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">JPY to VND Exchange Rate Advisor</h1>
          <p className="text-gray-600">Make smarter decisions with real-time exchange rate data and AI-powered suggestions</p>
        </motion.div>
        
        {/* Exchange Rate Card */}
        <ExchangeRateCard />
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Historical Chart (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <HistoricalChart />
          </div>
          
          {/* Side Panel (1/3 width on large screens) */}
          <div className="lg:col-span-1 space-y-6">
            <AIForecast />
            <CommunityPoll />
          </div>
        </div>
      </main>
    </div>
  );
}
