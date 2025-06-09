// Mortgage calculation service
export const mortgageService = {
  /**
   * Calculate monthly mortgage payment using standard amortization formula
   * @param {number} loanAmount - Principal loan amount
   * @param {number} annualInterestRate - Annual interest rate as percentage
   * @param {number} loanTermYears - Loan term in years
   * @returns {number} Monthly payment amount
   */
  calculateMonthlyPayment(loanAmount, annualInterestRate, loanTermYears) {
    // Handle edge cases
    if (loanAmount <= 0 || annualInterestRate < 0 || loanTermYears <= 0) {
      return 0;
    }

    // If interest rate is 0, simple division
    if (annualInterestRate === 0) {
      return loanAmount / (loanTermYears * 12);
    }

    // Convert annual rate to monthly decimal rate
    const monthlyInterestRate = (annualInterestRate / 100) / 12;
    
    // Total number of payments
    const numberOfPayments = loanTermYears * 12;
    
    // Standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    return monthlyPayment;
  },

  /**
   * Calculate total interest paid over loan term
   * @param {number} monthlyPayment - Monthly payment amount
   * @param {number} loanTermYears - Loan term in years
   * @param {number} loanAmount - Principal loan amount
   * @returns {number} Total interest paid
   */
  calculateTotalInterest(monthlyPayment, loanTermYears, loanAmount) {
    const totalPayments = monthlyPayment * loanTermYears * 12;
    return totalPayments - loanAmount;
  },

  /**
   * Calculate loan-to-value ratio
   * @param {number} loanAmount - Principal loan amount
   * @param {number} propertyValue - Property value
   * @returns {number} LTV ratio as percentage
   */
  calculateLTV(loanAmount, propertyValue) {
    if (propertyValue <= 0) return 0;
    return (loanAmount / propertyValue) * 100;
  },

  /**
   * Validate mortgage calculation inputs
   * @param {object} inputs - Object containing calculation inputs
   * @returns {object} Validation result with errors
   */
  validateInputs(inputs) {
    const errors = {};
    const { propertyPrice, downPayment, interestRate, loanTerm } = inputs;

    if (!propertyPrice || propertyPrice <= 0) {
      errors.propertyPrice = 'Property price must be greater than 0';
    }

    if (!downPayment || downPayment < 0) {
      errors.downPayment = 'Down payment cannot be negative';
    }

    if (downPayment >= propertyPrice) {
      errors.downPayment = 'Down payment cannot exceed property price';
    }

    if (!interestRate || interestRate < 0 || interestRate > 30) {
      errors.interestRate = 'Interest rate must be between 0% and 30%';
    }

    if (!loanTerm || loanTerm <= 0 || loanTerm > 50) {
      errors.loanTerm = 'Loan term must be between 1 and 50 years';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};