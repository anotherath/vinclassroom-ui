// Shared user color utilities

// Predefined color palette for usernames (like Discord/Telegram)
// Bright colors visible in both dark and light mode
const usernameColors = [
  "#ff6b6b", // Bright Red
  "#ffa94d", // Bright Orange
  "#ffd43b", // Bright Yellow
  "#69db7c", // Bright Green
  "#38d9a9", // Bright Teal
  "#74c0fc", // Bright Blue
  "#b197fc", // Bright Purple
  "#f783ac", // Bright Pink
  "#66d9e8", // Bright Cyan
  "#e599f7", // Bright Rose
  "#9775fa", // Bright Indigo
  "#8ce99a", // Bright Mint
  "#ffe066", // Bright Gold
  "#a5d8ff", // Bright Sky
  "#c4b5fd", // Bright Lavender
  "#ff8787", // Bright Coral
];

/**
 * Generate a consistent color for a username
 * @param {string} name - The username
 * @returns {string} Hex color code
 */
export function getUserColor(name) {
  // Check if user has set a custom color for "You"
  if (name === "You") {
    const savedColor = localStorage.getItem("usernameColor");
    if (savedColor) return savedColor;
  }

  // Generate a hash-based color for consistent assignment
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % usernameColors.length;
  return usernameColors[index];
}
