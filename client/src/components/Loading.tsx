import { Image, Text, View } from 'react-native';
import { useState, useEffect, FC } from 'react';

const context = require.context(
	'../../assets/images/stroke-order/fast',
	false,
	/\.gif$/,
);
const fastGifs = context.keys().map((key) => context(key));
const GIF_DURATION_MS = 1500;

type LoadingProps = { message: string };
const Loading: FC<LoadingProps> = ({ message }) => {
	const Message = `${message}...`;
	const Style = { image: { dimension: 50 } };

	const [gifIndex, setGifIndex] = useState(() =>
		Math.floor(Math.random() * fastGifs.length),
	);

	useEffect(() => {
		if (fastGifs.length <= 1) return;

		const interval = setInterval(() => {
			setGifIndex((prevIndex) => {
				let nextIndex;
				do {
					nextIndex = Math.floor(Math.random() * fastGifs.length);
				} while (nextIndex === prevIndex);
				return nextIndex;
			});
		}, GIF_DURATION_MS);

		return () => clearInterval(interval);
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
				key={gifIndex} // Forces re-render to ensure animation restart if caching causes issues
				source={fastGifs[gifIndex]}
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
