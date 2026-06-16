export function generateCompanyId() {
  const random = Math.random()
    .toString(36)
    .substring(2, 10);

  return "EMP-" + random.toUpperCase();
}