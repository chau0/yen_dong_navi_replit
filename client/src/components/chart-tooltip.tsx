import React from 'react';
import { formatDate, formatNumber } from '@/lib/utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  currency?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  active, 
  payload, 
  label,
  currency = 'VND'
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const date = formatDate(label || '');
  const value = payload[0].value;

  return (
    <div className="chart-tooltip bg-gray-800/90 rounded-md px-3 py-2 text-white shadow-lg">
      <div className="font-medium">{date}</div>
      <div className="font-mono">1 JPY = {formatNumber(value)} {currency}</div>
    </div>
  );
};

export default ChartTooltip;
