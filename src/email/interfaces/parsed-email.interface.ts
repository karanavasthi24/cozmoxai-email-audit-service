export interface IParsedEmail {
	subject: string;
	from: string;
	to: string[];
	date: Date;
	text?: string;
	html?: string;
	attachments: {
		filename: string;
		contentType: string;
		size: number;
		content: Buffer;
	}[];
}
