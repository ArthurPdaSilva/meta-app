jest.mock("@react-native-async-storage/async-storage", () =>
	require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("react-native-toast-message", () => {
	const React = require("react");
	const RN = require("react-native");
	const MockBaseToast = ({ text1, text2 }) =>
		React.createElement(RN.View, null,
			React.createElement(RN.Text, { testID: "toast-text1" }, text1),
			React.createElement(RN.Text, { testID: "toast-text2" }, text2),
		);
	return {
		__esModule: true,
		default: { show: jest.fn(), hide: jest.fn() },
		BaseToast: MockBaseToast,
	};
});
