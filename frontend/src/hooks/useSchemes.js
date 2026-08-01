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
  if (!scheme) return { isEligible: false, score: 0, reason: 'Scheme not found' };
  let score = 100;
  let missing = [];
  
  if (scheme.supportedStates && !scheme.supportedStates.includes('All India') && profile.state && !scheme.supportedStates.includes(profile.state)) {
    score -= 50;
    missing.push('State mismatch');
  }
  
  const status = score >= 80 ? 'Eligible' : score >= 50 ? 'Partially Eligible' : 'Not Eligible';
  return { 
    isEligible: score > 50, 
    status,
    score, 
    missingDocuments: missing,
    reason: score > 50 ? 'You appear eligible based on your profile.' : 'You do not meet all criteria.'
  };
}
