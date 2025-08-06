import React, { useState } from 'react';
import InvestorOffersDashboard from './InvestorOffersDashboard';
import { 
  Upload, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Wallet, 
  User, 
  Settings, 
  Bell,
  Clock,
  DollarSign,
  Activity,
  Search,
  Filter,
  Eye,
  Download,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const sidebarItems = [
    { id: 'upload', label: 'Upload Invoice', icon: Upload, color: 'bg-blue-500' },
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'bg-gray-600' },
    { id: 'invoices', label: 'My Invoices', icon: FileText, color: 'bg-gray-600' },
    { id: 'offers', label: 'Investor Offers', icon: TrendingUp, color: 'bg-gray-600' },
    { id: 'transactions', label: 'Transactions', icon: Activity, color: 'bg-gray-600' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'bg-gray-600' },
    { id: 'profile', label: 'Profile & KYC', icon: User, color: 'bg-gray-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-600' },
  ];

  const stats = [
    {
      title: 'Total Funded',
      value: '$156,500',
      change: '+12.5%',
      positive: true,
      icon: DollarSign
    },
    {
      title: 'Active Invoices',
      value: '8',
      subtitle: '3 pending',
      icon: FileText
    },
    {
      title: 'Wallet Balance',
      value: '$23,750',
      change: '+5.2%',
      positive: true,
      icon: Wallet
    },
    {
      title: 'Avg. Funding Time',
      value: '3.2 days',
      change: '-0.8 days',
      positive: true,
      icon: Clock
    }
  ];

  const invoices = [
    {
      id: 'INV-2024-001',
      company: 'Tech Solutions Ltd',
      amount: '$12,500',
      dueDate: '2024-02-15',
      status: 'pending offers',
      statusColor: 'bg-orange-500',
      offers: 3,
      bestAdvance: '85% advance',
      nftId: 'NFT-001-2024',
      blockchain: 'Ethereum'
    },
    {
      id: 'INV-2024-002',
      company: 'Digital Marketing Co',
      amount: '$8,750',
      dueDate: '2024-02-12',
      status: 'funded',
      statusColor: 'bg-green-500',
      offers: 1,
      bestAdvance: '90% advance',
      nftId: 'NFT-002-2024',
      blockchain: 'Polygon'
    },
    {
      id: 'INV-2024-003',
      company: 'E-commerce Startup',
      amount: '$15,200',
      dueDate: '2024-02-10',
      status: 'under review',
      statusColor: 'bg-blue-500',
      offers: 0,
      bestAdvance: null,
      nftId: null,
      blockchain: null
    },
    {
      id: 'INV-2024-004',
      company: 'Software Development LLC',
      amount: '$22,000',
      dueDate: '2024-02-08',
      status: 'tokenized',
      statusColor: 'bg-cyan-500',
      offers: 5,
      bestAdvance: '88% advance',
      nftId: 'NFT-004-2024',
      blockchain: 'Ethereum'
    }
  ];

  const notifications = [
    {
      title: 'New investor offer received',
      description: '85% advance on Invoice #INV-2024-001',
      time: '2 hours ago',
      type: 'offer'
    },
    {
      title: 'Invoice successfully funded',
      description: 'Invoice #INV-2024-003 has been funded',
      time: '1 day ago',
      type: 'success'
    },
    {
      title: 'KYC verification pending',
      description: 'Please complete your business verification',
      time: '3 days ago',
      type: 'warning'
    }
  ];

  const transactions = [
    {
      id: 'TXN-001',
      type: 'funding',
      description: 'Invoice INV-2024-002 funded by FinTech Capital',
      amount: '+$7,725',
      fee: '$150',
      date: '2024-01-18',
      status: 'completed',
      blockchain: 'Ethereum',
      txHash: '0x742d35c...',
      icon: 'funding'
    },
    {
      id: 'TXN-002',
      type: 'repayment',
      description: 'Repayment for Invoice INV-2024-002 to FinTech Capital',
      amount: '-$8,725',
      fee: '$25',
      date: '2024-01-16',
      status: 'completed',
      blockchain: 'Ethereum',
      txHash: '0x8f3a9c2d...',
      icon: 'repayment'
    },
    {
      id: 'TXN-003',
      type: 'funding',
      description: 'Invoice INV-2024-003 funded by Blockchain Ventures',
      amount: '+$19,500',
      fee: '$300',
      date: '2024-01-14',
      status: 'completed',
      blockchain: 'Polygon',
      txHash: '0x1a2b3c4d...',
      icon: 'funding'
    },
    {
      id: 'TXN-004',
      type: 'tokenization',
      description: 'Invoice INV-2024-001 tokenized as NFT',
      amount: '+$-50',
      fee: '$50',
      date: '2024-01-12',
      status: 'completed',
      blockchain: 'Ethereum',
      txHash: '0x9f8e7d6c...',
      icon: 'tokenization'
    },
    {
      id: 'TXN-005',
      type: 'funding',
      description: 'Invoice INV-2024-001 funded by Digital Assets Fund',
      amount: '+$11,200',
      fee: '$200',
      date: '2024-01-10',
      status: 'pending',
      blockchain: 'Ethereum',
      txHash: '0x5d4c3b2a...',
      icon: 'funding'
    },
    {
      id: 'TXN-006',
      type: 'wallet',
      description: 'Initial wallet funding',
      amount: '+$4,985',
      fee: '$15',
      date: '2024-01-08',
      status: 'completed',
      blockchain: 'Ethereum',
      txHash: '0x6e5d4c3b...',
      icon: 'wallet'
    }
  ];

  const transactionSummary = {
    totalReceived: '$27,225',
    totalRepaid: '$8,750',
    totalFees: '$740',
    netPosition: '$18,475'
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'funding':
        return <TrendingUp size={16} className="text-green-500" />;
      case 'repayment':
        return <ArrowLeft size={16} className="text-orange-500" />;
      case 'tokenization':
        return <Zap size={16} className="text-cyan-500" />;
      case 'wallet':
        return <Wallet size={16} className="text-blue-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'funded':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending offers':
        return <Clock size={16} className="text-orange-500" />;
      case 'tokenized':
        return <Zap size={16} className="text-cyan-500" />;
      case 'under review':
        return <AlertCircle size={16} className="text-blue-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  const renderInvoiceDetail = () => {
    if (!selectedInvoice) return null;

    return (
      <div className="bg-white min-h-screen">
        <div className="p-8">
          <button
            onClick={() => setSelectedInvoice(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Invoices</span>
          </button>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedInvoice.id}</h1>
                <p className="text-gray-600">{selectedInvoice.company}</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-gray-100 hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button className="bg-gray-100 hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
                  <Download size={16} />
                  <span>Download</span>
                </button>
                {selectedInvoice.offers > 0 && (
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200">
                    View Offers
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Invoice Amount</h3>
                <p className="text-2xl font-bold text-gray-900">{selectedInvoice.amount}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Due Date</h3>
                <p className="text-2xl font-bold text-gray-900">{selectedInvoice.dueDate}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-gray-600 text-sm font-medium mb-2">Status</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${selectedInvoice.statusColor}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            {selectedInvoice.offers > 0 && (
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h3 className="text-gray-900 font-semibold mb-4">Funding Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Available Offers</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedInvoice.offers} offers</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Best Advance Rate</p>
                    <p className="text-lg font-semibold text-green-600">{selectedInvoice.bestAdvance}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedInvoice.nftId && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="text-gray-900 font-semibold mb-4">Blockchain Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">NFT ID</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedInvoice.nftId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Blockchain</p>
                    <p className="text-lg font-semibold text-blue-600">{selectedInvoice.blockchain}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">Complete record of all financial transactions</p>
        </div>
        <button className="bg-gray-100 hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white text-gray-700 px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2">
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Received</h3>
          <p className="text-2xl font-bold text-green-600">{transactionSummary.totalReceived}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Repaid</h3>
          <p className="text-2xl font-bold text-orange-600">{transactionSummary.totalRepaid}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Fees</h3>
          <p className="text-2xl font-bold text-gray-900">{transactionSummary.totalFees}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Net Position</h3>
          <p className="text-2xl font-bold text-blue-600">{transactionSummary.netPosition}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white transition-all duration-200">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* All Transactions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Activity size={24} className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white group-hover:bg-white/20 rounded-lg">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-white">{transaction.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800 group-hover:bg-green-800 group-hover:text-green-100' 
                        : 'bg-orange-100 text-orange-800 group-hover:bg-orange-800 group-hover:text-orange-100'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-300 mb-1">{transaction.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 group-hover:text-gray-400">
                    <span>{transaction.date}</span>
                    <span className="flex items-center space-x-1">
                      <span>{transaction.blockchain}</span>
                      <span>{transaction.txHash}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.amount.startsWith('+') 
                    ? 'text-green-600 group-hover:text-green-300' 
                    : transaction.amount.startsWith('-')
                    ? 'text-red-600 group-hover:text-red-300'
                    : 'text-gray-900 group-hover:text-white'
                }`}>
                  {transaction.amount}
                </p>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">Fee: {transaction.fee}</p>
                <button className="mt-2 p-1 hover:bg-gray-100 group-hover:hover:bg-white/20 rounded transition-all duration-200">
                  <Eye size={14} className="text-gray-600 group-hover:text-gray-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInvoicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Track and manage your invoice financing</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2">
          <Upload size={20} />
          <span>Upload New Invoice</span>
        </button>
      </div>

      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
        <Upload size={48} className="text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Invoice</h3>
        <p className="text-gray-600 mb-4">Drag and drop your unpaid invoices or click to browse</p>
        <button className="bg-white hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 transition-all duration-200">
          Choose Files
        </button>
        <p className="text-gray-500 text-sm mt-4">Supported formats: PDF, PNG, JPG (Max 10MB)</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white transition-all duration-200">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white transition-all duration-200 cursor-pointer group"
            onClick={() => setSelectedInvoice(invoice)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                {getStatusIcon(invoice.status)}
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-white">{invoice.id}</h3>
                  <p className="text-gray-600 group-hover:text-gray-300">{invoice.company}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-lg font-bold text-gray-900 group-hover:text-white">{invoice.amount}</span>
                    <span className="text-gray-500 group-hover:text-gray-400">Due: {invoice.dueDate}</span>
                    {invoice.offers > 0 && (
                      <>
                        <span className="text-blue-600 group-hover:text-blue-300">{invoice.offers} offers</span>
                        <span className="text-green-600 group-hover:text-green-300">Best: {invoice.bestAdvance}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {invoice.nftId && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 group-hover:text-gray-400">NFT ID</p>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-white">{invoice.nftId}</p>
                    <p className="text-xs text-blue-600 group-hover:text-blue-300">{invoice.blockchain}</p>
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-white text-sm ${invoice.statusColor}`}>
                  {invoice.status}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 group-hover:hover:bg-white/20 rounded-lg transition-all duration-200">
                    <Eye size={16} className="text-gray-600 group-hover:text-gray-300" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 group-hover:hover:bg-white/20 rounded-lg transition-all duration-200">
                    <Download size={16} className="text-gray-600 group-hover:text-gray-300" />
                  </button>
                  {invoice.offers > 0 && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200">
                      View Offers
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John!</h1>
            <p className="text-blue-100">Your business financing dashboard</p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2">
            <Upload size={20} />
            <span>Upload New Invoice</span>
          </button>
        </div>
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-cyan-300/20 rounded-full blur-xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 group-hover:bg-white/20 rounded-xl transition-all duration-300">
                  <Icon size={24} className="text-blue-500 group-hover:text-white" />
                </div>
                {stat.change && (
                  <span className={`text-sm font-medium ${
                    stat.positive ? 'text-green-500 group-hover:text-green-300' : 'text-red-500 group-hover:text-red-300'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <h3 className="text-gray-600 group-hover:text-gray-300 text-sm font-medium mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-white mb-1">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-gray-500 group-hover:text-gray-400 text-sm">{stat.subtitle}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notifications */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell size={24} className="text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
          </div>
          
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white transition-all duration-200 group">
                <div className={`w-2 h-2 rounded-full mt-3 ${
                  notification.type === 'offer' ? 'bg-green-400' :
                  notification.type === 'success' ? 'bg-blue-400' :
                  'bg-orange-400'
                }`}></div>
                <div className="flex-1">
                  <h3 className="text-gray-900 group-hover:text-white font-medium mb-1">{notification.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-300 text-sm mb-2">{notification.description}</p>
                  <span className="text-gray-500 group-hover:text-gray-400 text-xs">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText size={24} className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
            </div>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {invoices.slice(0, 3).map((invoice) => (
              <div 
                key={invoice.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 hover:text-white transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(invoice.status)}
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-white">{invoice.id}</p>
                    <p className="text-sm text-gray-600 group-hover:text-gray-300">{invoice.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 group-hover:text-white">{invoice.amount}</p>
                  {invoice.offers > 0 && (
                    <p className="text-sm text-blue-600 group-hover:text-blue-300">{invoice.offers} offers</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedInvoice) {
    return renderInvoiceDetail();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  InvoiceFlow
                </h1>
                <p className="text-gray-600 text-sm">SME Dashboard</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isUpload = item.id === 'upload';
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isUpload 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40' 
                        : isActive
                        ? 'bg-gray-200 text-gray-900 border border-gray-300'
                        : 'text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-gray-900 hover:via-gray-800 hover:to-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'invoices' && renderInvoicesTab()}
          {activeTab === 'upload' && renderInvoicesTab()}
          {activeTab === 'transactions' && renderTransactionsTab()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;