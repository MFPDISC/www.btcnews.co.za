'use client';

import React, { useState } from 'react';
import { trackReferralClick } from '@/lib/analytics';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-gray-700 z-50 max-w-xs">
          <div className="text-center">{content}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default function HowToBuyBitcoin() {
  const [selectedExchange, setSelectedExchange] = useState<'valr' | 'luno' | 'binance'>('valr');

  const exchanges = [
    {
      id: 'valr' as const,
      name: 'VALR',
      logo: '🇿🇦',
      depositFee: 'Free',
      tradingFee: '0.075%',
      withdrawalFee: '0.0005 BTC',
      bankDeposit: 'Instant EFT',
      pros: ['South African regulated', 'Instant EFT deposits', 'Lowest fees for ZAR'],
      cons: ['Limited to South Africa', 'Smaller liquidity'],
      recommended: true,
      description: 'Best for South African beginners'
    },
    {
      id: 'luno' as const,
      name: 'LUNO',
      logo: '🌍',
      depositFee: 'Free',
      tradingFee: '0.1%',
      withdrawalFee: '0.0005 BTC',
      bankDeposit: 'Instant EFT',
      pros: ['Very user-friendly', 'Strong South African presence', 'Educational resources'],
      cons: ['Higher trading fees', 'Limited advanced features'],
      recommended: false,
      description: 'Great for absolute beginners'
    },
    {
      id: 'binance' as const,
      name: 'Binance',
      logo: '🌐',
      depositFee: 'R15-50',
      tradingFee: '0.1%',
      withdrawalFee: '0.0004 BTC',
      bankDeposit: 'Bank transfer',
      pros: ['Largest global exchange', 'Advanced features', 'Many trading pairs'],
      cons: ['More complex interface', 'Deposit fees', 'Regulatory uncertainty'],
      recommended: false,
      description: 'For experienced traders'
    }
  ];

  const steps = {
    valr: [
      {
        step: 1,
        title: 'Create VALR Account',
        description: 'Sign up and complete FICA verification',
        icon: '📝',
        details: 'Upload ID, proof of address, and selfie. Usually takes 1-2 hours.'
      },
      {
        step: 2,
        title: 'Link Bank Account',
        description: 'Add your South African bank account',
        icon: '🏦',
        details: 'Use the same name as your VALR account. Supports all major SA banks.'
      },
      {
        step: 3,
        title: 'Deposit ZAR',
        description: 'Transfer money via instant EFT',
        icon: '💰',
        details: 'Free deposits, instant processing during banking hours.'
      },
      {
        step: 4,
        title: 'Buy Bitcoin',
        description: 'Use limit orders for best prices',
        icon: '₿',
        details: 'Set your price below market for better deals. Be patient!'
      },
      {
        step: 5,
        title: 'Withdraw to Ledger',
        description: 'Transfer to your hardware wallet',
        icon: '🔒',
        details: 'Never leave large amounts on exchanges. Your keys, your coins!'
      }
    ],
    luno: [
      {
        step: 1,
        title: 'Create LUNO Account',
        description: 'Sign up and verify identity',
        icon: '📝',
        details: 'FICA process similar to VALR, usually 2-4 hours.'
      },
      {
        step: 2,
        title: 'Link Bank Account',
        description: 'Add your bank details',
        icon: '🏦',
        details: 'Supports all major South African banks with instant verification.'
      },
      {
        step: 3,
        title: 'Deposit ZAR',
        description: 'Free instant EFT deposits',
        icon: '💰',
        details: 'No deposit fees, money reflects within minutes.'
      },
      {
        step: 4,
        title: 'Buy Bitcoin',
        description: 'Simple buy/sell interface',
        icon: '₿',
        details: 'Easy one-click buying, but higher fees than limit orders.'
      },
      {
        step: 5,
        title: 'Withdraw to Ledger',
        description: 'Send to hardware wallet',
        icon: '🔒',
        details: 'Use the send function to transfer to your Ledger address.'
      }
    ],
    binance: [
      {
        step: 1,
        title: 'Create Binance Account',
        description: 'Global registration and KYC',
        icon: '📝',
        details: 'More complex verification, can take 24-48 hours.'
      },
      {
        step: 2,
        title: 'Add Payment Method',
        description: 'Link bank or use P2P',
        icon: '🏦',
        details: 'Bank transfers have fees. P2P trading available but riskier.'
      },
      {
        step: 3,
        title: 'Deposit Funds',
        description: 'Transfer ZAR (fees apply)',
        icon: '💰',
        details: 'R15-50 deposit fees depending on method used.'
      },
      {
        step: 4,
        title: 'Buy USDT First',
        description: 'Convert ZAR to USDT',
        icon: '💵',
        details: 'Stable coin provides better liquidity for BTC purchases.'
      },
      {
        step: 5,
        title: 'Buy Bitcoin',
        description: 'Trade USDT for BTC',
        icon: '₿',
        details: 'Use spot trading with limit orders for best prices.'
      },
      {
        step: 6,
        title: 'Withdraw to Ledger',
        description: 'Transfer to hardware wallet',
        icon: '🔒',
        details: 'Always withdraw to your own wallet for security.'
      }
    ]
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mt-8">
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🇿🇦</span>
            <div>
              <h2 className="text-xl font-bold text-white">How to Buy Bitcoin in South Africa</h2>
              <p className="text-gray-400 text-sm">Complete guide to safely buying Bitcoin with ZAR</p>
            </div>
          </div>
          <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl">
            ▼
          </span>
        </summary>
        
        <div className="space-y-8">

      {/* Exchange Comparison Table */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
          📊 Exchange Comparison
          <Tooltip content="Compare the main South African Bitcoin exchanges to find the best option for your needs.">
            <span className="ml-2 text-gray-400 hover:text-orange-400 cursor-help">ℹ️</span>
          </Tooltip>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800/50 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Exchange</th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Deposit Fee
                  <Tooltip content="Cost to deposit ZAR into your exchange account">
                    <span className="ml-1 text-gray-400">ℹ️</span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Trading Fee
                  <Tooltip content="Percentage charged when buying/selling Bitcoin">
                    <span className="ml-1 text-gray-400">ℹ️</span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Withdrawal Fee
                  <Tooltip content="Cost to send Bitcoin to your personal wallet">
                    <span className="ml-1 text-gray-400">ℹ️</span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">Best For</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((exchange, index) => (
                <tr key={exchange.id} className={`border-t border-gray-700 ${exchange.recommended ? 'bg-green-500/10' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{exchange.logo}</span>
                      <div>
                        <div className="text-white font-semibold flex items-center">
                          {exchange.name}
                          {exchange.recommended && (
                            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">RECOMMENDED</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">{exchange.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-green-400 font-semibold">{exchange.depositFee}</td>
                  <td className="px-6 py-4 text-orange-400 font-semibold">{exchange.tradingFee}</td>
                  <td className="px-6 py-4 text-blue-400 font-semibold">{exchange.withdrawalFee}</td>
                  <td className="px-6 py-4 text-gray-300">{exchange.description}</td>
                  <td className="px-6 py-4">
                    {exchange.id === 'valr' && (
                      <a 
                        href="https://www.valr.com/invite/VA9S573A" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackReferralClick('valr', 'https://www.valr.com/invite/VA9S573A')}
                      >
                        <button className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-500/30">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🇿🇦</span>
                            <span>Open VALR Account</span>
                            <span className="text-xs opacity-75 group-hover:opacity-100">→</span>
                          </div>
                          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                      </a>
                    )}
                    {exchange.id === 'luno' && (
                      <a 
                        href="https://www.luno.com/invite/CF3CQX" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackReferralClick('luno', 'https://www.luno.com/invite/CF3CQX')}
                      >
                        <div>
                          <button className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-purple-500/30">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🌍</span>
                              <span>Open LUNO Account</span>
                              <span className="text-xs opacity-75 group-hover:opacity-100">→</span>
                            </div>
                            <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </button>
                          <p className="text-xs text-gray-500 mt-1">💰 Use code CF3CQX • Deposit R500 • Get R100 BTC bonus</p>
                        </div>
                      </a>
                    )}
                    {exchange.id === 'binance' && (
                      <a 
                        href="https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=en&ref=GRO_28502_GZ7XU&utm_source=default" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackReferralClick('binance', 'https://www.binance.com/referral/earn-together/refer2earn-usdc/claim?hl=en&ref=GRO_28502_GZ7XU&utm_source=default')}
                      >
                        <button className="group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-yellow-400/30">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🌐</span>
                            <span>Open Binance Account</span>
                            <span className="text-xs opacity-75 group-hover:opacity-100">→</span>
                          </div>
                          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exchange Selection */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-6">📋 Step-by-Step Guide</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          {exchanges.map((exchange) => (
            <button
              key={exchange.id}
              onClick={() => setSelectedExchange(exchange.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                selectedExchange === exchange.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{exchange.logo}</span>
              {exchange.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps[selectedExchange].map((step, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {step.step}
              </div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
              <p className="text-gray-300 mb-3">{step.description}</p>
              <p className="text-gray-400 text-sm">{step.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Limit Orders Explanation */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            📈 What are Limit Orders?
            <Tooltip content="Limit orders let you set the exact price you want to pay for Bitcoin, potentially saving you money compared to market orders.">
              <span className="ml-2 text-gray-400 hover:text-orange-400 cursor-help">ℹ️</span>
            </Tooltip>
          </h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <p className="text-white font-medium">Set Your Price</p>
                <p className="text-gray-400 text-sm">Choose exactly what you want to pay per Bitcoin</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <p className="text-white font-medium">Save Money</p>
                <p className="text-gray-400 text-sm">Often get better prices than instant market orders</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 text-xl">⏳</span>
              <div>
                <p className="text-white font-medium">Be Patient</p>
                <p className="text-gray-400 text-sm">May take time for your order to be filled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Wallet Explanation */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
            🔒 Why Use a Hardware Wallet (Ledger)?
            <Tooltip content="Hardware wallets are physical devices that store your Bitcoin offline, providing the highest level of security for your cryptocurrency.">
              <span className="ml-2 text-gray-400 hover:text-orange-400 cursor-help">ℹ️</span>
            </Tooltip>
          </h4>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-xl">🛡️</span>
              <div>
                <p className="text-white font-medium">Ultimate Security</p>
                <p className="text-gray-400 text-sm">Your Bitcoin is stored offline, safe from hackers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-xl">🔑</span>
              <div>
                <p className="text-white font-medium">You Own Your Keys</p>
                <p className="text-gray-400 text-sm">"Not your keys, not your coins" - full control</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-xl">💎</span>
              <div>
                <p className="text-white font-medium">Long-term Storage</p>
                <p className="text-gray-400 text-sm">Perfect for holding Bitcoin for years</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Bank Account Deposits */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
        <h4 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
          🏦 Why Use Bank Account Deposits?
          <Tooltip content="Bank account deposits are the cheapest and most secure way to fund your exchange account in South Africa.">
            <span className="ml-2 text-gray-400 hover:text-blue-400 cursor-help">ℹ️</span>
          </Tooltip>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h5 className="text-white font-semibold mb-2">Lowest Fees</h5>
            <p className="text-gray-300 text-sm">Free or very low cost compared to card payments</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h5 className="text-white font-semibold mb-2">Fast Processing</h5>
            <p className="text-gray-300 text-sm">Instant EFT means money reflects within minutes</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <h5 className="text-white font-semibold mb-2">Secure & Traceable</h5>
            <p className="text-gray-300 text-sm">Bank-level security with full transaction records</p>
          </div>
        </div>
      </div>

      {/* Hardware Wallet Section */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
        <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
          🔒 Get a Hardware Wallet (Essential!)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-lg font-semibold text-orange-400 mb-3">Recommended: Ledger Nano S Plus</h5>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Supports 5,500+ cryptocurrencies</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Offline storage (cold wallet)</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Easy-to-use Ledger Live app</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Trusted by millions worldwide</li>
            </ul>
            <a 
              href="https://shop.ledger.com/pages/referral-program?referral_code=T66NQXD8VX5YE" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackReferralClick('ledger', 'https://shop.ledger.com/pages/referral-program?referral_code=T66NQXD8VX5YE')}
            >
              <button className="group relative mt-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600/30">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔒</span>
                  <div className="text-left">
                    <div className="text-lg">Get Ledger Nano S Plus</div>
                    <div className="text-xs opacity-75 group-hover:opacity-100">Hardware Wallet - Ultimate Security</div>
                  </div>
                  <span className="text-sm opacity-75 group-hover:opacity-100">→</span>
                </div>
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </a>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h6 className="text-red-400 font-semibold mb-2">⚠️ Never Leave Bitcoin on Exchanges</h6>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Exchanges can be hacked</li>
              <li>• Your account can be frozen</li>
              <li>• Exchange might go bankrupt</li>
              <li>• You don't control your private keys</li>
            </ul>
            <p className="text-orange-400 text-sm mt-3 font-medium">
              "Not your keys, not your coins!"
            </p>
          </div>
        </div>
      </div>

      {/* Mini Help Section */}
      <div className="bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-lg p-3 border border-orange-500/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white text-sm font-medium">Need help? </span>
            <span className="text-gray-400 text-xs">Get expert Bitcoin guidance</span>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
              📞 Call
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
              💬 Message
            </button>
          </div>
        </div>
      </div>
        </div>
      </details>
    </div>
  );
}
