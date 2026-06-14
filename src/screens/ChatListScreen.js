import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';

const ChatListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
    const unsub = navigation.addListener('focus', loadRequests);
    return unsub;
  }, []);

  const loadRequests = async () => {
    if (user) {
      const reqs = await LocalDB.getRequests(user.id);
      setRequests(reqs);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'approved': return '#10B981';
      case 'returned': return '#3B82F6';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Onay Bekleniyor';
      case 'approved': return '✅ Onaylandı';
      case 'returned': return '🔄 İade Edildi';
      case 'rejected': return '❌ Reddedildi';
      default: return status;
    }
  };

  const handleApprove = async (request) => {
    await LocalDB.updateRequest(request.id, { status: 'approved' });
    loadRequests();
  };

  const renderRequest = ({ item: req }) => {
    const isOwner = req.ownerId === user.id;
    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => {
          const chatId = [req.ownerId, req.requesterId].sort().join('_');
          const otherUser = isOwner
            ? { id: req.requesterId, name: req.requesterName }
            : { id: req.ownerId, name: req.ownerName };
          navigation.navigate('Chat', { chatId, otherUser, itemName: req.itemName });
        }}
      >
        <View style={styles.reqHeader}>
          <Text style={styles.reqItemName}>📦 {req.itemName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(req.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(req.status) }]}>
              {getStatusText(req.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.reqInfo}>
          {isOwner ? `${req.requesterName} talep etti` : `${req.ownerName} sahibi`}
        </Text>

        {isOwner && req.status === 'pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(req)}
            >
              <Text style={styles.approveBtnText}>✅ Onayla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={async () => {
                await LocalDB.updateRequest(req.id, { status: 'rejected' });
                loadRequests();
              }}
            >
              <Text style={styles.rejectBtnText}>❌ Reddet</Text>
            </TouchableOpacity>
          </View>
        )}

        {req.status === 'approved' && !isOwner && (
          <TouchableOpacity
            style={styles.qrBtn}
            onPress={() => navigation.navigate('QRCode', { request: req, item: { name: req.itemName } })}
          >
            <Text style={styles.qrBtnText}>📱 QR Kodu Göster</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mesajlar & Talepler</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Henüz talep yok</Text>
            <Text style={styles.emptySubtext}>Eşya talep ettiğinde burada görünecek</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  list: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reqItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reqInfo: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  qrBtn: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  qrBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default ChatListScreen;