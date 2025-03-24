from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
import random
import logging
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Yen to Dong Navigator API")

# Enable CORS - essential for separate frontend/backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models - equivalent to your Zod schemas
class SuggestionType(str, Enum):
    BUY = "buy"
    SELL = "sell"
    HOLD = "hold"

class AlertModel(BaseModel):
    rate: float
    email: str
    type: SuggestionType

class PollModel(BaseModel):
    vote: SuggestionType
    email: Optional[str] = None

# Storage implementation - replace with your actual database connection
class Storage:
    def __init__(self):
        self.current_rate = 172.3
        self.mock_history = []
        self.mock_alerts = []
        self.mock_polls = []
        
        # Generate mock historical data
        import math
        
        today = datetime.now()
        for i in range(30, -1, -1):
            date = today - timedelta(days=i)
            variation = math.sin(i / 5) * 3 + random.random() * 0.5
            rate = 172.3 + variation
            self.mock_history.append({
                "date": date.strftime("%Y-%m-%d"),
                "rate": round(rate, 2)
            })
        
        # Generate mock poll data
        for _ in range(1400):
            rand = random.random()
            if rand < 0.68:
                vote = SuggestionType.BUY
            elif rand < 0.9:
                vote = SuggestionType.HOLD
            else:
                vote = SuggestionType.SELL
            self.mock_polls.append({"vote": vote})

    async def getCurrentRate(self):
        return self.mock_history[-1]["rate"]
    
    async def getRateHistory(self, days: int):
        return self.mock_history[-days:]
    
    async def getForecast(self, days: int):
        current_rate = self.mock_history[-1]["rate"]
        forecast = []
        start_date = datetime.now() + timedelta(days=1)
        
        for i in range(days):
            date = start_date + timedelta(days=i)
            rate = current_rate + (i * 0.5) + (random.random() * 0.2)
            confidence_range = 0.5 + (i * 0.3)
            forecast.append({
                "date": date.strftime("%Y-%m-%d"),
                "rate": round(rate, 2),
                "confidence": [round(rate - confidence_range, 2), round(rate + confidence_range, 2)]
            })
        return forecast
    
    async def getSuggestion(self):
        history = self.mock_history[-7:]
        if len(history) < 2:
            return "neutral"
        
        first_rate = history[0]["rate"]
        last_rate = history[-1]["rate"]
        percent_change = ((last_rate - first_rate) / first_rate) * 100
        
        if percent_change > 1:
            return "good"
        if percent_change < -1:
            return "bad"
        return "neutral"
    
    async def createAlert(self, alert_data):
        alert = {
            "id": str(len(self.mock_alerts) + 1),
            "created": datetime.now().isoformat(),
            "triggered": False,
            **alert_data.dict()
        }
        self.mock_alerts.append(alert)
        return alert
    
    async def getAlerts(self):
        return self.mock_alerts
    
    async def createPoll(self, poll_data):
        poll = {
            "id": str(len(self.mock_polls) + 1),
            "created": datetime.now().isoformat(),
            **poll_data.dict()
        }
        self.mock_polls.append(poll)
        return poll
    
    async def getPollSummary(self):
        total = len(self.mock_polls)
        yes_count = sum(1 for poll in self.mock_polls if poll["vote"] == SuggestionType.BUY)
        neutral_count = sum(1 for poll in self.mock_polls if poll["vote"] == SuggestionType.HOLD)
        no_count = sum(1 for poll in self.mock_polls if poll["vote"] == SuggestionType.SELL)
        
        return {
            "yes": {
                "count": yes_count,
                "percentage": round((yes_count / total) * 100)
            },
            "neutral": {
                "count": neutral_count,
                "percentage": round((neutral_count / total) * 100)
            },
            "no": {
                "count": no_count,
                "percentage": round((no_count / total) * 100)
            },
            "total": total
        }

storage = Storage()

# API Routes
@app.get("/api/rate/current")
async def get_current_rate():
    try:
        rate = await storage.getCurrentRate()
        return {"rate": rate, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        logger.error(f"Error fetching current rate: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error fetching current exchange rate")

@app.get("/api/rate/history")
async def get_rate_history(days: int = Query(30)):
    try:
        history = await storage.getRateHistory(days)
        return history
    except Exception as e:
        logger.error(f"Error fetching rate history: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error fetching historical exchange rates")

@app.get("/api/forecast")
async def get_forecast(days: int = Query(7)):
    try:
        forecast = await storage.getForecast(days)
        return forecast
    except Exception as e:
        logger.error(f"Error fetching forecast: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error fetching exchange rate forecast")

@app.get("/api/suggestion")
async def get_suggestion():
    try:
        suggestion = await storage.getSuggestion()
        return {"suggestion": suggestion}
    except Exception as e:
        logger.error(f"Error getting suggestion: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error getting exchange rate suggestion")

@app.post("/api/alert")
async def create_alert(alert: AlertModel):
    try:
        result = await storage.createAlert(alert)
        return JSONResponse(status_code=201, content=result)
    except Exception as e:
        logger.error(f"Error creating alert: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error creating alert")

@app.get("/api/alerts")
async def get_alerts():
    try:
        alerts = await storage.getAlerts()
        return alerts
    except Exception as e:
        logger.error(f"Error fetching alerts: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error fetching alerts")

@app.post("/api/poll")
async def submit_poll(poll: PollModel):
    try:
        result = await storage.createPoll(poll)
        return JSONResponse(status_code=201, content=result)
    except Exception as e:
        logger.error(f"Error creating poll: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error creating poll")

@app.get("/api/poll/summary")
async def get_poll_summary():
    try:
        summary = await storage.getPollSummary()
        return summary
    except Exception as e:
        logger.error(f"Error fetching poll summary: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error fetching poll summary")

# For development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)