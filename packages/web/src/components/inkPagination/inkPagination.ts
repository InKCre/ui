import { makeNumberProp, makeStringProp } from "../../utils/vue-props";

// --- Types ---
type PaginationType = "default" | "text";

// --- Props ---
export const inkPaginationProps = {
	currentPage: makeNumberProp(1),
	totalPages: makeNumberProp(1),
	type: makeStringProp<PaginationType>("default"),
} as const;

// --- Emits ---
export const inkPaginationEmits = {
	"page-change": (page: number) => true,
} as const;
