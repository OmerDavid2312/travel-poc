# Weather API Example

## Endpoint
```
GET http://localhost:3030/api/v1/weather?city=<CITY>&trip=<TRIPNAME>&startDate=<STARTDATE>&endDate=<ENDDATE>
```

## Example Request
```
GET http://localhost:3030/api/v1/weather?city=Paris&trip=Summer%20Vacation%202024&startDate=2024-09-27&endDate=2024-10-03
```

## Expected Response Format
```json
{
  "icon": "☀️",
  "temperature": 25,
  "condition": "שמש בהירה",
  "forecast": "☀️ 27 בספט׳ – 3 באוק׳: טמפרטורה צפויה 25–29°C, רוב הזמן שמש, יומיים עם סיכוי לגשם קל בערב.",
  "summary": "Miami's weather in October 2025 is expected to be warm and sunny, with some potential rain showers. Here's a breakdown of what you can expect:\n\n**Temperature:**\n\n* Daytime temperatures will likely range from the mid-80s to low 90s Fahrenheit (29°C - 32°C).\n* Nighttime temperatures will be in the mid-70s to low 80s Fahrenheit (23°C - 27°C).\n\n**Humidity:**\n\n* The relative humidity will decrease significantly as October progresses, with an average of 60% during the first half of the month and around 50% towards the end.\n\n**Rainfall:**\n\n* October is generally a dry month in Miami, but you can expect occasional rain showers. On average, Miami receives around 2-3 inches (5-7.5 cm) of rainfall in October.\n* The most likely time for rain is during late morning and early afternoon.\n\n**Sunshine:**\n\n* Miami enjoys an average of 9 hours of sunshine per day in October, making it a great time to enjoy outdoor activities like beach trips, boat tours, or exploring the city's parks and gardens.\n\n**Hurricane Season:**\n\n* Keep in mind that Miami is still within the Atlantic hurricane season, which runs from June 1st to November 30th.\n* Although the chances of a hurricane hitting Miami are relatively low during October, it's always best to monitor weather forecasts and be prepared for any potential storms.\n\nOverall, Miami's weather in October 2025 will likely be warm, sunny, and dry, making it an excellent time to enjoy the city's outdoor attractions."
}
```

## Request Parameters

- `city`: שם העיר (לדוגמה: "Paris", "Miami", "תל אביב")
- `trip`: שם הטיול (לדוגמה: "Summer Vacation 2024")
- `startDate`: תאריך התחלה בפורמט ISO (YYYY-MM-DD)
- `endDate`: תאריך סיום בפורמט ISO (YYYY-MM-DD)

## Response Fields

- `icon`: אייקון מזג האוויר (emoji)
- `temperature`: טמפרטורה נוכחית במעלות צלזיוס
- `condition`: תיאור קצר של מזג האוויר
- `forecast`: תחזית מפורטת בעברית עם אייקונים
- `summary`: תחזית מפורטת מ-LLM עם מידע מקיף על מזג האוויר לתאריכי הטיול הספציפיים (אופציונלי)

## Error Handling
If the API is not available, the frontend will show a fallback message and continue to work normally.
