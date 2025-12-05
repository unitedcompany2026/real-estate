// src/components/MortgageCalculator.tsx
import {
  useCalculateMortgage,
  useMortgageRates,
} from '@/lib/hooks/useCalculator'
import { useState, useEffect } from 'react'

export const MortgageCalculator = () => {
  const [price, setPrice] = useState(100000)
  const [downPayment, setDownPayment] = useState(20000)
  const [months, setMonths] = useState(120) // 10 years default

  const { data: rates, isLoading: ratesLoading } = useMortgageRates()
  const { mutate: calculate, data: result, isPending } = useCalculateMortgage()

  // Calculate on mount and when values change
  useEffect(() => {
    calculate({ price, downPayment, months })
  }, [price, downPayment, months])

  // Find applicable rate for current months
  const years = Math.ceil(months / 12)
  const applicableRate = rates?.find(
    rate => rate.yearFrom <= years && rate.yearTo >= years
  )

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (ratesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading calculator...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Mortgage Calculator
      </h2>

      {/* Input Section */}
      <div className="space-y-6 mb-8">
        {/* Property Price */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Property Price
            </label>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(price)}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="5000"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$10,000</span>
            <span>$1,000,000</span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Down Payment
            </label>
            <span className="text-lg font-semibold text-blue-600">
              {formatCurrency(downPayment)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={price}
            step="1000"
            value={downPayment}
            onChange={e => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span>{formatCurrency(price)}</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Loan Term
            </label>
            <span className="text-lg font-semibold text-blue-600">
              {months} months ({years} {years === 1 ? 'year' : 'years'})
            </span>
          </div>
          <input
            type="range"
            min="12"
            max="360"
            step="12"
            value={months}
            onChange={e => setMonths(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Current Interest Rate Display */}
        {applicableRate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Interest Rate ({applicableRate.yearFrom}-{applicableRate.yearTo}{' '}
                years)
              </span>
              <span className="text-xl font-bold text-blue-600">
                {applicableRate.interestRate}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Monthly Payment
          </h3>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-white text-sm mb-2">Monthly Payment</div>
              <div className="text-white text-4xl font-bold">
                {formatCurrency(result.monthlyPayment)}
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Loan Amount</div>
              <div className="text-xl font-semibold text-gray-800">
                {formatCurrency(result.loanAmount)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Payment</div>
              <div className="text-xl font-semibold text-gray-800">
                {formatCurrency(result.totalPayment)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Interest</div>
              <div className="text-xl font-semibold text-gray-800">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
              <div className="text-xl font-semibold text-gray-800">
                {result.interestRate}%
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Summary:</span> With a down
              payment of {formatCurrency(downPayment)}, you'll finance{' '}
              {formatCurrency(result.loanAmount)} over {months} months. Your
              total repayment will be {formatCurrency(result.totalPayment)},
              including {formatCurrency(result.totalInterest)} in interest.
            </p>
          </div>
        </div>
      )}

      {isPending && (
        <div className="text-center py-4 text-gray-500">Calculating...</div>
      )}

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
        }

        .slider::-moz-range-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  )
}
