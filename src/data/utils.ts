export function getQuestionWordForm(count: number): string {
	const lastDigit = count % 10;
	const lastTwoDigits = count % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return `${count} запитань`;
	} else if (lastDigit === 1) {
		return `${count} запитання`;
	} else if (lastDigit >= 2 && lastDigit <= 4) {
		return `${count} запитання`;
	} else {
		return `${count} запитань`;
	}
}
