import { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { applyForMission, fetchMissionById } from '@/store/missionStore';
import { CONFIG } from '@/constants/config';

function toPublicAssetUrl(path?: string) {
	if (!path) return null;
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	return `${CONFIG.API_BASE_URL.replace('/api', '')}/${path.replace(/^\/+/, '')}`;
}

export default function MissionDetailsScreen() {
	const dispatch = useAppDispatch();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { selected, loading } = useAppSelector((state) => state.missions);
	const [motivationMessage, setMotivationMessage] = useState('');

	const missionId = useMemo(() => {
		if (!id) return '';
		return Array.isArray(id) ? id[0] || '' : id;
	}, [id]);

	useEffect(() => {
		if (missionId) {
			dispatch(fetchMissionById(missionId));
		}
	}, [dispatch, missionId]);

	const onApply = async () => {
		if (!missionId) return;
		const message = motivationMessage.trim();
		if (message.length < 10) {
			Alert.alert('Validation', 'Please write a motivation message (minimum 10 characters).');
			return;
		}

		const result = await dispatch(applyForMission({ missionId, message }));
		if (result.meta.requestStatus === 'fulfilled') {
			Alert.alert('Success', 'Application sent successfully.');
			setMotivationMessage('');
			return;
		}

		const errorMessage =
			(result.payload as string | undefined) ||
			result.error?.message ||
			'Could not send application.';
		Alert.alert('Error', errorMessage);
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
				<Text>Salary: {selected.salary} MAD</Text>
				{selected.cargoType ? <Text>Cargo type: {selected.cargoType}</Text> : null}
				{typeof selected.weight === 'number' ? <Text>Weight: {selected.weight} kg</Text> : null}
				{selected.departureDate ? (
					<Text>Departure: {new Date(selected.departureDate).toLocaleString()}</Text>
				) : null}
				{selected.estimatedDuration ? <Text>Duration: {selected.estimatedDuration}</Text> : null}
				{selected.requiredLicenses?.length ? (
					<Text>Required licenses: {selected.requiredLicenses.join(', ')}</Text>
				) : null}
				<Text>Status: {selected.status}</Text>

				{selected.company ? (
					<View
						style={{
							marginTop: 10,
							padding: 12,
							borderWidth: 1,
							borderColor: '#E5E7EB',
							borderRadius: 10,
							gap: 6,
						}}
					>
						<Text style={{ fontWeight: '700', fontSize: 16 }}>Company information</Text>
						{toPublicAssetUrl(selected.company.logo) ? (
							<Image
								source={{ uri: toPublicAssetUrl(selected.company.logo)! }}
								style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: '#F3F4F6' }}
							/>
						) : null}
						<Text>Name: {selected.company.companyName || 'N/A'}</Text>
						<Text>Description: {selected.company.description || 'N/A'}</Text>
						<Text>Legal info: {selected.company.legalInfo || 'N/A'}</Text>
					</View>
				) : null}

				<View style={{ marginTop: 12, gap: 8 }}>
					<Text style={{ fontWeight: '700' }}>Motivation message</Text>
					<TextInput
						value={motivationMessage}
						onChangeText={setMotivationMessage}
						placeholder="Tell the company why you're a good fit for this mission"
						multiline
						textAlignVertical="top"
						style={{
							borderWidth: 1,
							borderColor: '#D1D5DB',
							borderRadius: 10,
							paddingHorizontal: 12,
							paddingVertical: 10,
							minHeight: 96,
						}}
					/>
				</View>

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
