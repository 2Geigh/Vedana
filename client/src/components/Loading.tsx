import { Image, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import durations from '../../assets/images/stroke-order/fast/durations.json';

const context = require.context(
	'../../assets/images/stroke-order/fast',
	false,
	/\.gif$/,
);

const fastGifs = context.keys().map((key) => {
	const fileName = key.replace('./', '');
	return {
		source: context(key),
		duration: (durations as Record<string, number>)[fileName] || 1500,
	};
});

type LoadingProps = { message: string };

const Loading: React.FC<LoadingProps> = ({ message }) => {
	const Message = `${message}...`;
	const Style = { image: { dimension: 50 } };

	const [gifIndex, setGifIndex] = useState(() =>
		Math.floor(Math.random() * fastGifs.length),
	);

	useEffect(() => {
		if (fastGifs.length <= 1) return;

		let timeoutId: number;

		const cycleGif = () => {
			setGifIndex((prevIndex) => {
				let nextIndex;
				do {
					nextIndex = Math.floor(Math.random() * fastGifs.length);
				} while (nextIndex === prevIndex);

				timeoutId = setTimeout(cycleGif, fastGifs[nextIndex].duration);
				return nextIndex;
			});
		};

		timeoutId = setTimeout(cycleGif, fastGifs[gifIndex].duration);

		return () => clearTimeout(timeoutId);
	}, []);

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
				key={gifIndex}
				source={fastGifs[gifIndex].source}
				accessibilityLabel={Message}
				style={{
					height: Style.image.dimension,
					width: Style.image.dimension,
					resizeMode: 'contain',
					marginBottom: 10,
				}}
			/>
			<Text style={{ fontWeight: '300' }}>{Message}</Text>
		</View>
	);
};

export default Loading;
