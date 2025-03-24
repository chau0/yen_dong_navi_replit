import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type VoteType = "yes" | "neutral" | "no";

export function CommunityPoll() {
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const queryClient = useQueryClient();

  // Fetch poll summary
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/poll/summary"],
  });

  // Submit poll vote
  const voteMutation = useMutation({
    mutationFn: async (vote: VoteType) => {
      const res = await apiRequest("POST", "/api/poll", { vote });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/poll/summary"] });
      toast({
        title: "Vote submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to submit vote",
        description: "Please try again",
      });
    }
  });

  const handleVote = (vote: VoteType) => {
    if (userVote) return; // Prevent voting twice
    
    setUserVote(vote);
    voteMutation.mutate(vote);
  };

  if (error) {
    return (
      <Card className="bg-white rounded-lg shadow-md p-6 border border-red-200">
        <CardContent className="p-0">
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2" />
            <span>Error loading poll data. Please try again.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <CardContent className="p-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Community Sentiment</h2>
          
          <p className="text-sm text-gray-600 mb-4">Do you think now is a good time to exchange JPY to VND?</p>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Button
              variant="outline"
              className={`flex flex-col items-center justify-center p-3 rounded-lg 
                ${userVote === "yes" ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                transition-colors h-auto`}
              onClick={() => handleVote("yes")}
              disabled={!!userVote || voteMutation.isPending}
            >
              <ThumbsUp className={`mb-1 ${userVote === "yes" ? "text-green-500" : "text-gray-500"}`} size={16} />
              <span className={`text-xs font-medium ${userVote === "yes" ? "text-green-500" : "text-gray-500"}`}>Yes</span>
            </Button>
            
            <Button
              variant="outline"
              className={`flex flex-col items-center justify-center p-3 rounded-lg 
                ${userVote === "neutral" ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                transition-colors h-auto`}
              onClick={() => handleVote("neutral")}
              disabled={!!userVote || voteMutation.isPending}
            >
              <Minus className="mb-1 text-gray-500" size={16} />
              <span className="text-xs font-medium text-gray-500">Neutral</span>
            </Button>
            
            <Button
              variant="outline"
              className={`flex flex-col items-center justify-center p-3 rounded-lg 
                ${userVote === "no" ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                transition-colors h-auto`}
              onClick={() => handleVote("no")}
              disabled={!!userVote || voteMutation.isPending}
            >
              <ThumbsDown className={`mb-1 ${userVote === "no" ? "text-red-500" : "text-gray-500"}`} size={16} />
              <span className={`text-xs font-medium ${userVote === "no" ? "text-red-500" : "text-gray-500"}`}>No</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300" style={{ width: `${30 + Math.random() * 40}%` }}></div>
                  </div>
                </div>
              ))
            ) : data ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Yes ({data.yes.percentage}%)</span>
                    <span className="text-gray-500">{data.yes.count.toLocaleString()} votes</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${data.yes.percentage}%` }}
                      transition={{ duration: 1, delay: 0.1 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Neutral ({data.neutral.percentage}%)</span>
                    <span className="text-gray-500">{data.neutral.count.toLocaleString()} votes</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gray-400" 
                      initial={{ width: 0 }}
                      animate={{ width: `${data.neutral.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">No ({data.no.percentage}%)</span>
                    <span className="text-gray-500">{data.no.count.toLocaleString()} votes</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${data.no.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    ></motion.div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
