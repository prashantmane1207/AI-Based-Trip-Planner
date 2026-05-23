package com.aitrip.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "trips")
public class Trip {
    @Id
    private String id;
    private String userId;
    private String destination;
    private Itinerary itinerary; // 🟢 Make sure this matches your Itinerary.java

    public Trip() {}

    public Trip(String userId, String destination, Itinerary itinerary) {
        this.userId = userId;
        this.destination = destination;
        this.itinerary = itinerary;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public Itinerary getItinerary() { return itinerary; }
    public void setItinerary(Itinerary itinerary) { this.itinerary = itinerary; }
}