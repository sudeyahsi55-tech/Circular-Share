export const categories = [
  { id: 'all', name: 'Tümü', icon: '📋', color: '#6B7280' },
  { id: 'tools', name: 'Aletler', icon: '🔧', color: '#EF4444' },
  { id: 'outdoor', name: 'Outdoor', icon: '⛺', color: '#10B981' },
  { id: 'electronics', name: 'Elektronik', icon: '💻', color: '#3B82F6' },
  { id: 'sports', name: 'Spor', icon: '⚽', color: '#F59E0B' },
  { id: 'kitchen', name: 'Mutfak', icon: '🍳', color: '#EC4899' },
  { id: 'books', name: 'Kitaplar', icon: '📚', color: '#8B5CF6' },
  { id: 'garden', name: 'Bahçe', icon: '🌱', color: '#059669' },
  { id: 'music', name: 'Müzik', icon: '🎸', color: '#F97316' },
  { id: 'other', name: 'Diğer', icon: '📦', color: '#6B7280' },
];

export const badges = [
  { id: 'first_share', name: 'İlk Paylaşım', icon: '🌟', description: 'İlk eşyanı paylaştın!', color: '#F59E0B' },
  { id: 'helper', name: 'Yardımsever', icon: '🤝', description: '5 eşya paylaştın!', color: '#10B981' },
  { id: 'eco_warrior', name: 'Eko Savaşçı', icon: '🌍', description: '10 başarılı iade!', color: '#3B82F6' },
  { id: 'community_star', name: 'Topluluk Yıldızı', icon: '⭐', description: '20 paylaşım tamamladın!', color: '#EF4444' },
  { id: 'sustainability_hero', name: 'Sürdürülebilirlik Kahramanı', icon: '🦸', description: '50 puan kazandın!', color: '#8B5CF6' },
  { id: 'neighbor_love', name: 'Komşu Sevgisi', icon: '❤️', description: '5 farklı komşuyla paylaşım!', color: '#EC4899' },
  { id: 'speed_return', name: 'Hızlı İade', icon: '⚡', description: 'Zamanında iade ettin!', color: '#F97316' },
  { id: 'trusted', name: 'Güvenilir Üye', icon: '🛡️', description: '4.5+ ortalama puan!', color: '#059669' },
];

export const getCategoryById = (id) => {
  return categories.find(c => c.id === id) || categories[categories.length - 1];
};

export const getBadgeById = (id) => {
  return badges.find(b => b.id === id);
};