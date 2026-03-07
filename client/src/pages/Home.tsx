import React from 'react';
import { View, StyleSheet, SafeAreaViewBase } from 'react-native';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';

const HomePage: React.FC = () => {
	return (
		<SafeAreaViewBase style={styles.container}>
			<View style={styles.main}>
				<Header />
				<SearchForm />
			</View>
		</SafeAreaViewBase>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	main: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
});

export default HomePage;
