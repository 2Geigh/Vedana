export type Results = {
	search_query: string;
	search_results: search[];
};

type search = {
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
	return (
		results.search_results.length <= 1 && results.search_results[0].total === 0
	);
};
