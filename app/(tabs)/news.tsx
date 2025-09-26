import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../src/components/Header';

type Article = {
  title: string;
  url?: string;
  source?: { name?: string };
  publishedAt?: string;
  description?: string;
  urlToImage?: string;
};

export default function NewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHeadlines() {
      setLoading(true);
      setError(null);
      try {
        // NOTE: The API key here was present in the original file. It's recommended to move
        // the key to environment variables (app config) instead of committing it.
        const url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=2a185e3785f947e29b45834a9c028108';
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setArticles(Array.isArray(json.articles) ? json.articles : []);
      } catch (err: any) {
        console.warn('Failed to load headlines', err);
        if (mounted) setError(err.message ?? 'Failed to fetch headlines');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadHeadlines();
    return () => { mounted = false };
  }, []);

  function openUrl(url?: string) {
    if (!url) return;
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else console.warn('Cannot open url', url);
    });
  }

  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity
      onPress={() => openUrl(item.url)}
      accessibilityRole="button"
      style={styles.item}
    >
      <View style={styles.row}>
        <Image
          source={item.urlToImage ? { uri: item.urlToImage } : require('../../assets/images/j-G6PUes.jpg')}
          style={styles.thumbnail}
          resizeMode="cover"
          accessibilityLabel={item.title ?? 'news thumbnail'}
        />
        <View style={styles.itemContent}>
          <Text style={styles.title}>{item.title ?? 'Untitled'}</Text>
          {item.source?.name ? <Text style={styles.source}>{item.source.name}</Text> : null}
          {item.publishedAt ? <Text style={styles.date}>{new Date(item.publishedAt).toLocaleString()}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.header}>Latest government news and updates</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text style={styles.error}>Error loading news: {error}</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, idx) => `${item.title ?? 'item'}-${idx}`}
          renderItem={renderItem}
          contentContainerStyle={articles.length === 0 ? styles.emptyContainer : undefined}
          ListEmptyComponent={<Text style={styles.empty}>No headlines available.</Text>}
        />
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
  header: { color: '#111', fontWeight: '600', fontSize: 18, marginBottom: 12 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, color: '#111', fontWeight: '500' },
  source: { fontSize: 12, color: '#666', marginTop: 4 },
  date: { fontSize: 11, color: '#999', marginTop: 2 },
  text: { color: '#111', fontWeight: '600' },
  error: { color: 'red' },
  empty: { color: '#666', textAlign: 'center', marginTop: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  thumbnail: { width: 88, height: 64, borderRadius: 6, marginRight: 12, backgroundColor: '#f0f0f0' },
  itemContent: { flex: 1 },
});
