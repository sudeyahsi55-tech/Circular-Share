import AsyncStorage from '@react-native-async-storage/async-storage';

export const LocalDB = {
  saveUser: async (user) => {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      users.push(user);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (e) {
      console.error('Kayıt hatası:', e);
      throw e;
    }
  },

  loginUser: async (email, password) => {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      throw new Error('E-posta veya şifre hatalı');
    } catch (e) {
      throw e;
    }
  },

  getCurrentUser: async () => {
    try {
      const user = await AsyncStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('currentUser');
  },

  addItem: async (item) => {
    try {
      const items = JSON.parse(await AsyncStorage.getItem('items') || '[]');
      items.push(item);
      await AsyncStorage.setItem('items', JSON.stringify(items));
      return item;
    } catch (e) {
      throw e;
    }
  },

  getItems: async () => {
    try {
      return JSON.parse(await AsyncStorage.getItem('items') || '[]');
    } catch (e) {
      return [];
    }
  },

  updateItem: async (itemId, updates) => {
    try {
      let items = JSON.parse(await AsyncStorage.getItem('items') || '[]');
      items = items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      await AsyncStorage.setItem('items', JSON.stringify(items));
    } catch (e) {
      throw e;
    }
  },

  deleteItem: async (itemId) => {
    try {
      let items = JSON.parse(await AsyncStorage.getItem('items') || '[]');
      items = items.filter(item => item.id !== itemId);
      await AsyncStorage.setItem('items', JSON.stringify(items));
    } catch (e) {
      throw e;
    }
  },

  sendMessage: async (chatId, message) => {
    try {
      const chats = JSON.parse(await AsyncStorage.getItem('chats') || '{}');
      if (!chats[chatId]) chats[chatId] = [];
      chats[chatId].push(message);
      await AsyncStorage.setItem('chats', JSON.stringify(chats));
    } catch (e) {
      throw e;
    }
  },

  getMessages: async (chatId) => {
    try {
      const chats = JSON.parse(await AsyncStorage.getItem('chats') || '{}');
      return chats[chatId] || [];
    } catch (e) {
      return [];
    }
  },

  createRequest: async (request) => {
    try {
      const requests = JSON.parse(await AsyncStorage.getItem('requests') || '[]');
      requests.push(request);
      await AsyncStorage.setItem('requests', JSON.stringify(requests));
      return request;
    } catch (e) {
      throw e;
    }
  },

  getRequests: async (userId) => {
    try {
      const requests = JSON.parse(await AsyncStorage.getItem('requests') || '[]');
      return requests.filter(r => r.ownerId === userId || r.requesterId === userId);
    } catch (e) {
      return [];
    }
  },

  updateRequest: async (requestId, updates) => {
    try {
      let requests = JSON.parse(await AsyncStorage.getItem('requests') || '[]');
      requests = requests.map(r =>
        r.id === requestId ? { ...r, ...updates } : r
      );
      await AsyncStorage.setItem('requests', JSON.stringify(requests));
    } catch (e) {
      throw e;
    }
  },

  addBadge: async (userId, badge) => {
    try {
      const badges = JSON.parse(await AsyncStorage.getItem(`badges_${userId}`) || '[]');
      if (!badges.find(b => b.id === badge.id)) {
        badges.push(badge);
        await AsyncStorage.setItem(`badges_${userId}`, JSON.stringify(badges));
      }
      return badges;
    } catch (e) {
      return [];
    }
  },

  getBadges: async (userId) => {
    try {
      return JSON.parse(await AsyncStorage.getItem(`badges_${userId}`) || '[]');
    } catch (e) {
      return [];
    }
  },

  updateStats: async (userId, stat) => {
    try {
      const stats = JSON.parse(await AsyncStorage.getItem(`stats_${userId}`) || '{"shared":0,"borrowed":0,"returned":0,"points":0}');
      stats[stat] = (stats[stat] || 0) + 1;
      if (stat === 'returned') stats.points += 50;
      if (stat === 'shared') stats.points += 30;
      await AsyncStorage.setItem(`stats_${userId}`, JSON.stringify(stats));
      return stats;
    } catch (e) {
      return {};
    }
  },

  getStats: async (userId) => {
    try {
      return JSON.parse(await AsyncStorage.getItem(`stats_${userId}`) || '{"shared":0,"borrowed":0,"returned":0,"points":0}');
    } catch (e) {
      return { shared: 0, borrowed: 0, returned: 0, points: 0 };
    }
  },

  loadDemoData: async (currentUserId) => {
    try {
      const existingItems = JSON.parse(await AsyncStorage.getItem('items') || '[]');
      if (existingItems.length > 0) return;

      const demoItems = [
        {
          id: 'demo1',
          name: 'Bosch Matkap',
          description: 'Profesyonel darbesiz matkap. Duvar delme, vida çakma için ideal. Uç seti dahil.',
          category: 'tools',
          condition: 'İyi',
          priceType: 'free',
          priceAmount: 0,
          duration: '1 gün',
          images: [],
          ownerId: 'demouser1',
          ownerName: 'Ahmet Yılmaz',
          ownerAvatar: '👨‍🔧',
          latitude: 41.0082,
          longitude: 28.9784,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 4.8,
          totalRentals: 12,
          createdAt: new Date().toISOString(),
          distance: '150m'
        },
        {
          id: 'demo2',
          name: 'Kamp Çadırı (4 Kişilik)',
          description: 'Su geçirmez, 4 mevsim çadır. Kamp malzemeleri ile birlikte verilebilir.',
          category: 'outdoor',
          condition: 'Çok İyi',
          priceType: 'daily',
          priceAmount: 50,
          duration: 'Haftalık',
          images: [],
          ownerId: 'demouser2',
          ownerName: 'Zeynep Kaya',
          ownerAvatar: '👩‍🎨',
          latitude: 41.0092,
          longitude: 28.9794,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 4.9,
          totalRentals: 8,
          createdAt: new Date().toISOString(),
          distance: '300m'
        },
        {
          id: 'demo3',
          name: 'Alüminyum Merdiven (3m)',
          description: '3 metre uzunluğunda katlanır alüminyum merdiven. Hafif ve dayanıklı.',
          category: 'tools',
          condition: 'İyi',
          priceType: 'free',
          priceAmount: 0,
          duration: '1 gün',
          images: [],
          ownerId: 'demouser3',
          ownerName: 'Mehmet Demir',
          ownerAvatar: '👨‍💼',
          latitude: 41.0072,
          longitude: 28.9774,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 4.5,
          totalRentals: 15,
          createdAt: new Date().toISOString(),
          distance: '200m'
        },
        {
          id: 'demo4',
          name: 'Bisiklet Tamir Seti',
          description: 'Komple bisiklet tamir aletleri. Patlak lastik tamiri, zincir söküm vb.',
          category: 'sports',
          condition: 'Yeni Gibi',
          priceType: 'free',
          priceAmount: 0,
          duration: '2 saat',
          images: [],
          ownerId: 'demouser1',
          ownerName: 'Ahmet Yılmaz',
          ownerAvatar: '👨‍🔧',
          latitude: 41.0062,
          longitude: 28.9764,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 4.7,
          totalRentals: 6,
          createdAt: new Date().toISOString(),
          distance: '450m'
        },
        {
          id: 'demo5',
          name: 'Projektör / Sinema Perdesi',
          description: 'Full HD projektör ve katlanır perde. Film gecesi veya sunum için.',
          category: 'electronics',
          condition: 'İyi',
          priceType: 'daily',
          priceAmount: 75,
          duration: '1 gün',
          images: [],
          ownerId: 'demouser2',
          ownerName: 'Zeynep Kaya',
          ownerAvatar: '👩‍🎨',
          latitude: 41.0102,
          longitude: 28.9804,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 4.6,
          totalRentals: 4,
          createdAt: new Date().toISOString(),
          distance: '500m'
        },
        {
          id: 'demo6',
          name: 'Kitap Koleksiyonu - Bilim Kurgu',
          description: 'Asimov, Clarke, Dick koleksiyonu. 25+ kitap. Tek tek veya toplu ödünç.',
          category: 'books',
          condition: 'İyi',
          priceType: 'free',
          priceAmount: 0,
          duration: '2 hafta',
          images: [],
          ownerId: 'demouser3',
          ownerName: 'Mehmet Demir',
          ownerAvatar: '👨‍💼',
          latitude: 41.0052,
          longitude: 28.9754,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 5.0,
          totalRentals: 20,
          createdAt: new Date().toISOString(),
          distance: '350m'
        },
        {
          id: 'demo7',
          name: 'Pasta Kalıpları Seti',
          description: 'Farklı boy ve şekilde pasta kalıpları. Doğum günü hazırlıkları için.',
          category: 'kitchen',
          condition: 'Çok İyi',
          priceType: 'free',
          priceAmount: 0,
          duration: '2 gün',
          images: [],
          ownerId: 'demouser4',
          ownerName: 'Ayşe Şahin',
          ownerAvatar: '👩‍🍳',
          latitude: 41.0112,
          longitude: 28.9814,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 4.9,
          totalRentals: 9,
          createdAt: new Date().toISOString(),
          distance: '600m'
        },
        {
          id: 'demo8',
          name: 'Çim Biçme Makinesi',
          description: 'Elektrikli çim biçme makinesi. Bahçe bakımı için ideal.',
          category: 'garden',
          condition: 'İyi',
          priceType: 'daily',
          priceAmount: 40,
          duration: '1 gün',
          images: [],
          ownerId: 'demouser4',
          ownerName: 'Ayşe Şahin',
          ownerAvatar: '👩‍🍳',
          latitude: 41.0042,
          longitude: 28.9744,
          neighborhood: 'Beşiktaş',
          available: true,
          rating: 4.3,
          totalRentals: 7,
          createdAt: new Date().toISOString(),
          distance: '700m'
        }
      ];

      await AsyncStorage.setItem('items', JSON.stringify(demoItems));
    } catch (e) {
      console.error('Demo veri yükleme hatası:', e);
    }
  }
};