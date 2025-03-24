import { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, TooltipProps
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

type TimeRange = "1W" | "1M" | "3M";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/90 p-2 rounded-md shadow-md text-white">
        <p className="font-medium">{format(new Date(label), "MMM d, yyyy")}</p>
        <p className="font-mono">1 JPY = {payload[0].value?.toFixed(2)} VND</p>
      </div>
    );
  }

  return null;
};

export function HistoricalChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1W");
  
  // Calculate days based on time range
  const getDays = () => {
    switch (timeRange) {
      case "1W": return 7;
      case "1M": return 30;
      case "3M": return 90;
      default: return 30;
    }
  };

  // Fetch historical data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/rate/history", { days: getDays() }],
  });

  if (error) {
    return (
      <Card className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-red-200">
        <CardContent className="p-0">
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2" />
            <span>Error loading historical data. Please try again.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats if data is available
  const getStats = () => {
    if (!data || data.length === 0) return { highest: 0, lowest: 0, average: 0 };
    
    const rates = data.map((item: any) => item.rate);
    const highest = Math.max(...rates);
    const lowest = Math.min(...rates);
    const average = rates.reduce((sum: number, rate: number) => sum + rate, 0) / rates.length;
    
    return { highest, lowest, average };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Historical Exchange Rate</h2>
            <div className="flex space-x-2">
              <Button 
                variant={timeRange === "1W" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1W")}
                className="rounded-full text-xs"
              >
                1W
              </Button>
              <Button 
                variant={timeRange === "1M" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1M")}
                className="rounded-full text-xs"
              >
                1M
              </Button>
              <Button 
                variant={timeRange === "3M" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("3M")}
                className="rounded-full text-xs"
              >
                3M
              </Button>
            </div>
          </div>
          
          <div className="h-72 relative">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading chart data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(date) => format(new Date(date), "MMM d")}
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                    dot={{ r: 4, strokeWidth: 2, stroke: "#ffffff", fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-1">Highest ({timeRange})</p>
              <p className="font-mono font-medium">
                {isLoading ? "Loading..." : `${stats.highest.toFixed(2)} VND`}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-1">Lowest ({timeRange})</p>
              <p className="font-mono font-medium">
                {isLoading ? "Loading..." : `${stats.lowest.toFixed(2)} VND`}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-1">Average ({timeRange})</p>
              <p className="font-mono font-medium">
                {isLoading ? "Loading..." : `${stats.average.toFixed(2)} VND`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
