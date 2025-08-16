import praw
from ollama import chat
from ollama import ChatResponse
import json
from urllib.parse import urlparse
import os
from dotenv import load_dotenv
from praw.models import Comment
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


class QueryRequest(BaseModel):
    query: str

load_dotenv()  

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

app = FastAPI()
##Starts APP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_valid_reddit_url(url):
    """Check if URL is a valid Reddit post URL"""
    parsed = urlparse(url)
    return parsed.netloc.endswith('reddit.com') and '/comments/' in url

def search_product(query):
    posts = []
    for post in reddit.subreddit("all").search(query,limit=5,sort= "top",syntax="lucene"):
        if is_valid_reddit_url(post.url):
            posts.append({
                "title": post.title,
                "text": post.selftext,
                "upvotes": post.score,
                "url": f"https://www.reddit.com{post.permalink}",
            })
    return posts

def search_comments(url, comment_limit=5):
    submission = reddit.submission(url=url)
    submission.comment_sort = 'top'
    submission.comments.replace_more(limit=0)
    top_comments = []
    for comment in submission.comments.list()[:comment_limit]:
            if isinstance(comment, Comment):
                if comment.body and not comment.body == "[deleted]":
                    top_comments.append({
                        "text": comment.body,
                        "upvotes": comment.score
                    })
    return top_comments


def AIchat(Json, query):
    response: ChatResponse = chat(model='llama3.1', messages=[
    {
        'role': 'system',
        'content': f"""
        You are an expert product review analyst.  
        I will give you a JSON object containing Reddit posts and their top comments about a product.  

        Each post has:
        - "name": title of the Reddit post
        - "upvotes": number of upvotes the post received
        - "content": the body text of the post
        - "Comments": a list of comments with "content" and "upvotes"

        Your task:
        1. Summarize the key insights and common opinions from the posts and comments.
        2. Highlight pros and cons mentioned by users.
        3. Identify the most recommended brands or models (if applicable).
        4. Give a final recommendation based on the users original Question.
        5. Respond in markdown.

        Here is the JSON data: {Json}
        
        """,
    },
    {
        'role': 'user',
        'content': query,
    },
    ])
    print(response.message.content)
    return(response.message.content)
@app.post("/")
def analyze(request: QueryRequest):
    print(f"Backend Recieved: {request}")
    query = request.query
    posts = search_product(query)
    results = []
    
    for post in posts:
        post_data = {
            "Post": {
                "name": post["title"],
                "upvotes": post["upvotes"],
                "content": post["text"]
            },
            "Comments": []
        }
        
        comments = search_comments(post["url"])
        for comment in comments:
            post_data["Comments"].append({
                "content": comment["text"],
                "upvotes": comment["upvotes"],
            })
        results.append(post_data)
    aiResult = AIchat(json.dumps(results, indent=2), query)
    return{"ai_result": aiResult}
    


    