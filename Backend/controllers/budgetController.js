const Budget = require('../models/Budget');

const optimizeBudget = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const {
      dependents,
      occupation,
      cityTier,
      rent,
      loanRepayment,
      insurance
    } = req.body;

    // Validate input
    if (!dependents || !occupation || !cityTier || !rent || !loanRepayment || !insurance) {
      console.log('Validation failed:', { dependents, occupation, cityTier, rent, loanRepayment, insurance });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate total fixed expenses
    const totalFixedExpenses = Number(rent) + Number(loanRepayment) + Number(insurance);
    console.log('Total fixed expenses:', totalFixedExpenses);

    // Calculate recommended budget allocations based on occupation and city tier
    const recommendedAllocations = {
      housing: calculateHousingAllocation(rent, cityTier),
      savings: calculateSavingsAllocation(totalFixedExpenses, occupation),
      investments: calculateInvestmentAllocation(totalFixedExpenses, occupation),
      discretionary: calculateDiscretionaryAllocation(totalFixedExpenses, dependents, cityTier)
    };
    console.log('Recommended allocations:', recommendedAllocations);

    // Add recommendations
    const recommendations = generateRecommendations(recommendedAllocations, totalFixedExpenses, occupation, cityTier);
    console.log('Generated recommendations:', recommendations);

    const response = {
      recommendedAllocations,
      recommendations,
      totalFixedExpenses
    };
    console.log('Sending response:', response);
    
    res.json(response);

  } catch (error) {
    console.error('Budget optimization error:', error);
    res.status(500).json({ message: 'Error optimizing budget: ' + error.message });
  }
};


const saveBudget = async (req, res) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save budget' });
  }
};

const getLatestBudget = async (req, res) => {
  try {
    const latestBudget = await Budget.findOne().sort({ _id: -1 });
    if (!latestBudget) {
      return res.status(404).json({ message: 'No budget found' });
    }
    res.json(latestBudget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest budget' });
  }
};

// Helper functions for budget calculations
function calculateHousingAllocation(rent, cityTier) {
  const baseAllocation = Number(rent);
  // Adjust housing allocation based on city tier
  const cityTierMultiplier = {
    'Tier_1': 1.3, // Higher cost of living
    'Tier_2': 1.15,
    'Tier_3': 1.0
  };
  return baseAllocation * cityTierMultiplier[cityTier];
}

function calculateSavingsAllocation(totalExpenses, occupation) {
  // Base savings percentages by occupation
  const basePercentage = {
    'Student': 0.15, // 15% for students
    'Employee': 0.25, // 25% for employees
    'Freelancer': 0.20 // 20% for freelancers
  };
  return totalExpenses * basePercentage[occupation];
}

function calculateInvestmentAllocation(totalExpenses, occupation) {
  // Investment percentages by occupation
  const basePercentage = {
    'Student': 0.05, // 5% for students
    'Employee': 0.15, // 15% for employees
    'Freelancer': 0.10 // 10% for freelancers
  };
  return totalExpenses * basePercentage[occupation];
}

function calculateDiscretionaryAllocation(totalExpenses, dependents, cityTier) {
  // Base discretionary spending percentage
  const basePercentage = 0.25; // 25% base discretionary spending
  
  // Adjust for number of dependents
  const dependentMultiplier = 1 + (Number(dependents) * 0.15); // 15% increase per dependent
  
  // Adjust for city tier
  const cityTierMultiplier = {
    'Tier_1': 1.25, // Higher cost of living
    'Tier_2': 1.15,
    'Tier_3': 1.0
  };
  
  return totalExpenses * basePercentage * dependentMultiplier * cityTierMultiplier[cityTier];
}

function generateRecommendations(allocations, totalFixedExpenses, occupation, cityTier) {
  const recommendations = [];

  // Housing recommendations
  const housingPercentage = (allocations.housing / totalFixedExpenses) * 100;
  if (housingPercentage > 40) {
    recommendations.push('Your housing costs are high relative to your total expenses. Consider finding more affordable housing or sharing accommodation.');
  } else if (housingPercentage < 20) {
    recommendations.push('Your housing costs are relatively low. This is good for your budget, but ensure you\'re not compromising on essential amenities.');
  }

  // Savings recommendations
  const savingsPercentage = (allocations.savings / totalFixedExpenses) * 100;
  if (savingsPercentage < 15) {
    recommendations.push('Your savings rate is below recommended levels. Try to increase your savings to build a stronger financial foundation.');
  } else if (savingsPercentage > 30) {
    recommendations.push('You have a strong savings rate. Consider diversifying your savings into different investment vehicles.');
  }

  // Investment recommendations
  const investmentPercentage = (allocations.investments / totalFixedExpenses) * 100;
  if (occupation === 'Employee' && investmentPercentage < 10) {
    recommendations.push('Consider increasing your investment contributions, especially if your employer offers matching benefits.');
  } else if (occupation === 'Freelancer' && investmentPercentage < 8) {
    recommendations.push('As a freelancer, it\'s important to build a robust investment portfolio. Consider increasing your investment allocation.');
  }

  // City-specific recommendations
  if (cityTier === 'Tier_1') {
    recommendations.push('Living in a Tier 1 city requires careful budget management. Consider using public transportation and cooking at home to save money.');
  } else if (cityTier === 'Tier_2') {
    recommendations.push('You\'re in a Tier 2 city. This offers a good balance between cost of living and quality of life. Consider investing in local opportunities.');
  }

  // General recommendations
  recommendations.push('Build an emergency fund with at least 3-6 months of expenses.');
  recommendations.push('Review your insurance coverage to ensure it meets your needs and provides adequate protection.');
  
  // Occupation-specific recommendations
  if (occupation === 'Student') {
    recommendations.push('Focus on building good financial habits early. Consider starting with small investments to learn about the market.');
  } else if (occupation === 'Employee') {
    recommendations.push('Take advantage of employer benefits like health insurance, retirement plans, and any matching contributions.');
  } else if (occupation === 'Freelancer') {
    recommendations.push('As a freelancer, ensure you have adequate health insurance and retirement planning, as these aren\'t typically provided by clients.');
  }

  return recommendations;
}

module.exports = {
  optimizeBudget,
  saveBudget,
  getLatestBudget
}; 