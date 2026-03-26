import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Pressable,
	ScrollView,
	Switch,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { CONFIG } from '@/constants/config';
import { driverService } from '@/services/driver.service';

type ProfileData = {
	_id: string;
	email: string;
	fullName?: string;
	phone?: string;
	avatar?: string;
	licenseTypes?: string[];
	zone?: string[];
	isAvailable?: boolean;
};

type DriverDocument = {
	_id: string;
	originalName: string;
	type: string;
	createdAt: string;
};

export default function ProfileScreen() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [documents, setDocuments] = useState<DriverDocument[]>([]);

	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [licenseTypes, setLicenseTypes] = useState('');
	const [zone, setZone] = useState('');
	const [isAvailable, setIsAvailable] = useState(true);
	const [documentType, setDocumentType] = useState('OTHER');

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [profileData, docs] = await Promise.all([
				driverService.getProfile(),
				driverService.getDocuments(),
			]);

			setProfile(profileData);
			setDocuments(docs || []);
			setFullName(profileData.fullName || '');
			setPhone(profileData.phone || '');
			setLicenseTypes((profileData.licenseTypes || []).join(', '));
			setZone((profileData.zone || []).join(', '));
			setIsAvailable(profileData.isAvailable ?? true);
		} catch {
			Alert.alert('Error', 'Could not load profile data.');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const onSaveProfile = async () => {
		setSaving(true);
		try {
			await driverService.updateProfile({
				fullName: fullName.trim(),
				phone: phone.trim(),
				licenseTypes: licenseTypes
					.split(',')
					.map((item) => item.trim())
					.filter(Boolean),
				zone: zone
					.split(',')
					.map((item) => item.trim())
					.filter(Boolean),
				isAvailable,
			});
			Alert.alert('Success', 'Profile updated successfully.');
			await loadData();
		} catch {
			Alert.alert('Error', 'Failed to update profile.');
		} finally {
			setSaving(false);
		}
	};

	const onUploadAvatar = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			Alert.alert('Permission needed', 'Please allow photo library access.');
			return;
		}

		const picked = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 0.8,
		});

		if (picked.canceled) return;
		const asset = picked.assets[0];
		if (!asset?.uri) return;

		setUploading(true);
		try {
			const name = asset.fileName || 'avatar.jpg';
			const mime = asset.mimeType || 'image/jpeg';
			await driverService.uploadAvatar({
				fileUri: asset.uri,
				fileName: name,
				mimeType: mime,
				webFile: (asset as any).file,
			});
			Alert.alert('Success', 'Avatar uploaded.');
			await loadData();
		} catch {
			Alert.alert('Error', 'Avatar upload failed.');
		} finally {
			setUploading(false);
		}
	};

	const onUploadDocument = async () => {
		const picked = await DocumentPicker.getDocumentAsync({
			multiple: false,
			copyToCacheDirectory: true,
			type: ['application/pdf', 'image/*'],
		});

		if (picked.canceled || picked.assets.length === 0) return;

		const asset = picked.assets[0];
		setUploading(true);
		try {
			await driverService.uploadDocument({
				fileUri: asset.uri,
				fileName: asset.name,
				mimeType: asset.mimeType || 'application/octet-stream',
				webFile: (asset as any).file,
				type: documentType,
			});
			Alert.alert('Success', 'Document uploaded.');
			await loadData();
		} catch {
			Alert.alert('Error', 'Document upload failed.');
		} finally {
			setUploading(false);
		}
	};

	const onDeleteDocument = async (id: string) => {
		try {
			await driverService.deleteDocument(id);
			setDocuments((prev) => prev.filter((doc) => doc._id !== id));
		} catch {
			Alert.alert('Error', 'Delete failed.');
		}
	};

	const avatarUrl =
		profile?.avatar && profile.avatar.startsWith('uploads')
			? `${CONFIG.API_BASE_URL.replace('/api', '')}/${profile.avatar}`
			: null;

	if (loading) {
		return (
			<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
				<Text style={{ fontSize: 24, fontWeight: '700' }}>My Profile</Text>
				<Text style={{ color: '#6B7280' }}>{profile?.email}</Text>

				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
					{avatarUrl ? (
						<Image
							source={{ uri: avatarUrl }}
							style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#E5E7EB' }}
						/>
					) : (
						<View
							style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#E5E7EB' }}
						/>
					)}
					<Pressable onPress={onUploadAvatar} style={secondaryButton} disabled={uploading}>
						<Text style={{ fontWeight: '700' }}>{uploading ? 'Uploading...' : 'Upload avatar'}</Text>
					</Pressable>
				</View>

				<TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" style={inputStyle} />
				<TextInput value={phone} onChangeText={setPhone} placeholder="Phone" style={inputStyle} />
				<TextInput
					value={licenseTypes}
					onChangeText={setLicenseTypes}
					placeholder="License types (comma separated)"
					style={inputStyle}
				/>
				<TextInput
					value={zone}
					onChangeText={setZone}
					placeholder="Zones (comma separated)"
					style={inputStyle}
				/>

				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
					<Text style={{ fontSize: 16 }}>Available for missions</Text>
					<Switch value={isAvailable} onValueChange={setIsAvailable} />
				</View>

				<Pressable onPress={onSaveProfile} disabled={saving} style={primaryButton}>
					<Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
						{saving ? 'Saving...' : 'Save profile'}
					</Text>
				</Pressable>

				<View style={{ marginTop: 10 }}>
					<Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 10 }}>Documents</Text>

					<TextInput
						value={documentType}
						onChangeText={setDocumentType}
						placeholder="Document type (CV, DRIVING_LICENSE, TRUCK_REGISTRATION, OTHER)"
						style={inputStyle}
					/>

					<Pressable onPress={onUploadDocument} style={secondaryButton} disabled={uploading}>
						<Text style={{ fontWeight: '700' }}>
							{uploading ? 'Uploading...' : 'Upload document'}
						</Text>
					</Pressable>

					<FlatList
						style={{ marginTop: 12 }}
						data={documents}
						scrollEnabled={false}
						keyExtractor={(item) => item._id}
						renderItem={({ item }) => (
							<View
								style={{
									borderWidth: 1,
									borderColor: '#E5E7EB',
									borderRadius: 10,
									padding: 12,
									marginBottom: 8,
								}}
							>
								<Text style={{ fontWeight: '700' }}>{item.originalName}</Text>
								<Text style={{ color: '#6B7280', marginTop: 2 }}>Type: {item.type}</Text>
								<Pressable
									onPress={() => onDeleteDocument(item._id)}
									style={{ marginTop: 8, alignSelf: 'flex-start' }}
								>
									<Text style={{ color: '#DC2626', fontWeight: '700' }}>Delete</Text>
								</Pressable>
							</View>
						)}
						ListEmptyComponent={<Text style={{ color: '#6B7280' }}>No documents uploaded yet.</Text>}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const inputStyle = {
	borderWidth: 1,
	borderColor: '#D1D5DB',
	borderRadius: 10,
	paddingHorizontal: 12,
	paddingVertical: 12,
} as const;

const primaryButton = {
	marginTop: 8,
	backgroundColor: '#111827',
	borderRadius: 10,
	paddingVertical: 14,
	alignItems: 'center',
} as const;

const secondaryButton = {
	backgroundColor: '#E5E7EB',
	borderRadius: 10,
	paddingHorizontal: 12,
	paddingVertical: 10,
	alignItems: 'center',
} as const;
