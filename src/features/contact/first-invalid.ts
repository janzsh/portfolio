/** The first visible field (in form order) that has an error, so focus can jump to it on submit. */
export const firstInvalidField = (fieldErrors: Record<string, string>, order: readonly string[]): string | undefined =>
  order.find((name) => name in fieldErrors);
