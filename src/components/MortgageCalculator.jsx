import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { mortgageService } from '../services';

const MortgageCalculator = ({ property }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [propertyPrice, setPropertyPrice] = useState(property.price);
  const [downPayment, setDownPayment] = useState(20);
  const [downPaymentMode, setDownPaymentMode] = useState('percentage'); // 'percentage' or 'amount'
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    calculatePayment();
  }, [propertyPrice, downPayment, downPaymentMode, interestRate, loanTerm]);

  const validateInputs = () => {
    const newErrors = {};

    if (!propertyPrice || propertyPrice <= 0) {
      newErrors.propertyPrice = 'Property price must be greater than 0';
    }

    if (downPaymentMode === 'percentage') {
      if (!downPayment || downPayment < 0 || downPayment > 100) {
        newErrors.downPayment = 'Down payment must be between 0% and 100%';
      }
    } else {
      if (!downPayment || downPayment < 0 || downPayment >= propertyPrice) {
        newErrors.downPayment = 'Down payment must be less than property price';
      }
    }

    if (!interestRate || interestRate < 0 || interestRate > 30) {
      newErrors.interestRate = 'Interest rate must be between 0% and 30%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePayment = () => {
    if (!validateInputs()) {
      setMonthlyPayment(0);
      return;
    }

    const downPaymentAmount = downPaymentMode === 'percentage' 
      ? (propertyPrice * downPayment) / 100 
      : downPayment;
    
    const loanAmount = propertyPrice - downPaymentAmount;
    
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      return;
    }

    const payment = mortgageService.calculateMonthlyPayment(
      loanAmount,
      interestRate,
      loanTerm
    );
    
    setMonthlyPayment(payment);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyDetailed = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleNumericInput = (value, setter, field) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) || value === '') {
      setter(value === '' ? '' : numericValue);
    }
  };

  const getDownPaymentAmount = () => {
    return downPaymentMode === 'percentage' 
      ? (propertyPrice * downPayment) / 100 
      : downPayment;
  };

  const getLoanAmount = () => {
    return propertyPrice - getDownPaymentAmount();
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-surface-50 mb-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="Calculator" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">Mortgage Calculator</h3>
            <p className="text-sm text-gray-600">Calculate your estimated monthly payment</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
        </motion.div>
      </button>

      {/* Calculator Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Fields */}
                <div className="space-y-4">
                  {/* Property Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={propertyPrice ? propertyPrice.toLocaleString() : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, '');
                          handleNumericInput(value, setPropertyPrice, 'propertyPrice');
                        }}
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.propertyPrice ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {errors.propertyPrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.propertyPrice}</p>
                    )}
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Down Payment
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => setDownPaymentMode('percentage')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          downPaymentMode === 'percentage'
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        %
                      </button>
                      <button
                        onClick={() => setDownPaymentMode('amount')}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          downPaymentMode === 'amount'
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        $
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {downPaymentMode === 'percentage' ? '%' : '$'}
                      </span>
                      <input
                        type="text"
                        value={downPayment || ''}
                        onChange={(e) => handleNumericInput(e.target.value, setDownPayment, 'downPayment')}
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.downPayment ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {errors.downPayment && (
                      <p className="text-red-500 text-xs mt-1">{errors.downPayment}</p>
                    )}
                    {downPaymentMode === 'percentage' && downPayment && (
                      <p className="text-xs text-gray-600 mt-1">
                        Amount: {formatCurrency(getDownPaymentAmount())}
                      </p>
                    )}
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Interest Rate
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={interestRate || ''}
                        onChange={(e) => handleNumericInput(e.target.value, setInterestRate, 'interestRate')}
                        className={`w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.interestRate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                    </div>
                    {errors.interestRate && (
                      <p className="text-red-500 text-xs mt-1">{errors.interestRate}</p>
                    )}
                  </div>

                  {/* Loan Term */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Term
                    </label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value={15}>15 years</option>
                      <option value={20}>20 years</option>
                      <option value={30}>30 years</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payment</h4>
                  
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrencyDetailed(monthlyPayment)}
                    </div>
                    <p className="text-sm text-gray-600">Estimated monthly payment</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-medium">{formatCurrency(getLoanAmount())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Down Payment:</span>
                      <span className="font-medium">{formatCurrency(getDownPaymentAmount())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-medium">{interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Term:</span>
                      <span className="font-medium">{loanTerm} years</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <ApperIcon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-yellow-800">
                        <p className="font-medium mb-1">Estimate Only</p>
                        <p>This calculation is an estimate and does not include property taxes, homeowners insurance, PMI, HOA fees, or other costs that may be required.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MortgageCalculator;