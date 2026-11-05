export const CURRENT_CALENDAR_YEAR = new Date().getFullYear();

export function getAcademicStanding(startYear: number, endYear: number, currentYear = CURRENT_CALENDAR_YEAR) {
  if (!Number.isInteger(startYear) || !Number.isInteger(endYear) || startYear < 2000 || endYear < startYear || endYear > currentYear + 10) return "Enter a valid batch start and end year.";
  if (currentYear < startYear) return `Starts in ${startYear - currentYear} ${startYear - currentYear === 1 ? "year" : "years"} (${startYear}–${endYear})`;
  if (currentYear > endYear) return `Passed out in ${endYear}`;
  const year = currentYear - startYear + 1;
  const suffix = year % 100 >= 11 && year % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[year % 10] ?? "th";
  return `${year}${suffix} year (${startYear}–${endYear})`;
}
