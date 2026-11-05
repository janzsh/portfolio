import { useSignal } from '@preact/signals';
import type { TargetedSubmitEvent } from 'preact';
import { firstInvalidField } from './first-invalid';
import { sendContact, type ContactOutcome } from './send-contact';
import './contact-form.scss';

export interface ContactLabels {
  name: string;
  email: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  sent: string;
  error: string;
  rateLimited: string;
  invalid: string;
}

const STATUS_ID = 'contact-status';
const FIELD_ORDER = ['name', 'email', 'message'] as const;

export default function ContactForm({ labels }: { labels: ContactLabels }) {
  const pending = useSignal(false);
  const outcome = useSignal<ContactOutcome | null>(null);

  const onSubmit = async (event: TargetedSubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    pending.value = true;
    const result = await sendContact(new FormData(form));
    outcome.value = result;
    if (result.status === 'sent') form.reset();
    pending.value = false;

    // Move focus to the first field that needs fixing.
    const invalid = firstInvalidField(result.fieldErrors, FIELD_ORDER);
    if (invalid) (form.elements.namedItem(invalid) as HTMLElement | null)?.focus();
  };

  // Invalid fields point at the status message so assistive tech reads what went wrong.
  const fieldProps = (name: string) => {
    const invalid = Boolean(outcome.value?.fieldErrors[name]);
    return { 'aria-invalid': invalid, 'aria-describedby': invalid ? STATUS_ID : undefined };
  };

  const status = outcome.value?.status;
  const message = status && { sent: labels.sent, invalid: labels.invalid, rate_limited: labels.rateLimited, error: labels.error }[status];

  return (
    <form class="contact-form" onSubmit={onSubmit} noValidate>
      <div class="contact-form__row">
        <label class="contact-form__field">
          <span>{labels.name}</span>
          <input class="contact-form__input" name="name" autoComplete="name" required minLength={2} maxLength={80} {...fieldProps('name')} />
        </label>
        <label class="contact-form__field">
          <span>{labels.email}</span>
          <input class="contact-form__input" name="email" type="email" inputmode="email" spellcheck={false} autoComplete="email" required maxLength={120} {...fieldProps('email')} />
        </label>
      </div>
      <label class="contact-form__field">
        <span>{labels.subject}</span>
        <input class="contact-form__input" name="subject" maxLength={120} />
      </label>
      <label class="contact-form__field">
        <span>{labels.message}</span>
        <textarea class="contact-form__input contact-form__input--area" name="message" rows={6} required minLength={10} maxLength={4000} {...fieldProps('message')} />
      </label>

      <input class="contact-form__trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div class="contact-form__footer">
        <button class="button button--primary" type="submit" disabled={pending.value}>
          {pending.value ? labels.sending : labels.send}
        </button>
        <p
          id={STATUS_ID}
          class={`contact-form__status ${status === 'sent' ? 'contact-form__status--ok' : status ? 'contact-form__status--bad' : ''}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </form>
  );
}
