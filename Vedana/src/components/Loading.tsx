import { Image, Text, View } from 'react-native';

type LoadingProps = { message: string };

const Loading: React.FC<LoadingProps> = ({ message }) => {
	const Message = `${message}...`;

	const Style = { image: { dimension: 50 } };

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: 20,
				marginBottom: 20,
				opacity: 0.5,
			}}
		>
			<Image
				source={require('@/assets/images/stroke-order/fast/fast_美-order.gif')}
				alt={Message}
				style={{
					height: Style.image.dimension,
					width: Style.image.dimension,
					objectFit: 'contain',
				}}
			/>
			<Text style={{ fontWeight: 'light' }}>{Message}</Text>
		</View>
	);
};

export default Loading;
