import { useState, useEffect } from 'react';
import api from '../services/api';

const REAL_SCHEMES_FALLBACK = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Financial Support',
    description: 'Direct income support of ₹6,000 per year provided in 3 equal installments of ₹2,000 to eligible farmer families across India through Direct Benefit Transfer (DBT).',
    benefits: [
      '₹6,000 annually in 3 installments of ₹2,000.',
      'Direct Benefit Transfer (DBT) into bank accounts.',
      'Sowing season financial assistance.'
    ],
    supportedStates: ['All India'],
    requiredDocuments: ['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Passbook', 'Mobile Number'],
    applicationUrl: 'https://pmkisan.gov.in',
    minLandSizeAcres: 0,
    maxLandSizeAcres: null,
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana (Crop Insurance)',
    title: 'PM Fasal Bima Yojana (Crop Insurance)',
    category: 'Crop Insurance',
    description: 'Comprehensive risk insurance covering crop losses due to drought, flood, pests, and natural calamities with subsidized premiums (2% Kharif, 1.5% Rabi).',
    benefits: [
      'Full financial cover for pre-sowing to post-harvest crop damage.',
      'Subsidized premium rates (1.5% - 2%).',
      'Satellite-based fast claim settlement.'
    ],
    supportedStates: ['All India'],
    requiredDocuments: ['Aadhaar Card', 'Land Possession Certificate', 'Bank Account Details', 'Sowing Certificate'],
    applicationUrl: 'https://pmfby.gov.in',
    minLandSizeAcres: 0,
    maxLandSizeAcres: null,
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    title: 'Kisan Credit Card (KCC)',
    category: 'Credit & Loan',
    description: 'Hassle-free short-term agricultural credit up to ₹3 Lakh at a subsidized interest rate of 4% per annum upon prompt repayment.',
    benefits: [
      'Credit limit up to ₹3 Lakh at effective 4% interest.',
      'Collateral-free loans up to ₹1.60 Lakh.',
      'Includes animal husbandry and fisheries.'
    ],
    supportedStates: ['All India'],
    requiredDocuments: ['KCC Application Form', 'Aadhaar Card', 'Land Revenue Record', 'Passport Photographs'],
    applicationUrl: 'https://pmkisan.gov.in/KCC.aspx',
    minLandSizeAcres: 0,
    maxLandSizeAcres: null,
  },
  {
    id: 'pmksy',
    name: 'PM Krishi Sinchai Yojana (Irrigation)',
    title: 'PM Krishi Sinchai Yojana (Irrigation)',
    category: 'Irrigation & Infrastructure',
    description: 'Subsidy up to 55% for micro-irrigation systems (Drip and Sprinkler) under "Per Drop More Crop" to improve water use efficiency.',
    benefits: [
      '55% subsidy for small/marginal farmers on Drip/Sprinkler systems.',
      'Farm pond and water storage construction support.',
      'Boosts crop yield by up to 40%.'
    ],
    supportedStates: ['All India'],
    requiredDocuments: ['Aadhaar Card', '7/12 Land Record Extract', 'Water Source Proof', 'Bank Passbook'],
    applicationUrl: 'https://pmksy.gov.in',
    minLandSizeAcres: 0.2,
    maxLandSizeAcres: null,
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    title: 'Soil Health Card Scheme',
    category: 'Soil & Nutrient Management',
    description: 'Free soil testing report issued every 3 years analyzing 12 essential nutrients to advise balanced crop-specific fertilizer usage.',
    benefits: [
      'Free 12-parameter soil testing.',
      'Crop-wise fertilizer dosage advisory.',
      'Saves ₹1,000–₹3,000 per acre on fertilizer costs.'
    ],
    supportedStates: ['All India'],
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Proof', 'Mobile Number'],
    applicationUrl: 'https://soilhealth.dac.gov.in',
    minLandSizeAcres: 0,
    maxLandSizeAcres: null,
  }
];

export function useSchemes() {
  const [schemes, setSchemes] = useState(REAL_SCHEMES_FALLBACK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.schemes.getAll().then(res => {
      if (res && res.data && res.data.length > 0) {
        setSchemes(res.data.map(s => ({ ...s, id: s._id || s.id, title: s.name || s.title })));
      }
    }).catch(err => {
      console.warn('Backend server offline, using real scheme fallback dataset:', err);
    });
  }, []);

  return { schemes, loading };
}

export function getBookmarkedSchemeIds() {
  try {
    return JSON.parse(localStorage.getItem('krishi_bookmarks') || '[]');
  } catch(e) { return []; }
}

export function toggleBookmarkSchemeId(id) {
  let marks = getBookmarkedSchemeIds();
  if (marks.includes(id)) {
    marks = marks.filter(i => i !== id);
  } else {
    marks.push(id);
  }
  localStorage.setItem('krishi_bookmarks', JSON.stringify(marks));
  return marks;
}

export function evaluateEligibility(profile, scheme) {
  if (!scheme) {
    return {
      isEligible: false,
      status: 'Not Eligible',
      score: 0,
      missingDocs: ['Scheme selection missing'],
      reasons: [{ rule: 'Scheme Selected', passed: false, message: 'Please select a valid scheme from the dropdown.' }],
    };
  }

  let score = 100;
  const reasons = [];
  const missingDocs = [];

  // Rule 1: State Match
  if (
    scheme.supportedStates &&
    !scheme.supportedStates.includes('All India') &&
    profile.state &&
    !scheme.supportedStates.includes(profile.state)
  ) {
    score -= 40;
    reasons.push({ rule: 'State Availability', passed: false, message: `This scheme is not available in ${profile.state}.` });
    missingDocs.push('State Residency Requirement');
  } else {
    reasons.push({ rule: 'State Availability', passed: true, message: 'Your state is supported for this scheme.' });
  }

  // Rule 2: Landholding Limit
  const landNum = parseFloat(profile.landSize) || 0;
  if (scheme.minLandSizeAcres !== undefined && scheme.minLandSizeAcres !== null && landNum < scheme.minLandSizeAcres) {
    score -= 30;
    reasons.push({ rule: 'Minimum Land Size', passed: false, message: `Requires at least ${scheme.minLandSizeAcres} acres (You entered ${landNum} acres).` });
  } else {
    reasons.push({ rule: 'Land Eligibility', passed: true, message: 'Your landholding meets scheme guidelines.' });
  }

  // Rule 3: Aadhaar & Bank Linking
  if (!profile.aadhaarLinked) {
    score -= 15;
    reasons.push({ rule: 'Aadhaar Linkage', passed: false, message: 'Aadhaar must be linked with mobile number.' });
    missingDocs.push('Aadhaar Verification');
  } else {
    reasons.push({ rule: 'Aadhaar Linkage', passed: true, message: 'Aadhaar linkage verified.' });
  }

  if (!profile.bankLinked) {
    score -= 15;
    reasons.push({ rule: 'Bank DBT Linkage', passed: false, message: 'Bank account must be Aadhaar seeded for Direct Benefit Transfer.' });
    missingDocs.push('DBT Enabled Bank Account');
  } else {
    reasons.push({ rule: 'Bank DBT Linkage', passed: true, message: 'Bank DBT status active.' });
  }

  const finalScore = Math.max(0, score);
  const status = finalScore >= 80 ? 'Eligible' : finalScore >= 50 ? 'Partially Eligible' : 'Not Eligible';

  return {
    isEligible: finalScore >= 50,
    status,
    score: finalScore,
    reasons,
    missingDocs,
  };
}
