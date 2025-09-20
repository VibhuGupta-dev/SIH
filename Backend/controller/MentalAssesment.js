import mongoose from "mongoose";
import { starterAnswerSchema } from "../utils/StarterAnswerSchema.js";
import MentalHealthAssessment from "../models/MentalAssesmentModel.js";
import User from "../models/Usermodel.js";
import axios from "axios";

export const createMentalHealthAssessment = async (req, res) => {
  try {
    // Log received payload
    console.log("Received payload:", JSON.stringify(req.body, null, 2));

    // Validate mentalHealthAnswers
    const { error, value } = starterAnswerSchema.validate(req.body.mentalHealthAnswers, {
      abortEarly: false,
    });
    if (error) {
      console.error("Validation errors:", error.details);
      return res.status(400).json({ success: false, message: error.details.map((d) => d.message) });
    }

    // Verify userId
    const userId = req.body.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Check if user already has an assessment
    const existingAssessment = await MentalHealthAssessment.findOne({ userId });
    if (existingAssessment) {
      console.log("User already has an assessment:", existingAssessment._id);
      return res.status(403).json({
        success: false,
        message: "User has already completed the mental health assessment",
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Prepare data for MongoDB
    const assessmentData = {
      userId: new mongoose.Types.ObjectId(userId),
      starterAnswers: value,
      createdAt: new Date(req.body.createdAt || Date.now()),
    };

    console.log("Assessment data before save:", JSON.stringify(assessmentData, null, 2));

    // Save to MongoDB
    const assessment = new MentalHealthAssessment(assessmentData);
    const savedAssessment = await assessment.save();
    console.log("Saved assessment:", JSON.stringify(savedAssessment, null, 2));

    // Send to AI agent
    try {
      await axios.post(
        "https://x.ai/api/assessments",
        assessmentData,
        {
          headers: { Authorization: `Bearer ${process.env.AI_AGENT_TOKEN}` },
        }
      );
      console.log("Assessment sent to AI agent");
    } catch (aiError) {
      console.error("Failed to send to AI agent:", aiError.message);
    }

    res.status(201).json({
      success: true,
      message: "Mental health assessment created successfully",
      data: savedAssessment,
    });
  } catch (error) {
    console.error("Error in createMentalHealthAssessment:", error.message);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// New endpoint to check assessment status
export const checkAssessmentStatus = async (req, res) => {
  try {
    const userId = req.user._id; // From authMiddleware
    console.log("Checking assessment status for user:", userId);

    const assessment = await MentalHealthAssessment.findOne({ userId });
    const hasCompletedAssessment = !!assessment;

    res.status(200).json({
      success: true,
      hasCompletedAssessment,
    });
  } catch (error) {
    console.error("Error in checkAssessmentStatus:", error.message);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};