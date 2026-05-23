package com.aitrip.backend.model;

import java.util.List;

public class Itinerary {
    private String destination;
    private List<Hotel> hotels;
    private List<DayPlan> days;

    // Getters and Setters
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public List<Hotel> getHotels() { return hotels; }
    public void setHotels(List<Hotel> hotels) { this.hotels = hotels; }
    
    public List<DayPlan> getDays() { return days; }
    public void setDays(List<DayPlan> days) { this.days = days; }

    // 🟢 THESE ARE THE MISSING CLASSES CAUSING YOUR ERROR
    public static class Hotel {
        private String name;
        private String price;
        private String rating;
        private String address;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPrice() { return price; }
        public void setPrice(String price) { this.price = price; }
        public String getRating() { return rating; }
        public void setRating(String rating) { this.rating = rating; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    public static class DayPlan {
        private int day;
        private List<Activity> activities;

        public int getDay() { return day; }
        public void setDay(int day) { this.day = day; }
        public List<Activity> getActivities() { return activities; }
        public void setActivities(List<Activity> activities) { this.activities = activities; }
    }

    public static class Activity {
        private String time;
        private String name;
        private String description;
        private String cost;
        private String type;

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCost() { return cost; }
        public void setCost(String cost) { this.cost = cost; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }
}