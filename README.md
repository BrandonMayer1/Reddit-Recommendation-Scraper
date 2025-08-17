npm build
npm start
# Reddit Recommendation Scraper

A tool to scrape Reddit recommendations and leverage AI (Ollama with Llama 3.1) for enhanced insights.

## Prerequisites

- **Ollama** installed with the **Llama 3.1** model.
- A Reddit app with your credentials:
  - `REDDIT_CLIENT_ID`
  - `REDDIT_CLIENT_SECRET`
  - `REDDIT_USER_AGENT`

## Setup

1. Clone the repository:
	```bash
	git clone https://github.com/BrandonMayer1/Reddit-Recommendation-Scraper
	cd Reddit-Recommendation-Scraper
	```

2. Create a `.env` file in the root directory and add your Reddit credentials:
	```
	REDDIT_CLIENT_ID=your_client_id
	REDDIT_CLIENT_SECRET=your_client_secret
	REDDIT_USER_AGENT=your_user_agent
	```

3. Install dependencies:
	```bash
	npm run installAll
	```

4. Build the project:
	```bash
	npm run build
	```

5. Start the application:
	```bash
	npm start
	```

6. Open your browser and visit [http://localhost:3000](http://localhost:3000)



