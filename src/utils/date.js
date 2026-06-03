import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const timeAgo = (date) => {
  if (!date) return 'Never';
  return dayjs(date).fromNow();
};

export const getExpiryInfo = (expiryDate) => {
  if (!expiryDate) return { text: 'Never Expires', status: 'active', remaining: null };
  
  const now = dayjs();
  const expiry = dayjs(expiryDate);
  
  if (expiry.isBefore(now)) {
    return { text: 'Expired', status: 'expired', remaining: 0 };
  }
  
  const daysRemaining = expiry.diff(now, 'day');
  if (daysRemaining === 0) {
    return { text: 'Expires Today', status: 'active', remaining: daysRemaining };
  } else if (daysRemaining === 1) {
    return { text: 'Expires Tomorrow', status: 'active', remaining: daysRemaining };
  } else {
    return { text: `Expires in ${daysRemaining} days`, status: 'active', remaining: daysRemaining };
  }
};
