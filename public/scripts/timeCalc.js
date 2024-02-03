function timeAgo(date) {
    const now = new Date();
    const diffMilliseconds = now - date;

    // Calculate the difference in days
    const days = Math.floor(diffMilliseconds / (24 * 60 * 60 * 1000));

    if (days === 0) {
        // If it's the same day, show the time difference
        const hours = Math.floor(diffMilliseconds / (60 * 60 * 1000));
        return `${hours} hours ago`;
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (days < 365) {
        // If it's less than a year, show the difference in months
        const months = Math.floor(days / 30);
        return `${months} months ago`;
    } else {
        // If it's more than a year, show the difference in years
        const years = Math.floor(days / 365);
        return `${years} years ago`;
    }
}
