import React, { useState } from 'react';
import { Eye, TrendingUp, Clock, DollarSign, Calendar, Star, CheckCircle } from 'lucide-react';

const InvestorOffersDashboard = () => {
  const [selectedInvoice, setSelectedInvoice] = useState('INV-2024-001');

  const invoiceOffers = {
    'INV-2024-001': [
      {
        id: 'fi-001',
        name: 'FinTech Capital',
        logo: 'Fi',
        rating: 4.8,
        totalFunded: '$2.5M',
        advanceRate: 85,
        amount: 10625,
        interestRate: 12,
        terms: 30,
        received: '2 hours ago',
        expires: '2 days',
        fees: 250,
        status: 'active'
      },
      {
        id: 'da-001',
        name: 'Digital Assets Fund',
        logo: 'Di',
        rating: 4.6,
        totalFunded: '$1.8M',
        advanceRate: 82,
        amount: 10250,
        interestRate: 11.5,
        terms: 28,
        received: '4 hours ago',
        expires: '1 day',
        fees: 200,
        status: 'active'
      },
      {
        id: 'bv-001',
        name: 'Blockchain Ventures',
        logo: 'Bl',
        rating: 4.9,
        totalFunded: '$3.2M',
        advanceRate: 88,
        amount: 11000,
        interestRate: 13,
        terms: 35,
        received: '6 hours ago',
        expires: '3 days',
        fees: 300,
        status: 'active'
      }
    ],
    'INV-2024-002': [
      {
        id: 'fi-002',
        name: 'FinTech Capital',
        logo: 'Fi',
        rating: 4.8,
        totalFunded: '$2.5M',
        advanceRate: 90,
        amount: 7875,
        interestRate: 10,
        terms: 25,
        received: '3 days ago',
        expires: 'Accepted',
        fees: 150,
        status: 'accepted'
      }
    ],
    'INV-2024-004': [
      {
        id: 'ic-001',
        name: 'Invoice Capital LLC',
        logo: 'In',
        rating: 4.5,
        totalFunded: '$950K',
        advanceRate: 80,
        amount: 17600,
        interestRate: 14,
        terms: 42,
        received: '1 day ago',
        expires: '4 days',
        fees: 400,
        status: 'active'
      }
    ]
  };

  const summaryStats = {
    totalOffers: 5,
    bestRate: '90%',
    avgInterest: '12.1%',
    potentialFunding: '$49,475'
  };

  const activeOffers = invoiceOffers[selectedInvoice] || [];

  const handleAccept = (offerId) => {
    console.log('Accepting offer:', offerId);
  };

  const handleDecline = (offerId) => {
    console.log('Declining offer:', offerId);
  };

  const handleViewDetails = (offerId) => {
    console.log('Viewing details for:', offerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Investor Offers</h1>
            <p className="text-gray-600 mt-1">Review and manage funding offers</p>
          </div>
          <div className="text-sm text-gray-500">
            <TrendingUp className="inline w-4 h-4 mr-1" />
            4 Active Offers
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Invoice Selector */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {Object.keys(invoiceOffers).map((invoice) => (
              <button
                key={invoice}
                onClick={() => setSelectedInvoice(invoice)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedInvoice === invoice
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {invoice}
              </button>
            ))}
          </div>
        </div>

        {/* Current Invoice Offers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                Offers for {selectedInvoice}
              </h2>
            </div>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Eye className="w-4 h-4 mr-1" />
              View Invoice
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {activeOffers.map((offer) => (
              <div key={offer.id} className="px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {offer.logo}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{offer.name}</h3>
                        {offer.status === 'accepted' ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            accepted
                          </span>
                        ) : (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          {offer.rating}
                        </div>
                        <span>Total funded: {offer.totalFunded}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-12">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Advance Rate</div>
                      <div className="text-2xl font-bold text-blue-600">{offer.advanceRate}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Amount</div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${offer.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Interest Rate</div>
                      <div className="text-2xl font-bold text-gray-900">{offer.interestRate}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Terms</div>
                      <div className="text-2xl font-bold text-gray-900">{offer.terms} days</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Received {offer.received}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {offer.status === 'accepted' ? (
                        `Expires in ${offer.expires}`
                      ) : (
                        `Expires in ${offer.expires}`
                      )}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Fees: ${offer.fees}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleViewDetails(offer.id)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                    >
                      Details
                    </button>
                    {offer.status === 'accepted' ? (
                      <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Offer Accepted
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDecline(offer.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(offer.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                        >
                          Accept
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Offers</h3>
            <div className="text-3xl font-bold text-gray-900">
              {summaryStats.totalOffers}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Best Rate</h3>
            <div className="text-3xl font-bold text-green-600">
              {summaryStats.bestRate}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Interest</h3>
            <div className="text-3xl font-bold text-gray-900">
              {summaryStats.avgInterest}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Potential Funding</h3>
            <div className="text-3xl font-bold text-blue-600">
              {summaryStats.potentialFunding}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorOffersDashboard;