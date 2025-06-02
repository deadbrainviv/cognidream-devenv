import { URI } from '../../../../base/common/uri.js';

export type cognidreamDirectoryItem = {
	uri: URI;
	name: string;
	isSymbolicLink: boolean;
    childrecognidreamognidreamDirectoryItem[] | null;
isDirectory: boolean;
isGitIgnoredDirectory: false | { numChildren: number }; // if directory is gitignored, we ignore children
}
