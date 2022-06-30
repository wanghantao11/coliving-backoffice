module.exports = {
	globals: {
		'ts-jest': {
			tsConfigFile: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/unit/**/*.test.(ts|js)',
		'**/test/integration/**/*.test.(ts|js)',
	],
	testPathIgnorePatterns: ['/node_modules/', '/dist/*'],
	testEnvironment: 'node',
	verbose: false
};