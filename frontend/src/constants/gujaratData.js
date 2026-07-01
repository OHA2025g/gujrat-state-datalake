// Frontend-side data helpers for consistent Gujarat context across screens
export const GJ_DISTRICTS = [
  'Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Junagadh',
  'Gandhinagar','Anand','Bharuch','Mehsana','Kheda','Sabarkantha','Banaskantha',
  'Kutch','Panchmahal','Dahod','Valsad','Navsari','Amreli','Porbandar','Patan',
  'Surendranagar','Tapi','Aravalli','Botad','Chhota Udepur','Devbhoomi Dwarka',
  'Gir Somnath','Mahisagar','Morbi','Narmada','Dang',
];

export const CHART_COLORS = [
  '#1E3A8A','#4F46E5','#0891B2','#059669','#D97706',
  '#DC2626','#7C3AED','#DB2777','#2563EB','#0D9488',
];

const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

export const seedSeries = (labels, min = 100, max = 800) =>
  labels.map((label) => ({ label, value: rand(min, max) }));

export const monthSeries = (n = 8, base = 400) => {
  const months = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
  return months.slice(0, n).map((m, i) => ({ month: m, value: base + rand(-80, 200) + i * 40 }));
};

export const humanNumber = (n) => {
  if (n == null) return '—';
  if (Math.abs(n) >= 1e7) return `${(n / 1e7).toFixed(2)} Cr`;
  if (Math.abs(n) >= 1e5) return `${(n / 1e5).toFixed(2)} L`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
};
