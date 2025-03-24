import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SuggestionIndicator } from "./suggestion-indicator";
import { CurrencyInput } from "./ui/currency-input";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Bell } from "lucide-react";
import { AlertModal } from "./alert-modal";
import { motion } from "framer-motion";
import { SuggestionType } from "@shared/schema";
import { useTranslation } from "react-i18next";

export function ExchangeRateCard() {
  const { t, i18n } = useTranslation();
  const [jpyAmount, setJpyAmount] = useState(10000);
  const [vndAmount, setVndAmount] = useState(0);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(t('loading.suggestion'));

  // Fetch current rate
  const { data: rateData, isLoading: isRateLoading, error: rateError } = useQuery({
    queryKey: ["/api/rate/current"],
  });

  // Fetch suggestion
  const { data: suggestionData, isLoading: isSuggestionLoading, error: suggestionError } = useQuery({
    queryKey: ["/api/suggestion"],
  });

  // Update VND amount when JPY amount or rate changes
  useEffect(() => {
    if (rateData?.rate) {
      setVndAmount(Math.round(jpyAmount * rateData.rate));
      
      // Format the timestamp
      const updatedDate = new Date(rateData.timestamp);
      setLastUpdated(updatedDate.toLocaleString(i18n.language === 'en' ? 'en-US' : i18n.language === 'vi' ? 'vi-VN' : 'ja-JP'));
    }
  }, [jpyAmount, rateData, i18n.language]);

  const handleJpyChange = (value: number) => {
    setJpyAmount(value);
  };

  if (rateError || suggestionError) {
    return (
      <Card className="bg-white rounded-lg shadow-md p-6 mb-6 border border-red-200">
        <CardContent className="p-0">
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2" />
            <span>{t('errors.rateError')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 transition-all hover:shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{t('exchangeRate.title')}</h2>
                <p className="text-sm text-gray-500">{t('exchangeRate.lastUpdated')}: {lastUpdated}</p>
              </div>
              
              {isSuggestionLoading ? (
                <div className="mt-4 md:mt-0 bg-gray-100 py-2 px-4 rounded-full animate-pulse">
                  <span className="text-gray-500 text-sm">{t('loading.suggestion')}</span>
                </div>
              ) : (
                <div className="mt-4 md:mt-0">
                  <SuggestionIndicator suggestion={suggestionData?.suggestion || "neutral" as SuggestionType} />
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4">
                  <span className="font-mono font-bold text-primary">¥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('exchangeRate.japaneseYen')}</p>
                  <div className="flex items-center">
                    <CurrencyInput 
                      value={jpyAmount} 
                      onChange={handleJpyChange}
                      currency="JPY"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-primary my-4 sm:my-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 sm:rotate-0">
                  <path d="M17 3L21 7L17 11"></path>
                  <path d="M21 7H3"></path>
                  <path d="M7 13L3 17L7 21"></path>
                  <path d="M3 17H21"></path>
                </svg>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4">
                  <span className="font-mono font-bold text-green-500">₫</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('exchangeRate.vietnameseDong')}</p>
                  <div className="flex items-center">
                    <p className="font-mono font-medium text-xl">
                      {isRateLoading ? t('loading.suggestion') : vndAmount.toLocaleString(i18n.language === 'en' ? 'en-US' : i18n.language === 'vi' ? 'vi-VN' : 'ja-JP')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{t('exchangeRate.exchangeRate')}</p>
                <p className="font-mono font-semibold text-lg">
                  {isRateLoading ? t('loading.suggestion') : `${rateData?.rate.toFixed(2)} ${t('exchangeRate.perJPY')}`}
                </p>
              </div>
              
              <Button
                onClick={() => setIsAlertModalOpen(true)}
                className="bg-primary hover:bg-blue-600 transition-colors text-white font-medium py-2 px-4 rounded-lg flex items-center"
              >
                <Bell className="mr-2 h-4 w-4" />
                <span>{t('exchangeRate.setAlert')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AlertModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)}
        currentRate={rateData?.rate || 0}
      />
    </>
  );
}
