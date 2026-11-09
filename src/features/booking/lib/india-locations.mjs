export const indiaStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
export function normalizeStates(states) {
  const names = states
    .map((state) => (typeof state === "string" ? state : state.name))
    .filter(Boolean)
    .map((name) =>
      ["Dadra and Nagar Haveli", "Daman and Diu"].includes(name)
        ? "Dadra and Nagar Haveli and Daman and Diu"
        : name,
    );
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}
export function uniqueCities(values) {
  const seen = new Set();
  return values
    .filter((value) => {
      if (typeof value !== "string" || !value.trim()) return false;
      const key = value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.localeCompare(b));
}
export const cityApiStates = (state) =>
  state === "Dadra and Nagar Haveli and Daman and Diu"
    ? ["Dadra and Nagar Haveli", "Daman and Diu"]
    : [state];
