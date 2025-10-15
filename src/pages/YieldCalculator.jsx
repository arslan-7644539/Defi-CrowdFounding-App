import React, { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Percent, Calendar } from "lucide-react";

export default function YieldCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [n, setN] = useState(12);
  const [result, setResult] = useState(null);
  const [animateResult, setAnimateResult] = useState(false);

  useEffect(() => {
    if (result) {
      setAnimateResult(true);
      const timer = setTimeout(() => setAnimateResult(false), 600);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const calculateYield = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) {
      alert("Please enter valid positive values");
      return;
    }

    const simpleAmount = P * (1 + r * t);
    const simpleProfit = simpleAmount - P;

    const compoundAmount = P * Math.pow(1 + r / n, n * t);
    const compoundProfit = compoundAmount - P;
    const apy = (Math.pow(1 + r / n, n) - 1) * 100;

    const difference = compoundProfit - simpleProfit;
    const percentageGain = ((compoundProfit / simpleProfit - 1) * 100);

    setResult({
      simpleAmount: simpleAmount.toFixed(2),
      simpleProfit: simpleProfit.toFixed(2),
      compoundAmount: compoundAmount.toFixed(2),
      compoundProfit: compoundProfit.toFixed(2),
      apy: apy.toFixed(2),
      difference: difference.toFixed(2),
      percentageGain: percentageGain.toFixed(2),
      monthlyBreakdown: calculateMonthlyBreakdown(P, r, n, t),
    });
  };

  const calculateMonthlyBreakdown = (P, r, n, t) => {
    const breakdown = [];
    const months = Math.floor(t * 12);
    const step = Math.max(1, Math.floor(months / 12));

    for (let month = 0; month <= months; month += step) {
      const years = month / 12;
      const simpleVal = P * (1 + r * years);
      const compoundVal = P * Math.pow(1 + r / n, n * years);
      breakdown.push({
        month,
        simple: simpleVal,
        compound: compoundVal,
      });
    }
    return breakdown;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getCompoundingLabel = (freq) => {
    const labels = { 1: "Annually", 4: "Quarterly", 12: "Monthly", 365: "Daily" };
    return labels[freq] || "Custom";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 w-full max-w-4xl text-white">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Investment Yield Calculator
          </h2>
          <p className="text-white/60 mt-2">Compare simple vs compound interest growth</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
              <DollarSign className="w-4 h-4" />
              Principal Amount
            </label>
            <input
              type="number"
              placeholder="10000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
              <Percent className="w-4 h-4" />
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              placeholder="10"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
              <Calendar className="w-4 h-4" />
              Investment Period (Years)
            </label>
            <input
              type="number"
              placeholder="5"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/90">
              <TrendingUp className="w-4 h-4" />
              Compounding Frequency
            </label>
            <select
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all cursor-pointer"
            >
              <option className="bg-slate-800" value="1">Annually (1x/year)</option>
              <option className="bg-slate-800" value="4">Quarterly (4x/year)</option>
              <option className="bg-slate-800" value="12">Monthly (12x/year)</option>
              <option className="bg-slate-800" value="365">Daily (365x/year)</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculateYield}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all py-4 rounded-xl font-semibold shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Calculate Returns
        </button>

        {result && (
          <div className={`mt-8 space-y-6 transition-all duration-500 ${animateResult ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-400/30">
              <h3 className="text-xl font-semibold text-center mb-6 text-indigo-200">
                Investment Growth Comparison
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-semibold text-lg text-blue-300">Simple Interest</h4>
                    <span className="text-xs bg-blue-500/20 px-3 py-1 rounded-full">Linear Growth</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Final Amount</span>
                      <span className="font-bold text-lg">{formatCurrency(result.simpleAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Total Profit</span>
                      <span className="font-bold text-green-400">{formatCurrency(result.simpleProfit)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-xl border border-purple-400/30 space-y-3 ring-2 ring-purple-400/20">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-semibold text-lg text-purple-300">Compound Interest</h4>
                    <span className="text-xs bg-purple-500/20 px-3 py-1 rounded-full">{getCompoundingLabel(n)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Final Amount</span>
                      <span className="font-bold text-lg">{formatCurrency(result.compoundAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Total Profit</span>
                      <span className="font-bold text-green-400">{formatCurrency(result.compoundProfit)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-white/60 text-sm">APY</span>
                      <span className="font-bold text-purple-300">{result.apy}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Compound Interest Advantage</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(result.difference)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Extra Returns</p>
                    <p className="text-2xl font-bold text-green-400">+{result.percentageGain}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="font-semibold text-lg mb-4 text-indigo-200">Growth Visualization</h4>
              <div className="space-y-3">
                {result.monthlyBreakdown.map((point, idx) => {
                  const maxVal = Math.max(point.simple, point.compound);
                  const simpleWidth = (point.simple / maxVal) * 100;
                  const compoundWidth = (point.compound / maxVal) * 100;
                  const yearLabel = point.month === 0 ? "Start" : `${(point.month / 12).toFixed(1)}y`;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-white/60">
                        <span>{yearLabel}</span>
                        <span className="text-white/80">{formatCurrency(point.compound)}</span>
                      </div>
                      <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                        <div
                          className="absolute h-full bg-blue-500/30 border-r-2 border-blue-400 transition-all duration-300"
                          style={{ width: `${simpleWidth}%` }}
                        />
                        <div
                          className="absolute h-full bg-gradient-to-r from-purple-500/40 to-indigo-500/40 border-r-2 border-purple-400 transition-all duration-300"
                          style={{ width: `${compoundWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500/30 border border-blue-400 rounded"></div>
                  <span className="text-white/60">Simple Interest</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500/40 to-indigo-500/40 border border-purple-400 rounded"></div>
                  <span className="text-white/60">Compound Interest</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}