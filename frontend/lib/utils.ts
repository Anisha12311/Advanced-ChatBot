export const formatedDate = (dateStr: string) => {
  const d = new Date(dateStr);
  console.log(d, "date");
  const date = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date}, ${time}`;
};

export const timeAgo = (timeStamp: string) => {
  const date = Date.now();
  const differ = date - new Date(timeStamp).getTime();

  const diffSeconds = Math.floor(differ / 1000);
  const diffMin = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
  }

  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }

  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
};
