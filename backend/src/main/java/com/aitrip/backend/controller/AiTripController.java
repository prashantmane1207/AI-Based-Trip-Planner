package com.aitrip.backend.controller;

import com.aitrip.backend.model.Itinerary;
import com.aitrip.backend.model.Trip;
import com.aitrip.backend.model.User;
import com.aitrip.backend.service.AiTripService;
import com.aitrip.backend.repository.TripRepository;
import com.aitrip.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AiTripController {

    @Autowired
    private AiTripService aiTripService;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        Optional<User> user = userRepository.findByEmail(loginData.get("email"));
        if (user.isPresent() && user.get().getPassword().equals(loginData.get("password"))) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @PostMapping("/trips/generate")
    public Itinerary generateTrip(@RequestBody Map<String, Object> request) {
        String destination = (String) request.get("destination");
        int days = Integer.parseInt(request.get("days").toString());
        String budget = (String) request.get("budget");
        String style = (String) request.get("style");
        return aiTripService.generateTrip(destination, days, budget, style);
    }

    // 🟢 DEBUGGED SAVE ENDPOINT
    @PostMapping("/trips/save")
    public ResponseEntity<String> saveTrip(@RequestBody Trip trip) {
        try {
            System.out.println("📥 Receiving Trip Save Request...");
            System.out.println("👤 User: " + trip.getUserId());
            System.out.println("📍 Dest: " + trip.getDestination());
            
            if (trip.getItinerary() == null) {
                System.err.println("❌ Error: Itinerary data is NULL");
                return ResponseEntity.badRequest().body("Itinerary data is missing");
            }

            Trip savedTrip = tripRepository.save(trip);
            System.out.println("✅ Trip Saved Successfully with ID: " + savedTrip.getId());
            
            return ResponseEntity.ok("Trip saved successfully! ✅");
        } catch (Exception e) {
            System.err.println("❌ Database Save Failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/trips/user/{userId}")
    public List<Trip> getUserTrips(@PathVariable String userId) {
        return tripRepository.findByUserId(userId);
    }
}