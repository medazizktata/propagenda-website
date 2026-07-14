export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactFormData, string>>;

export interface ContactFormResult {
  success: boolean;
  message: string;
  fieldErrors?: ContactFieldErrors;
  /** Re-fill inputs after a failed submit. */
  values?: Partial<ContactFormData>;
}
