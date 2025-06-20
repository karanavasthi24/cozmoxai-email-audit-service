/**
 * IParsedEmail
 *
 * Represents the structured result of parsing a .eml email file.
 */
export interface IParsedEmail {
	subject: string;
	from: string;
	to: string[];
	date: Date;
	text?: string;
	html?: string;
	/** Array of attachments (must include at least one image for auditing) */
	attachments: {
		filename: string;
		/** The MIME type of the attachment */
		contentType: string;
		size: number;
		content: Buffer;
	}[];
}
