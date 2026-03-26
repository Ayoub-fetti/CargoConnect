import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { fetchMissions } from '@/store/missionStore';

export default function MissionsScreen() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { items, loading } = useAppSelector((state) => state.missions);

	useEffect(() => {
		dispatch(fetchMissions());
	}, [dispatch]);

	if (loading) {
		return (
			<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<FlatList
				data={items}
				keyExtractor={(item) => item._id}
				contentContainerStyle={{ padding: 16, gap: 10 }}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => router.push(`/(tabs)/missions/${item._id}`)}
						style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12 }}
					>
						<Text style={{ fontWeight: '700' }}>{item.title}</Text>
						<Text style={{ color: '#6B7280', marginTop: 4 }}>
							{item.departureLocation}{' -> '}{item.arrivalLocation}
						</Text>
						<Text style={{ marginTop: 6 }}>Salary: {item.salary}</Text>
					</Pressable>
				)}
				ListEmptyComponent={<Text style={{ color: '#6B7280' }}>No missions found.</Text>}
			/>
		</SafeAreaView>
	);
}
