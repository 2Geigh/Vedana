import { FC, JSX, useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	TextInput,
	Pressable,
	Platform,
	FlatList,
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
	errorOccured: boolean | undefined;
};
const SearchResults: FC<SearchResultsProps> = ({
	results,
	isSearching,
	noResults,
	errorOccured,
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
		const flattenedData = results.flatMap((source) => source.results);

		return (
			<FlatList
				data={flattenedData}
				keyExtractor={(item) => item.entry_link}
				contentContainerStyle={styles.resultList}
				renderItem={({ item }) => {
					const href: RelativePathString = `./words/${item.target_code}`;
					return (
						<View style={styles.resultItem}>
							<Link href={`./`} style={styles.resultItemHeader}>
								<Text style={styles.wordText}>{item.word}</Text>
								<Text style={styles.hanjaText}>{item.etymology}</Text>
							</Link>
							<Text style={styles.definitionText}>{item.sense.definition}</Text>
						</View>
					);
				}}
			/>
		);
	}

	if (errorOccured) {
		return <Text>문제가 있었음.</Text>;
	}

	return null;
};

export default function Index() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [results, setResults] = useState<Results[] | undefined>(undefined);
	const [noResults, setNoResults] = useState<boolean | undefined>(undefined);
	const [errorOccured, setErrorOccured] = useState<boolean | undefined>(
		undefined,
	);

	async function handleSearch() {
		if (!isQueryValid(searchQuery)) {
			return;
		}

		setIsSearching(true);
		setResults(undefined);
		setNoResults(undefined);
		setErrorOccured(undefined);

		try {
			const response = await fetch(
				`${api_base_url}/results?search_query=${searchQuery}`,
				{
					method: 'GET',
				},
			);

			if (!response.ok) {
				console.error(`${response.status}: ${response.statusText}`);
				setErrorOccured(true);
				return;
			}

			const search = (await response.json()) as Search;
			setResults(search.search_results);

			let noResults = false;
			console.log(search);
			if (search.search_results) {
				for (let result of search.search_results) {
					if (NoResults(result)) {
						noResults = true;
					}
					break;
				}
			}
			setNoResults(noResults);
			setErrorOccured(false);
		} catch (error) {
			setErrorOccured(true);
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
					errorOccured={errorOccured}
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
	resultList: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		paddingVertical: 10,
		paddingHorizontal: 10,
		maxWidth: 550,
		minWidth: 390,

		// backgroundColor: 'red',
	},
	resultItem: {
		padding: 10,
		backgroundColor: 'white',
		shadowColor: 'black',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.25,
		shadowRadius: 5,
		elevation: 5,
		marginBottom: 25,
		marginLeft: 5,
		borderRadius: 5,
	},
	resultItemHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	wordText: {
		fontWeight: 'bold',
		fontSize: 18,
	},
	hanjaText: {
		fontWeight: 'normal',
		fontSize: 18,
		opacity: 0.5,
	},
	definitionText: {
		fontSize: 14,
		color: '#333',
	},
});
