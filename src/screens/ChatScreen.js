import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../config/firebase';
import { generateId, formatDate } from '../utils/helpers';

const ChatScreen = ({ navigation, route }) => {
  const { chatId, otherUser, itemName } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    const msgs = await LocalDB.getMessages(chatId);
    setMessages(msgs);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const msg = {
      id: generateId(),
      text: inputText.trim(),
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date().toISOString(),
    };

    await LocalDB.sendMessage(chatId, msg);
    setInputText('');
    loadMessages();

    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
  };

  const renderMessage = ({ item: msg }) => {
    const isMe = msg.senderId === user.id;
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}>
        <View style={[styles.msgBubble, isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.otherMsgText]}>
            {msg.text}
          </Text>
          <Text style={[styles.msgTime, isMe && { color: 'rgba(255,255,255,0.6)' }]}>
            {formatDate(msg.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerAvatar}>{otherUser.avatar || '😊'}</Text>
          <View>
            <Text style={styles.headerName}>{otherUser.name}</Text>
            {itemName && <Text style={styles.headerItem}>📦 {itemName}</Text>}
          </View>
        </View>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatEmoji}>💬</Text>
            <Text style={styles.emptyChatText}>Henüz mesaj yok</Text>
            <Text style={styles.emptyChatSubtext}>İlk mesajı sen gönder!</Text>
          </View>
        }
      />

      <View style={styles.inputBar}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Mesaj yaz..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendBtnText}>📤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    fontSize: 32,
    marginRight: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerItem: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  msgRow: {
    marginBottom: 8,
  },
  msgRowRight: {
    alignItems: 'flex-end',
  },
  msgRowLeft: {
    alignItems: 'flex-start',
  },
  msgBubble: {
    maxWidth: '78%',
    padding: 12,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: '#10B981',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  msgText: {
    fontSize: 15,
    lineHeight: 21,
  },
  myMsgText: {
    color: '#FFF',
  },
  otherMsgText: {
    color: '#1F2937',
  },
  msgTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyChat: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyChatEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyChatSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 30,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  inputBox: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: '#1F2937',
    maxHeight: 80,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendBtnText: {
    fontSize: 20,
  },
});

export default ChatScreen;