import { Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function SearchScreen() {
	const { word } = useLocalSearchParams<{ word: string }>();

	return (
		<View style={styles.container}>
			<Text>Result of searching for {word} will go here</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
