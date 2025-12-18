import { formatDistanceToNow } from 'date-fns';

const getTimeAgo = (postDate) => {
  const date = new Date(postDate);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  return timeAgo;
};

export default getTimeAgo;
