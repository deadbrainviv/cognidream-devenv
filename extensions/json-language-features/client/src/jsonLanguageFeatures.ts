import { ProviderResult, TextEdit } from 'vscode';

export function provideDocumentRangeFormattingEdits(): ProviderResult<TextEdit[]> {
	return Promise.resolve([]); // Return empty array for now since we don't have access to the client
}
