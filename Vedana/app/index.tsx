import { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Loading from '@/src/components/Loading';
import { api_base_url } from '@/src/util/url';
import { sleep } from '@/src/util/time';

export default function Index() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isSearching, setIsSearching] = useState<boolean>(false);

	async function handleSearch() {
		if (searchQuery.trim() === '') {
			return;
		}

		setIsSearching(true);

		try {
			const response = await fetch(`${api_base_url}/health`, { method: 'GET' });
			await sleep(5000);

			if (!response.ok) {
				throw new Error(`${response.status}: ${response.text}`);
			}

			console.log(response);
		} catch (error) {
			throw new Error(`${error}`);
		} finally {
			setIsSearching(false);
		}
	}

	return (
		<View style={styles.body}>
			<View style={styles.main}>
				<Link href='/' asChild>
					<Pressable style={styles.titleSubtitleContainer}>
						<Text style={styles.title}>Vedana</Text>
						<Text style={styles.subtitle}>단순한 국어 사전</Text>
					</Pressable>
				</Link>

				<View style={styles.form}>
					<TextInput
						style={styles.searchBox}
						placeholder='더 자세히 알고 싶은 낱말'
						value={searchQuery}
						onChangeText={setSearchQuery}
						onSubmitEditing={handleSearch}
						placeholderTextColor='#9ca3af'
					/>
					<Pressable style={styles.searchButton} onPress={handleSearch}>
						<Text style={styles.searchButtonText}>검색</Text>
					</Pressable>
				</View>

				{isSearching && (
					<View>
						<Loading message='Searching'></Loading>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		backgroundColor: '#ffffff',
	},
	main: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingTop: 32,
	},
	titleSubtitleContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	title: {
		fontFamily: 'sans-serif',
		fontWeight: 'bold',
		fontSize: 50,
		color: 'black',
		letterSpacing: 3,
		marginBottom: 2.5,
	},
	subtitle: {
		fontFamily: 'serif',
		fontWeight: 'normal',
		fontSize: 24,
		color: 'black',
	},
	form: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'stretch',
		marginTop: 20,
		marginBottom: 30,
	},
	searchBox: {
		width: 300,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 4,
		paddingVertical: 12,
		paddingHorizontal: 20,
		backgroundColor: 'transparent',
		marginLeft: 4,
		color: 'black',
	},
	searchButton: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 4,
		paddingHorizontal: 16,
		marginLeft: 8,
		backgroundColor: '#f1f5f9',
	},
	searchButtonText: {
		color: 'black',
		fontSize: 14,
	},
});
