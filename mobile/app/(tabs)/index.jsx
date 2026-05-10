import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/home.styles';
import PostCard from '../components/PostCard';

export default function HomeScreen() {
  const { token } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNumber = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNumber === 1) setLoading(true);
      const response = await fetch(`https://badallink-backend.onrender.com/api/posts?page=${pageNumber}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');

      if (pageNumber === 1 || refresh) {
        setPosts(data.posts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...data.posts]);
      }
      setHasMore(pageNumber < data.totalPages);
      setPage(pageNumber);

    } catch (error) {
      console.log("error fetching posts", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);

    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore && !refreshing) {
      fetchPosts(page + 1, false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(1, true)} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() => loading && hasMore && <ActivityIndicator size="large" color="#fff" style={{ paddingVertical: 20 }} />}
      />
    </View>
  )
}