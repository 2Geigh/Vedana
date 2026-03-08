import { FC, JSX, useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	Pressable,
	Platform,
} from 'react-native';
import { Link, RelativePathString } from 'expo-router';
import Loading from '@/src/components/Loading';
import { api_base_url } from '@/src/util/url';
import { Search, Results, NoResults } from '@/src/types/search';

const isQueryValid = (query: string): boolean => {
	const isValid = query.trim() !== '';
	return isValid;
};

type SearchResultsProps = {
	results: Results[] | undefined;
	isSearching: boolean;
	noResults: boolean | undefined;
};
const SearchResults: FC<SearchResultsProps> = ({
	results,
	isSearching,
	noResults,
}) => {
	if (isSearching) {
		return (
			<View>
				<Loading message='Searching'></Loading>
			</View>
		);
	}

	if (noResults) {
		return (
			<View>
				<Text>결과가 없음.</Text>
			</View>
		);
	}

	if (results) {
		let Results: JSX.Element[] = [];
		for (let source of results) {
			console.log(`source: ${source.title}`);
			for (let entry of source.results) {
				const href: RelativePathString = `./words/${entry.target_code}`;
				const element = (
					<li key={entry.entry_link} style={styles.resultItem}>
						<Link href={href}>{entry.word}</Link>
						<Text>{entry.sense.definition}</Text>
					</li>
				);
				Results.push(element);
			}
		}

		return <ul style={styles.resultList}>{Results}</ul>;
	}
};

export default function Index() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [results, setResults] = useState<Results[] | undefined>(undefined);
	const [noResults, setNoResults] = useState<boolean | undefined>(undefined);

	async function handleSearch() {
		if (!isQueryValid(searchQuery)) {
			return;
		}

		setIsSearching(true);
		setResults(undefined);
		setNoResults(undefined);

		try {
			const response = await fetch(
				`${api_base_url}/results?search_query=${searchQuery}`,
				{
					method: 'GET',
				},
			);

			if (!response.ok) {
				throw new Error(`${response.status}: ${response.text}`);
			}

			const search = (await response.json()) as Search;
			setResults(search.search_results);

			let noResults = false;
			for (let result of search.search_results) {
				if (NoResults(result)) {
					noResults = true;
				}
				break;
			}
			setNoResults(noResults);
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

				<SearchResults
					results={results}
					isSearching={isSearching}
					noResults={noResults}
				/>
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
	resultList: {},
	resultItem: {
		padding: 10,
		backgroundColor: 'white',
		// Mobile Shadow (iOS)
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 5,
		// Mobile Shadow (Android)
		elevation: 5,

		marginBottom: 20,
		borderRadius: 5,

		...(Platform.OS === 'web'
			? {
					boxShadow: '0px 0px .33em .1em rgba(0, 0, 0, 0.25)',
				}
			: {}),
	},
});
