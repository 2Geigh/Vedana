import React, { useState } from 'react';
import {
	View,
	TextInput,
	TouchableOpacity,
	Text,
	StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface SearchFormProps {
	onSearch?: (query: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const navigation = useNavigation();

	const handleSearch = () => {
		if (searchQuery.trim().length > 0) {
			onSearch?.(searchQuery);
			// navigation.navigate('Results', { query: searchQuery });
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>더 자세히 알고 싶은 낱말:</Text>
			<TextInput
				style={styles.input}
				placeholder='더 자세히 알고 싶은 낱말'
				placeholderTextColor='#999'
				value={searchQuery}
				onChangeText={setSearchQuery}
				onSubmitEditing={handleSearch}
			/>
			<TouchableOpacity
				style={styles.button}
				onPress={handleSearch}
				disabled={searchQuery.trim().length === 0}
			>
				<Text style={styles.buttonText}>검색</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 30,
		paddingHorizontal: 20,
	},
	label: {
		display: 'none',
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 20,
		marginRight: 10,
		backgroundColor: 'transparent',
		color: 'black',
	},
	button: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: '#f0f0f0',
		borderRadius: 2,
		borderWidth: 1,
		borderColor: '#ccc',
	},
	buttonText: {
		color: 'black',
		fontWeight: '500',
	},
});

export default SearchForm;
