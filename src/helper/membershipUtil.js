export function calculateMembershipExpiry(startDate) {
    if (!startDate) return null;

    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + 30);

    return expiryDate;
}