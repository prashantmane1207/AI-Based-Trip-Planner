package com.aitrip.backend.repository;

import com.aitrip.backend.model.Itinerary;
import org.springframework.data.mongodb.repository.MongoRepository; // 🟢 Use MongoRepository
import org.springframework.stereotype.Repository;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, String> {
    // String is used here because MongoDB IDs are Strings
}