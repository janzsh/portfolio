import { actions, isInputError } from 'astro:actions';

export type ContactStatus = 'sent' | 'invalid' | 'rate_limited' | 'error';
export interface ContactOutcome {
  status: ContactStatus;
  /** Field name -> first error message, only when status is "invalid". */
  fieldErrors: Record<string, string>;
}

/** Calls the server action and maps every outcome to a UI-friendly status. */
export async function sendContact(form: FormData): Promise<ContactOutcome> {
  try {
    const { error } = await actions.sendContact(form);
    if (!error) return { status: 'sent', fieldErrors: {} };
    if (isInputError(error)) {
      const fieldErrors = Object.fromEntries(
        Object.entries(error.fields).map(([field, messages]) => [field, (messages as string[])[0]]),
      );
      return { status: 'invalid', fieldErrors };
    }
    if (error.code === 'TOO_MANY_REQUESTS') return { status: 'rate_limited', fieldErrors: {} };
    return { status: 'error', fieldErrors: {} };
  } catch {
    return { status: 'error', fieldErrors: {} };
  }
}
