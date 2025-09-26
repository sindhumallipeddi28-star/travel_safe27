
const express = require('express');
const { getDb } = require('../db');
const { ObjectId } = require('mongodb');

const router = express.Router();

// GET all trips (with filtering)
router.get('/', async (req, res) => {
  const db = getDb();
  const tripsCollection = db.collection('trips');

  try {
    const query = {};
    const { mode, purpose, startDate, endDate } = req.query;
    
    if (mode) query.mode = mode;
    if (purpose) query.purpose = purpose;
    
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) {
        // Set to start of the day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.startTime.$gte = start.toISOString();
      }
      if (endDate) {
        // Set to end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.startTime.$lte = end.toISOString();
      }
    }

    const trips = await tripsCollection.find(query).sort({ startTime: -1 }).toArray();
    
    // Map _id to id for frontend compatibility
    const formattedTrips = trips.map(trip => {
      const { _id, ...rest } = trip;
      return { id: _id.toString(), ...rest };
    });

    res.status(200).json(formattedTrips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST a new trip
router.post('/', async (req, res) => {
  const db = getDb();
  const tripsCollection = db.collection('trips');

  try {
    const tripData = req.body;
    const errors = {};

    // --- Validation Logic ---
    if (!tripData.origin || typeof tripData.origin.lat !== 'number' || typeof tripData.origin.lon !== 'number') {
        errors.origin = 'Origin with valid latitude and longitude is required.';
    }
    if (!tripData.destination || typeof tripData.destination.lat !== 'number' || typeof tripData.destination.lon !== 'number') {
        errors.destination = 'Destination with valid latitude and longitude is required.';
    }
    if (!tripData.startTime) errors.startTime = 'Start time is required.';
    if (!tripData.endTime) errors.endTime = 'End time is required.';
    
    if (tripData.startTime && tripData.endTime && new Date(tripData.endTime) <= new Date(tripData.startTime)) {
        errors.endTime = 'End time must be after start time.';
    }

    const distance = Number(tripData.distance);
    if (isNaN(distance) || distance < 0) {
        errors.distance = 'Distance must be a non-negative number.';
    }

    const companions = Number(tripData.companions);
    if (isNaN(companions) || companions < 0) {
        errors.companions = 'Companions must be a non-negative number.';
    }

    const cost = Number(tripData.cost);
    if (isNaN(cost) || cost < 0) {
        errors.cost = 'Cost must be a non-negative number.';
    }
    
    const requiredFields = ['mode', 'purpose', 'frequency'];
    requiredFields.forEach(field => {
        if (!tripData[field]) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        }
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    // --- End Validation Logic ---

    const tripCount = await tripsCollection.countDocuments();
    const newTrip = {
      ...tripData,
      tripNumber: tripCount + 1,
      distance: Number(tripData.distance),
      companions: Number(tripData.companions),
      cost: Number(tripData.cost),
    };
    
    const result = await tripsCollection.insertOne(newTrip);
    
    if (result.insertedId) {
        const { _id, ...rest } = newTrip;
        res.status(201).json({ id: result.insertedId.toString(), ...rest });
    } else {
        throw new Error('Failed to insert new trip');
    }

  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
