# Email Audit Service

This service audits employee email communication quality using a dynamic rules engine. It accepts `.eml` files and provides structured feedback with scores and justifications for each rule (greeting, tone, clarity, etc.).

---

## Features

- Upload `.eml` files via REST API
- Parses subject, body (plain/HTML), and attachments
- Audits based on configurable rule classes
- Returns score + justification per rule
- Logs to rotating files (info/error)
- Docker + Compose ready
- Unit test coverage with Jest

---

## Tech Stack

- [NestJS]
- [mailparser]
- [winston]
- [Jest]
- [Docker]

---

## How It Works

1. `.eml` file is uploaded (via form-data `file` key).
2. Parsed to extract:
    - Subject
    - From, To
    - Plain text / HTML body
    - Attachments (must contain at least one image)
3. Each rule evaluates email content and returns:
    - pass/fail
    - justification
    - score
4. Scores are aggregated and returned with a summary.

---

## How to Run

### With Docker Compose (Recommended)

```bash
docker-compose up --build
```

- The service will be available at `http://localhost:3000` by default.

### Run Locally (Node.js)

```bash
npm install
npm run build
npm run start
```

- The service will be available at `http://localhost:3000` by default.

### Run Tests

```bash
npm install
npm run test
```

---

## API: Upload Email

### `POST /audit/upload`

- **Content-Type**: `multipart/form-data`
- **Key**: `file` ← **(this is the key for the file in the upload API)**
- **Value**: a `.eml` file (must contain at least one image attachment)

#### Sample `curl` Request:

```bash
curl -X POST http://localhost:3000/audit/upload \
  -F "file=@test-data/sample.eml"
```

> **Note:** There is a `test-data` folder in the repository with sample `.eml` files you can use to try out the API.

#### Success response:

```json
{
	"status": true,
	"data": {
		"emailSubject": "Re: Quarterly Report",
		"from": "john@company.com",
		"to": ["client@example.com"],
		"score": 80,
		"results": [
			{
				"ruleName": "GreetingRule",
				"passed": true,
				"score": 10,
				"justification": "Greeting is present."
			}
			// ...
		],
		"summary": "Passed 4 of 5 rules. 1 rule(s) need improvement."
	}
}
```

#### Error response:

```json
{
	"status": false,
	"reason": "No file uploaded"
}
```

---

## Logs

- `logs/info.log`: All successful actions
- `logs/error.log`: Rule failures, system errors, etc.
- Rotated daily, separated per level

---

## Folder Structure

```
src/
  audit/        - Report generation logic
  email/        - .eml parsing (plain, html, attachments)
  rules/        - Pluggable rules (greeting, tone, clarity)
  logger/       - Winston logger with rotation
uploads/        - Mounted volume for uploaded files
logs/           - Info + error logs (auto-created)
test-data/      - Sample .eml files for testing the API
```
