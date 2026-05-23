package com.aitrip.backend.repository;

import com.aitrip.backend.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends MongoRepository<Trip, String> {
    // 🟢 This finds all trips for a specific user email
    List<Trip> findByUserId(String userId);
}