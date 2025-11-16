// Watering frequency guide based on plant types (in days)
const WATERING_SCHEDULES = {
  // Succulents and cacti - very low water needs
  succulent: 14,
  cactus: 21,
  
  // Low water needs
  snake: 14,
  zz: 14,
  pothos: 7,
  
  // Medium water needs
  fern: 3,
  spider: 5,
  peace: 5,
  monstera: 7,
  fiddle: 7,
  
  // High water needs
  calathea: 2,
  fittonia: 2,
  maranta: 3,
  
  // Default for unknown plants
  default: 7,
};

// Get watering frequency based on plant name/species
export const getWateringFrequency = (plantName, species) => {
  if (!plantName && !species) return WATERING_SCHEDULES.default;
  
  const searchText = `${plantName || ''} ${species || ''}`.toLowerCase();
  
  // Check for specific plant types
  if (searchText.includes('succulent') || searchText.includes('cactus') || searchText.includes('cacti')) {
    return WATERING_SCHEDULES.succulent;
  }
  if (searchText.includes('snake plant') || searchText.includes('sansevieria')) {
    return WATERING_SCHEDULES.snake;
  }
  if (searchText.includes('zz plant') || searchText.includes('zamioculcas')) {
    return WATERING_SCHEDULES.zz;
  }
  if (searchText.includes('pothos') || searchText.includes('epipremnum')) {
    return WATERING_SCHEDULES.pothos;
  }
  if (searchText.includes('fern')) {
    return WATERING_SCHEDULES.fern;
  }
  if (searchText.includes('spider plant') || searchText.includes('chlorophytum')) {
    return WATERING_SCHEDULES.spider;
  }
  if (searchText.includes('peace lily') || searchText.includes('spathiphyllum')) {
    return WATERING_SCHEDULES.peace;
  }
  if (searchText.includes('monstera')) {
    return WATERING_SCHEDULES.monstera;
  }
  if (searchText.includes('fiddle') || searchText.includes('ficus lyrata')) {
    return WATERING_SCHEDULES.fiddle;
  }
  if (searchText.includes('calathea')) {
    return WATERING_SCHEDULES.calathea;
  }
  if (searchText.includes('fittonia') || searchText.includes('nerve plant')) {
    return WATERING_SCHEDULES.fittonia;
  }
  if (searchText.includes('maranta') || searchText.includes('prayer plant')) {
    return WATERING_SCHEDULES.maranta;
  }
  
  return WATERING_SCHEDULES.default;
};

// Calculate next watering date
export const getNextWateringDate = (lastWatered, frequencyDays) => {
  if (!lastWatered) return null;
  const lastWateredDate = new Date(lastWatered);
  const nextWatering = new Date(lastWateredDate);
  nextWatering.setDate(nextWatering.getDate() + frequencyDays);
  return nextWatering;
};

// Check if plant can be watered (cooldown check)
export const canWaterPlant = (lastWatered, frequencyDays) => {
  if (!lastWatered) return true;
  
  const lastWateredDate = new Date(lastWatered);
  const now = new Date();
  const daysSinceWatered = Math.floor(
    (now - lastWateredDate) / (1000 * 60 * 60 * 24)
  );
  
  // Allow watering if at least 80% of the frequency has passed
  return daysSinceWatered >= Math.floor(frequencyDays * 0.8);
};

// Get time until next watering
export const getTimeUntilNextWatering = (lastWatered, frequencyDays) => {
  if (!lastWatered) return null;
  
  const nextWatering = getNextWateringDate(lastWatered, frequencyDays);
  const now = new Date();
  const diffMs = nextWatering - now;
  
  if (diffMs <= 0) return { ready: true, days: 0, hours: 0 };
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return { ready: false, days, hours };
};

// Format next watering message
export const formatNextWateringMessage = (lastWatered, frequencyDays) => {
  if (!lastWatered) {
    return 'Ready to water';
  }
  
  const timeUntil = getTimeUntilNextWatering(lastWatered, frequencyDays);
  
  if (timeUntil.ready) {
    return 'Ready to water';
  }
  
  if (timeUntil.days > 0) {
    return `Next watering in ${timeUntil.days} day${timeUntil.days > 1 ? 's' : ''}`;
  }
  
  if (timeUntil.hours > 0) {
    return `Next watering in ${timeUntil.hours} hour${timeUntil.hours > 1 ? 's' : ''}`;
  }
  
  return 'Ready to water';
};

