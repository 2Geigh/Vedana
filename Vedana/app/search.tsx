import { Text, View } from 'react-native';

type SearchScreenProps = { word: string };
const SearchScreen: React.FC<SearchScreenProps> = ({ word }) => {
	return (
		<View>
			<Text>Result of searching for {word} will go here</Text>
		</View>
	);
};

export default SearchScreen;
