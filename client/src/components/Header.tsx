import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>토끼 사전</Text>
			<Text style={styles.subtitle}>단순한 국어 사전</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 48,
		fontWeight: 'bold',
		fontFamily: 'sans-serif',
		color: 'black',
	},
	subtitle: {
		fontSize: 24,
		fontFamily: 'serif',
		fontWeight: 'normal',
		color: 'black',
	},
});

export default Header;
