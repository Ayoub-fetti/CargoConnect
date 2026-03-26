import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { fetchMyApplications } from '@/store/missionStore';

export default function ApplicationsScreen() {
	const dispatch = useAppDispatch();
	const { applications, loading } = useAppSelector((state) => state.missions);

	useEffect(() => {
		dispatch(fetchMyApplications());
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
				data={applications}
				keyExtractor={(item, index) => item._id || `${index}`}
				contentContainerStyle={{ padding: 16, gap: 10 }}
				renderItem={({ item }) => (
					<View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12 }}>
						<Text style={{ fontWeight: '700' }}>Application</Text>
						<Text style={{ color: '#6B7280', marginTop: 4 }}>
							Status: {item.status || 'PENDING'}
						</Text>
					</View>
				)}
				ListEmptyComponent={<Text style={{ color: '#6B7280' }}>No applications yet.</Text>}
			/>
		</SafeAreaView>
	);
}
