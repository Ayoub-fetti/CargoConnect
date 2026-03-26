import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { fetchMyApplications } from '@/store/missionStore';
import { CONFIG } from '@/constants/config';

function toPublicAssetUrl(path?: string) {
	if (!path) return null;
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	return `${CONFIG.API_BASE_URL.replace('/api', '')}/${path.replace(/^\/+/, '')}`;
}

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
				renderItem={({ item }) => {
					const mission = item.missionId || {};
					const from = mission.origin || mission.departureLocation || 'N/A';
					const to = mission.destination || mission.arrivalLocation || 'N/A';
					const salary = mission.price ?? mission.salary;
					const company =
						mission.companyId && typeof mission.companyId === 'object' ? mission.companyId : null;

					return (
						<View
							style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12, gap: 4 }}
						>
							<Text style={{ fontWeight: '700' }}>{mission.title || 'Mission application'}</Text>
							<Text style={{ color: '#6B7280' }}>Status: {item.status || 'PENDING'}</Text>
							<Text>From: {from}</Text>
							<Text>To: {to}</Text>
							<Text>Salary: {salary ?? 'N/A'} MAD</Text>
							{item.message ? <Text>Message: {item.message}</Text> : null}
							{item.createdAt ? (
								<Text>Applied at: {new Date(item.createdAt).toLocaleString()}</Text>
							) : null}

							{company ? (
								<View style={{ marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
									<Text style={{ fontWeight: '700' }}>Company</Text>
									{toPublicAssetUrl(company.logo) ? (
										<Image
											source={{ uri: toPublicAssetUrl(company.logo)! }}
											style={{ width: 40, height: 40, borderRadius: 6, marginTop: 4 }}
										/>
									) : null}
									<Text>Name: {company.companyName || 'N/A'}</Text>
									<Text>Description: {company.description || 'N/A'}</Text>
									<Text>Legal info: {company.legalInfo || 'N/A'}</Text>
								</View>
							) : null}
						</View>
					);
				}}
				ListEmptyComponent={<Text style={{ color: '#6B7280' }}>No applications yet.</Text>}
			/>
		</SafeAreaView>
	);
}
