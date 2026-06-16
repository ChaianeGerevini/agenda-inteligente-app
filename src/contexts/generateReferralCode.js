export function generateReferralCode(name = "") {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const prefix = name?.substring(0, 3).toUpperCase() || "USR";

  return `${prefix}${random}`;
}