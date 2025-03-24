import { motion } from "framer-motion";
import { SuggestionType } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface SuggestionIndicatorProps {
  suggestion: SuggestionType;
}

export function SuggestionIndicator({ suggestion }: SuggestionIndicatorProps) {
  const { t } = useTranslation();
  
  const getSuggestionConfig = (type: SuggestionType) => {
    switch (type) {
      case "good":
        return {
          bgColor: "bg-green-100",
          dotColor: "bg-green-500",
          textColor: "text-green-500",
          text: t('suggestion.good'),
          animation: "pulse"
        };
      case "neutral":
        return {
          bgColor: "bg-yellow-100",
          dotColor: "bg-yellow-500",
          textColor: "text-yellow-500", 
          text: t('suggestion.neutral'),
          animation: "pulse"
        };
      case "bad":
        return {
          bgColor: "bg-red-100",
          dotColor: "bg-red-500",
          textColor: "text-red-500",
          text: t('suggestion.bad'),
          animation: "shake"
        };
      default:
        return {
          bgColor: "bg-gray-100",
          dotColor: "bg-gray-500",
          textColor: "text-gray-500",
          text: t('loading.suggestion'),
          animation: "none"
        };
    }
  };

  const config = getSuggestionConfig(suggestion);
  
  return (
    <motion.div
      className={`flex items-center ${config.bgColor} py-2 px-4 rounded-full`}
      animate={config.animation === "pulse" ? 
        { opacity: [0.7, 1, 0.7] } : 
        config.animation === "shake" ? 
          { x: [0, -5, 5, -5, 5, 0] } : 
          {}}
      transition={config.animation === "pulse" ? 
        { repeat: Infinity, duration: 3 } : 
        config.animation === "shake" ? 
          { duration: 0.5, repeat: 2 } : 
          {}}
    >
      <motion.div 
        className={`h-3 w-3 rounded-full ${config.dotColor} mr-2`}
      />
      <span className={`font-medium text-sm ${config.textColor}`}>
        {config.text}
      </span>
    </motion.div>
  );
}
