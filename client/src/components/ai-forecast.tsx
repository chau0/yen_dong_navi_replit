import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Area
} from "recharts";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, TrendingUp } from "lucide-react";

export function AIForecast() {
  // Fetch forecast data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/forecast"],
  });

  // Fetch current rate for comparison
  const { data: currentRateData } = useQuery({
    queryKey: ["/api/rate/current"],
  });

  if (error) {
    return (
      <Card className="bg-white rounded-lg shadow-md p-6 border border-red-200">
        <CardContent className="p-0">
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2" />
            <span>Error loading forecast data. Please try again.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend percentage if data is available
  const calculateTrend = () => {
    if (!data || data.length < 2 || !currentRateData?.rate) return null;
    
    const lastForecastRate = data[data.length - 1].rate;
    const percentChange = ((lastForecastRate - currentRateData.rate) / currentRateData.rate) * 100;
    
    return percentChange.toFixed(1);
  };

  const trendPercentage = calculateTrend();

  // Create custom formatted data for the chart
  const chartData = !isLoading && data ? [
    // Add the current rate as the starting point
    { date: format(new Date(), "yyyy-MM-dd"), rate: currentRateData?.rate || 0, isToday: true },
    // Add the forecast data
    ...data.map((item: any) => ({
      ...item,
      isToday: false,
      // Add the confidence values as separate properties for the area
      lowerBound: item.confidence[0],
      upperBound: item.confidence[1]
    }))
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">AI Forecast</h2>
            <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-600 rounded-full">7 Days</span>
          </div>
          
          <div className="h-48 relative">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading forecast data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
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
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  {/* Confidence band area */}
                  <Area 
                    type="monotone" 
                    dataKey="upperBound" 
                    stroke="none" 
                    fill="url(#purpleGradient)" 
                    fillOpacity={1} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lowerBound" 
                    stroke="none" 
                    fill="#fff" 
                    fillOpacity={1}
                  />
                  
                  {/* Forecast line */}
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, stroke: "#ffffff", fill: "#8B5CF6" }}
                    activeDot={{ r: 6 }}
                    strokeDasharray="4 4"
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
            <div>Today</div>
            <div>{!isLoading && data && data.length > 2 ? format(new Date(data[2].date), "MMM d") : ""}</div>
            <div>{!isLoading && data && data.length > 4 ? format(new Date(data[4].date), "MMM d") : ""}</div>
            <div>{!isLoading && data && data.length > 0 ? format(new Date(data[data.length - 1].date), "MMM d") : ""}</div>
          </div>
          
          <motion.div 
            className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex items-start">
              <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Upward Trend Expected
                </p>
                <p className="text-xs text-gray-600">
                  {isLoading ? "Analyzing forecast data..." : `Our AI predicts a ${trendPercentage}% increase over the next week, making this a favorable time to exchange JPY to VND.`}
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
