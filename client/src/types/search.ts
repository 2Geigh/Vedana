export type Search = {
	search_query: string;
	search_results: Results[];
};

export type Results = {
	title: string;
	total: number;
	results: item[];
};

type item = {
	target_code: number;
	word: string;
	sup_no: number;
	etymology: string;
	pronunciation: string;
	word_grade_level: string;
	word_type: string;
	entry_link: string;
	sense: entrySense;
};

type entrySense = {
	order: number;
	definition: string;
};

export const NoResults = (results: Results): boolean => {
	if (
		results === null ||
		results === undefined ||
		results.results === null ||
		results.results === undefined
	) {
		return true;
	}

	return results.results.length <= 1 && results.total === 0;
};
