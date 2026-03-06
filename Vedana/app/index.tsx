import { Link, useNavigation } from 'expo-router';
import { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';

export default function Index() {
	const navigation = useNavigation();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const TitleAndSubstitle_Styles = {
		title: { fontSize: 45 },
		subtitle: { fontSize: 25 },
	};

	return (
		<View
			style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				// backgroundColor: 'red',
			}}
		>
			<View
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: 25,
					width: '90%',
					// backgroundColor: 'blue',
				}}
			>
				<Text
					style={{
						fontSize: TitleAndSubstitle_Styles.title.fontSize,
						fontFamily: 'georgia',
						fontWeight: 'bold',
						letterSpacing: 4.5,
						lineHeight: 45,
					}}
				>
					Vedana
				</Text>
				<Text
					style={{
						fontSize: TitleAndSubstitle_Styles.subtitle.fontSize,
						fontFamily: 'serif',
						opacity: 0.67,
					}}
				>
					단순한 국어 사전
				</Text>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					width: '90%',
				}}
			>
				<TextInput
					placeholder='알고 싶은 낱말이나 문장...'
					onChangeText={setSearchQuery}
					style={{
						borderWidth: 1,
						borderColor: 'gray',
						borderStyle: 'solid',
						padding: 5,
						paddingLeft: 7,
						paddingRight: 7,
						borderRadius: 7,
						width: '100%',
						maxWidth: 500,
					}}
				></TextInput>
			</View>

			{searchQuery.trim() !== '' && <>Loading...</>}
		</View>
	);
}

const styles = StyleSheet.create({});
