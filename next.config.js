const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	images: {
		unoptimized: true,
	},
	transpilePackages: ['@mui/x-charts'],
	experimental: {
		turbo: {
			rules: {
				'*.svg': {
					loaders: ['@svgr/webpack'],
					as: '*.js',
				},
			},
		},
	},

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: { and: [/\.(js|ts|md)x?$/] },
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						prettier: false,
						svgo: true,
						svgoConfig: {
							plugins: [{
								name: 'preset-default',
								params: {
									overrides: {
										// disable plugins
										removeViewBox: false,
									},
								}
							}]
						},
						titleProp: true,
					},
				},
			],
		});
		return config;
	},
}

module.exports = nextConfig
