# 🔌 API Documentation

Welcome to the Nutrition Tracker API documentation! This guide covers all the APIs and services used by the application.

## 📋 Table of Contents

- [🔐 Authentication](#-authentication)
- [🍎 Food Data API](#-food-data-api)
- [👤 User Management](#-user-management)
- [📊 Nutrition Tracking](#-nutrition-tracking)
- [🎯 Goals & Progress](#-goals--progress)
- [📱 Device Integration](#-device-integration)
- [🔔 Notifications](#-notifications)
- [📈 Analytics](#-analytics)
- [❌ Error Handling](#-error-handling)
- [📝 Examples](#-examples)

---

## 🔐 Authentication

### JWT Token-based Authentication

All API requests require authentication using JWT tokens.

#### Login
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "def50200...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "profile": { ... }
    }
  }
}
```

#### Token Refresh
```typescript
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "def50200..."
}
```

#### Headers for Authenticated Requests
```typescript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🍎 Food Data API

### USDA FoodData Central Integration

#### Search Foods
```typescript
GET /api/foods/search?q={query}&pageSize={size}&pageNumber={page}

// Example
GET /api/foods/search?q=apple&pageSize=20&pageNumber=1

// Response
{
  "success": true,
  "data": {
    "foods": [
      {
        "fdcId": 171688,
        "description": "Apple, raw",
        "brandOwner": null,
        "ingredients": null,
        "foodNutrients": [
          {
            "nutrientId": 1008,
            "nutrientName": "Energy",
            "nutrientNumber": "208",
            "unitName": "kcal",
            "value": 52
          }
        ]
      }
    ],
    "totalHits": 1247,
    "currentPage": 1,
    "totalPages": 63
  }
}
```

#### Get Food Details
```typescript
GET /api/foods/{fdcId}

// Response
{
  "success": true,
  "data": {
    "fdcId": 171688,
    "description": "Apple, raw",
    "foodClass": "FinalFood",
    "foodNutrients": [
      {
        "type": "FoodNutrient",
        "id": 123456,
        "nutrient": {
          "id": 1008,
          "number": "208",
          "name": "Energy",
          "rank": 300,
          "unitName": "kcal"
        },
        "amount": 52
      }
    ],
    "foodPortions": [
      {
        "id": 12345,
        "amount": 1,
        "modifier": "cup, sliced",
        "gramWeight": 109,
        "sequenceNumber": 1
      }
    ]
  }
}
```

#### Barcode Lookup
```typescript
GET /api/foods/barcode/{gtinUpc}

// Example
GET /api/foods/barcode/012345678912
```

### Custom Food Database

#### Create Custom Food
```typescript
POST /api/foods/custom
Content-Type: application/json

{
  "name": "My Custom Recipe",
  "description": "Homemade protein smoothie",
  "servingSize": 350,
  "servingUnit": "ml",
  "nutritionPer100g": {
    "calories": 120,
    "protein": 15,
    "carbs": 8,
    "fat": 4,
    "fiber": 2,
    "sugar": 6,
    "sodium": 45
  },
  "ingredients": [
    {
      "name": "Protein powder",
      "amount": 30,
      "unit": "g"
    }
  ]
}
```

---

## 👤 User Management

### User Profile

#### Get User Profile
```typescript
GET /api/user/profile

// Response
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "profile": {
      "age": 30,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "activityLevel": "moderately_active",
      "goals": {
        "targetWeight": 65,
        "weeklyWeightLoss": 0.5,
        "calories": 2000,
        "protein": 150,
        "carbs": 200,
        "fat": 67
      }
    },
    "preferences": {
      "units": "metric",
      "theme": "dark",
      "notifications": true,
      "privacy": "private"
    }
  }
}
```

#### Update User Profile
```typescript
PUT /api/user/profile
Content-Type: application/json

{
  "name": "John Smith",
  "profile": {
    "weight": 69,
    "goals": {
      "calories": 1800
    }
  }
}
```

---

## 📊 Nutrition Tracking

### Daily Nutrition Log

#### Log Food Entry
```typescript
POST /api/nutrition/log
Content-Type: application/json

{
  "fdcId": 171688,
  "amount": 150,
  "unit": "g",
  "meal": "breakfast",
  "timestamp": "2024-01-15T08:30:00Z",
  "notes": "Medium apple with breakfast"
}

// Response
{
  "success": true,
  "data": {
    "id": "entry_456",
    "fdcId": 171688,
    "food": {
      "name": "Apple, raw",
      "description": "Fresh apple"
    },
    "amount": 150,
    "unit": "g",
    "meal": "breakfast",
    "nutrition": {
      "calories": 78,
      "protein": 0.4,
      "carbs": 20.6,
      "fat": 0.2,
      "fiber": 3.6,
      "sugar": 15.5
    },
    "timestamp": "2024-01-15T08:30:00Z"
  }
}
```

#### Get Daily Summary
```typescript
GET /api/nutrition/daily/{date}

// Example
GET /api/nutrition/daily/2024-01-15

// Response
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totalNutrition": {
      "calories": 1847,
      "protein": 142,
      "carbs": 156,
      "fat": 58,
      "fiber": 32,
      "sugar": 89,
      "sodium": 2100
    },
    "goals": {
      "calories": 2000,
      "protein": 150,
      "carbs": 200,
      "fat": 67
    },
    "progress": {
      "calories": 92.4,
      "protein": 94.7,
      "carbs": 78.0,
      "fat": 86.6
    },
    "meals": {
      "breakfast": [
        {
          "id": "entry_456",
          "food": "Apple, raw",
          "amount": "150g",
          "calories": 78
        }
      ],
      "lunch": [...],
      "dinner": [...],
      "snacks": [...]
    }
  }
}
```

#### Update Food Entry
```typescript
PUT /api/nutrition/log/{entryId}
Content-Type: application/json

{
  "amount": 200,
  "meal": "snacks"
}
```

#### Delete Food Entry
```typescript
DELETE /api/nutrition/log/{entryId}
```

---

## 🎯 Goals & Progress

### Nutrition Goals

#### Set Goals
```typescript
POST /api/goals/nutrition
Content-Type: application/json

{
  "type": "weight_loss",
  "targetWeight": 65,
  "timeframe": 12, // weeks
  "calories": 1800,
  "macros": {
    "protein": 140,
    "carbs": 150,
    "fat": 60
  },
  "micronutrients": {
    "fiber": 25,
    "sodium": 2300,
    "sugar": 50
  }
}
```

#### Get Progress Analytics
```typescript
GET /api/progress/analytics?period={period}&startDate={date}&endDate={date}

// Example
GET /api/progress/analytics?period=month&startDate=2024-01-01&endDate=2024-01-31

// Response
{
  "success": true,
  "data": {
    "period": "month",
    "summary": {
      "avgCalories": 1923,
      "avgProtein": 145,
      "goalAdherence": 87.5,
      "streakDays": 12,
      "totalEntries": 124
    },
    "trends": {
      "calories": [1850, 1920, 1890, ...],
      "weight": [70.2, 69.8, 69.5, ...],
      "dates": ["2024-01-01", "2024-01-02", ...]
    },
    "achievements": [
      {
        "id": "streak_7",
        "title": "7-Day Streak",
        "description": "Logged food for 7 consecutive days",
        "unlockedAt": "2024-01-08T00:00:00Z"
      }
    ]
  }
}
```

---

## 📱 Device Integration

### Apple Health / Google Fit

#### Sync Health Data
```typescript
POST /api/health/sync
Content-Type: application/json

{
  "provider": "apple_health", // or "google_fit"
  "data": {
    "weight": [
      {
        "value": 69.5,
        "unit": "kg",
        "timestamp": "2024-01-15T07:00:00Z"
      }
    ],
    "steps": [
      {
        "value": 8547,
        "date": "2024-01-15"
      }
    ],
    "activeEnergy": [
      {
        "value": 456,
        "unit": "kcal",
        "date": "2024-01-15"
      }
    ]
  }
}
```

#### Get Health Data
```typescript
GET /api/health/data?types={types}&startDate={date}&endDate={date}

// Example
GET /api/health/data?types=weight,steps&startDate=2024-01-01&endDate=2024-01-15
```

---

## 🔔 Notifications

### Push Notifications

#### Register Device
```typescript
POST /api/notifications/register
Content-Type: application/json

{
  "token": "expo_push_token_here",
  "platform": "ios", // or "android"
  "preferences": {
    "mealReminders": true,
    "goalReminders": true,
    "achievements": true,
    "weeklyReports": true
  }
}
```

#### Send Custom Notification
```typescript
POST /api/notifications/send
Content-Type: application/json

{
  "userId": "user_123",
  "title": "Meal Reminder",
  "body": "Don't forget to log your lunch!",
  "data": {
    "type": "meal_reminder",
    "meal": "lunch"
  }
}
```

---

## 📈 Analytics

### Usage Analytics

#### Track Event
```typescript
POST /api/analytics/track
Content-Type: application/json

{
  "event": "food_logged",
  "properties": {
    "meal": "breakfast",
    "foodType": "fruit",
    "method": "search", // or "barcode", "recent"
    "timestamp": "2024-01-15T08:30:00Z"
  }
}
```

#### Get App Metrics
```typescript
GET /api/analytics/metrics?period={period}

// Response
{
  "success": true,
  "data": {
    "period": "month",
    "metrics": {
      "dailyActiveUsers": 1247,
      "avgSessionDuration": 8.5,
      "retentionRate": 76.3,
      "foodEntriesPerDay": 4.2,
      "topFeatures": [
        "food_search",
        "barcode_scan",
        "meal_logging"
      ]
    }
  }
}
```

---

## ❌ Error Handling

### Error Response Format

All API errors follow a consistent format:

```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

---

## 📝 Examples

### Complete Food Logging Flow

```typescript
// 1. Search for food
const searchResponse = await fetch('/api/foods/search?q=banana');
const foods = await searchResponse.json();

// 2. Get detailed nutrition info
const foodDetails = await fetch(`/api/foods/${foods.data.foods[0].fdcId}`);
const nutrition = await foodDetails.json();

// 3. Log the food entry
const logResponse = await fetch('/api/nutrition/log', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fdcId: nutrition.data.fdcId,
    amount: 120,
    unit: 'g',
    meal: 'breakfast',
    timestamp: new Date().toISOString()
  })
});

// 4. Get updated daily summary
const dailyData = await fetch('/api/nutrition/daily/2024-01-15');
const summary = await dailyData.json();
```

### Batch Operations

```typescript
// Log multiple foods at once
POST /api/nutrition/log/batch
Content-Type: application/json

{
  "entries": [
    {
      "fdcId": 171688,
      "amount": 150,
      "unit": "g",
      "meal": "breakfast"
    },
    {
      "fdcId": 174557,
      "amount": 240,
      "unit": "ml",
      "meal": "breakfast"
    }
  ]
}
```

---

## 🔗 API Versioning

Current API version: `v1`

All endpoints are prefixed with `/api/v1/`

Future versions will be backward compatible with deprecation notices.

## 📊 Rate Limiting

- **Standard users**: 1000 requests/hour
- **Premium users**: 5000 requests/hour  
- **Burst limit**: 100 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642262400
```

## 🔒 Security

- All API communications use HTTPS
- JWT tokens expire after 24 hours
- Refresh tokens expire after 30 days
- All sensitive data is encrypted at rest
- API keys should never be exposed in client-side code

---

**Need help?** Contact our support team at `api-support@nutritiontracker.dev` 