import { useEffect } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { applyForMission, fetchMissionById } from '@/store/missionStore';

export default function MissionDetailsScreen() {
	const dispatch = useAppDispatch();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { selected, loading } = useAppSelector((state) => state.missions);

	useEffect(() => {
		if (id) {
			dispatch(fetchMissionById(id));
		}
	}, [dispatch, id]);

	const onApply = async () => {
		if (!id) return;
		const result = await dispatch(applyForMission({ missionId: id }));
		if (result.meta.requestStatus === 'fulfilled') {
			Alert.alert('Success', 'Application sent successfully.');
			return;
		}
		Alert.alert('Error', 'Could not send application.');
	};

	if (loading || !selected) {
		return (
			<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
				<Text style={{ fontSize: 26, fontWeight: '700' }}>{selected.title}</Text>
				<Text style={{ color: '#6B7280' }}>{selected.description}</Text>
				<Text>From: {selected.departureLocation}</Text>
				<Text>To: {selected.arrivalLocation}</Text>
				<Text>Salary: {selected.salary}</Text>
				<Text>Status: {selected.status}</Text>

				<Pressable
					onPress={onApply}
					style={{
						marginTop: 14,
						backgroundColor: '#111827',
						borderRadius: 10,
						paddingVertical: 14,
						alignItems: 'center',
					}}
				>
					<Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Apply now</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
}
