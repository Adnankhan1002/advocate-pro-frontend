import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  onSubscribe?: () => void;
  buttonText?: string;
  currency?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  onSubscribe,
  buttonText = 'Start free trial',
  currency = '$',
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 transition-all duration-300 ${
        highlighted
          ? 'bg-gradient-to-br from-slate-900 via-violet-600 to-slate-800 border-2 border-violet-400 shadow-xl shadow-violet-500/20 scale-105'
          : 'bg-gradient-to-br from-white via-slate-50 to-violet-50 border-2 border-slate-300 hover:border-violet-300 hover:shadow-lg'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-violet-600 text-sm font-medium rounded-full border-2 border-violet-300 shadow-md">
          Popular
        </div>
      )}

      <div className="mb-8">
        <h3
          className={`text-2xl font-bold mb-2 ${
            highlighted ? 'text-white' : 'text-slate-900'
          }`}
        >
          {name}
        </h3>
        <p
          className={`text-sm ${
            highlighted ? 'text-violet-100' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-5xl font-bold ${
              highlighted ? 'text-white' : 'text-slate-900'
            }`}
          >
            {currency}{price}
          </span>
          <span
            className={`text-sm ${
              highlighted ? 'text-violet-100' : 'text-slate-500'
            }`}
          >
            /{period}
          </span>
        </div>
      </div>

      <button
        onClick={onSubscribe}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 mb-8 ${
          highlighted
            ? 'bg-white text-violet-600 hover:bg-violet-50 shadow-lg hover:shadow-xl active:scale-95'
            : 'bg-gradient-to-r from-slate-900 to-violet-600 text-white hover:from-slate-800 hover:to-violet-700 shadow-md hover:shadow-lg active:scale-95'
        }`}
      >
        {buttonText}
      </button>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                highlighted ? 'text-white' : 'text-violet-600'
              }`}
            />
            <span
              className={`text-sm ${
                highlighted ? 'text-white' : 'text-slate-700'
              }`}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
