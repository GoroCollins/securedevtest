import zxcvbn from 'zxcvbn';

export const estimatePasswordStrength = (password) => {
  const result = zxcvbn(password);
  const score = result.score;
  switch (score) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Reasonable';
    case 3:
      return 'Strong';
    case 4:
      return 'Very Strong';
    default:
      return 'Unknown';
  }
};

export const getPasswordSuggestions = (password) => {
  const result = zxcvbn(password);
  return result.feedback.suggestions;
};
