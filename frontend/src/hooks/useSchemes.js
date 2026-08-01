import { useState, useEffect } from 'react';
import api from '../services/api';

export function useSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.schemes.getAll().then(res => {
      // Backend returns { success: true, data: [...] }
      setSchemes(res.data || []);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching schemes:', err);
      setLoading(false);
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
  
  return { 
    isEligible: score > 50, 
    score, 
    missingDocuments: missing,
    reason: score > 50 ? 'You appear eligible based on your profile.' : 'You do not meet all criteria.'
  };
}
