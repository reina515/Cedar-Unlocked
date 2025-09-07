export const SelectTravelersList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    people: "1 Person",
    image: require("../assets/images/solo.jpg"),
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    people: "2 People",
    image: require("../assets/images/couple.jpg"),
  },
  {
    id: 3,
    title: "A Family",
    desc: "A group of fun adventures",
    people: "3 to 7 People",
    icon: "🌆",
    image: require("../assets/images/family.jpg"),
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekers",
    people: "5 to 10 People",
    image: require("../assets/images/friends.jpg"),
  },
];
export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: `Budget-friendly stays, public transport, local food, and free/low-cost sightseeing. Perfect for travelers who want a rich experience without overspending.`,
  },
  {
    id: 2,
    title: 'Moderate',
    desc: `Comfortable hotels, private taxis, mix of local and international dining, guided tours for main attractions. Ideal for travelers who want comfort without breaking the bank.`,
  },
  {
    id: 3,
    title: 'Luxury',
    desc: `5-star hotels, private transport, fine dining, exclusive tours and experiences. Designed for travelers who want to enjoy the best Lebanon has to offer.`,
  }
];
export const AI_PROMT = `
You are a travel expert. Generate a personalized Travel Plan for Location: {location}, for {totalDays} Days and {totalNight} Night for a {traveler} traveler with a {budget} budget.

TRAVELER PERSONALITY GUIDE:
- Explorer: Focus on adventure activities, hiking, nature reserves, hidden gems, outdoor experiences, and unique local discoveries
- Foodie: Emphasize authentic restaurants, street food tours, cooking classes, local markets, wine tastings, and culinary experiences  
- Relaxer: Prioritize spas, wellness centers, peaceful beaches, scenic viewpoints, leisurely walks, and stress-free activities
- Culture Seeker: Highlight museums, historical sites, art galleries, cultural events, traditional performances, and heritage tours
- Party Animal: Include vibrant nightlife, bars, clubs, social venues, festivals, beach parties, and energetic social experiences

CRITICAL REQUIREMENTS:
- Tailor ALL recommendations to match the {traveler} personality type
- Use REAL hotel names that actually exist in or near {location}
- Hotels must be located within {location} or very close proximity (within 5-10 minutes travel time)
- Provide REAL attractions and landmarks specific to the traveler type within {location}
- Give REALISTIC price estimates based on current market rates
- Include ACTUAL coordinates for locations within {location}
- Use genuine ratings from review sites
- Provide detailed, helpful descriptions that match the traveler's interests
- NEVER use "N/A", "Hotel Name 1", or placeholder text
- Research actual hotels, restaurants, and attractions that suit the {traveler} personality
- DO NOT include airport transfers, flight arrivals, or departure activities in daily itinerary
- The "totalBudgetBreakdown" must contain ONLY numbers with a "$" range (no text or explanations).

CRITICAL FOR DAILY ITINERARY:
- "dailyItinerary" must contain exactly {totalDays} days.
- Always generate keys from "day1" through "day{totalDays}".
- Each day must have at least 3–5 activities.
- Do not stop early. Each day must be included.
- Do not add explanations outside of JSON.

RESPONSE FORMAT: Return ONLY valid JSON (no markdown, no explanation text):

{
  "tripDetails": {
    "destination": "{location}",
    "duration": "{totalDays} days, {totalNight} nights",
    "budget": "{budget}",
    "travelerType": "{traveler}",
    "personalityFocus": "Customized for {traveler} - [brief description of what this means for the trip]"
  },
  "flightDetails": {
    "departureAirport": "Nearest major airport to user",
    "arrivalAirport": "Main airport serving {location}",
    "estimatedPrice": "$400-800 (round trip)",
    "duration": "Estimated flight time",
    "bookingUrl": "https://www.skyscanner.com",
    "airlines": ["Major airlines serving this route"],
    "bestTimeToBook": "Booking recommendation"
  },
  "hotels": [
    {
      "hotelName": "Actual hotel name in {location}",
      "hotelAddress": "Full address within {location}",
      "price": "$X-Y per night",
      "hotelImageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "geoCoordinates": {
        "latitude": "XX.XXXX",
        "longitude": "XX.XXXX"
      },
      "rating": "X.X/5",
      "description": "Hotel description explaining why it's perfect for {traveler} travelers, highlighting specific amenities and features that match their personality.",
      "amenities": ["Pool", "Spa", "Gym", "WiFi", "Restaurant", "Room Service"],
      "whyPerfectFor": "Specific reasons why this hotel suits a {traveler}",
      "placesNearby": [
        {
          "placeName": "Actual attraction name near hotel",
          "placeDetails": "Description of place and why it appeals to {traveler}",
          "placeImageUrl": "https://images.unsplash.com/relevant-image",
          "geoCoordinates": {
            "latitude": "XX.XXXX",
            "longitude": "XX.XXXX"
          },
          "ticketPricing": "Actual pricing or 'Free entry'",
          "travelTime": "X minutes by car, Y minutes walking",
          "relevanceToTraveler": "Why this appeals specifically to a {traveler}"
        }
      ]
    }
  ],
  "flights": [
    {
      "airline": "Major Airline Name",
      "flightNumber": "XX1234",
      "origin": "Departure City/Airport",
      "destination": "{location} Airport",
      "departureDate": "Flexible dates recommended",
      "returnDate": "Based on {totalDays} duration",
      "price": "$400-800",
      "bookingUrl": "https://www.skyscanner.com"
    }
  ],
  "placesNearby": [
    {
      "placeName": "Top attraction in {location} for {traveler}",
      "placeDetails": "Detailed description of why this place is perfect for {traveler} personality",
      "placeImageUrl": "https://images.unsplash.com/relevant-image",
      "geoCoordinates": {
        "latitude": "XX.XXXX",
        "longitude": "XX.XXXX"
      },
      "ticketPricing": "Actual entry cost",
      "travelTime": "Travel time from city center"
    }
  ],
  "dailyItinerary": {
    "day1": [
      {
        "time": "09:00 AM",
        "activity": "Activity name tailored to {traveler} personality",
        "location": "Specific location within {location}",
        "description": "Detailed description explaining why this activity suits a {traveler} and what they'll experience",
        "duration": "2 hours",
        "estimatedCost": "$X-Y",
        "travelerTip": "Special tip for {traveler} personality type for this specific activity"
      }
    ],
    "day2": [
      {
        "time": "10:00 AM",
        "activity": "Second day activity for {traveler}",
        "location": "Another location in {location}",
        "description": "Why this experience matches {traveler} interests",
        "duration": "3 hours", 
        "estimatedCost": "$X-Y",
        "travelerTip": "Insider tip for {traveler} travelers"
      }
    ],
      "... up to day{totalDays} ..."
  },
  "totalBudgetBreakdown": {
    "flights": "$400-800",
    "accommodation": "$X-Y ,
    "food": "$X-Y",
    "activities": "$X-Y", 
    "transportation": "$X-Y",
    "personalitySpecific": "$X-Y ,
    "total": "$XXXX-YYYY"
  },
  "localTips": [
    "Currency and payment methods accepted in {location}",
    "Transportation tips within {location}",
    "Cultural etiquette specific to {location}",
    "Best areas to stay in {location} for {traveler} personality",
    "Specific tip for {traveler} travelers: [personality-specific advice for {location}]"
  ],
  "tripSummary": "A comprehensive 2-3 sentence summary of what makes this trip perfect for a {traveler} traveler visiting {location}, highlighting the key experiences and why they'll love this itinerary."
}

Remember: 
- Hotels MUST be actually located in {location} or immediate vicinity
- All field names must match exactly: "hotels", "flights", "placesNearby", "dailyItinerary", "totalBudgetBreakdown", "localTips", "tripSummary"
- Daily itinerary should use "day1", "day2", etc. as keys
- Each activity must have: time, activity, location, description, duration, estimatedCost, travelerTip
- Hotel placesNearby must include: placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, travelTime, relevanceToTraveler
- Flight objects need: airline, flightNumber, origin, destination, departureDate, returnDate, price, bookingUrl
- Places nearby need: placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, travelTime
- Research real establishments within {location} that match {traveler} preferences
- Customize every aspect specifically for both the {traveler} personality AND the {location}
- Never include airport activities in daily itinerary - focus on destination experiences only
- Budget breakdown values MUST be only "$amount-range" (no text, no notes, no descriptions).
- Daily itinerary must exactly match the {totalDays} requested.
- Never include markdown formatting, explanations, or placeholder values.
`;