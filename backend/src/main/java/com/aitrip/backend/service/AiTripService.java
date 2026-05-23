package com.aitrip.backend.service;

import com.aitrip.backend.model.Itinerary;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AiTripService {

    @Value("${openrouter.api-key}")
    private String apiKey;

    private static final String AI_URL = "https://api.groq.com/openai/v1/chat/completions";

    public Itinerary generateTrip(String destination, int days, String budget, String style) {
        Itinerary trip = callAiApi(destination, days, budget, style, "llama-3.3-70b-versatile");
        if (trip != null) return trip;

        System.out.println("⚠️ Primary AI failed. Switching to Backup Model...");
        return callAiApi(destination, days, budget, style, "llama-3.1-8b-instant");
    }

    private Itinerary callAiApi(String destination, int days, String budget, String style, String modelName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey.trim());

            String prompt = String.format(
                "Generate a detailed %d-day itinerary for %s. Style: %s. Budget: %s. JSON ONLY. " +
                "Structure: { \"destination\": \"%s\", \"hotels\": [{\"name\": \"...\", \"price\": \"...\", \"rating\": \"...\", \"address\": \"...\"}], " +
                "\"days\": [{\"day\": 1, \"activities\": [{\"time\": \"...\", \"description\": \"...\", \"cost\": 0, \"type\": \"Place\", \"name\": \"...\"}]}] } " +
                "RULES: 1. Use 'activities' key. 2. Descriptions 3-4 sentences. 3. Prices in ₹.", 
                days, destination, style, budget, destination
            );

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(AI_URL, entity, String.class);
            
            return parseAiResponse(response.getBody(), destination);

        } catch (Exception e) {
            System.err.println("❌ AI ERROR (" + modelName + "): " + e.getMessage());
            return null;
        }
    }

    private Itinerary parseAiResponse(String response, String destination) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            
            var root = mapper.readTree(response);
            String text = root.path("choices").get(0).path("message").path("content").asText();
            text = text.replaceAll("```json", "").replaceAll("```", "").trim();
            if (text.indexOf("{") != -1) {
                text = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
            }
            
            JsonNode jsonNode = mapper.readTree(text);
            Itinerary itinerary = new Itinerary();
            itinerary.setDestination(destination);
            
            if (jsonNode.has("hotels")) {
                itinerary.setHotels(mapper.convertValue(jsonNode.get("hotels"), new TypeReference<List<Itinerary.Hotel>>() {}));
            }

            if (jsonNode.has("days")) {
                List<Itinerary.DayPlan> daysList = new ArrayList<>();
                for (JsonNode dayNode : jsonNode.get("days")) {
                    Itinerary.DayPlan dayPlan = new Itinerary.DayPlan();
                    dayPlan.setDay(dayNode.get("day").asInt());
                    
                    JsonNode activitiesNode = dayNode.has("activities") ? dayNode.get("activities") : dayNode.get("events");
                    if (activitiesNode != null) {
                        dayPlan.setActivities(mapper.convertValue(activitiesNode, new TypeReference<List<Itinerary.Activity>>() {}));
                    }
                    daysList.add(dayPlan);
                }
                itinerary.setDays(daysList);
            }
            return itinerary;

        } catch (Exception e) { 
            return null; 
        }
    }
}