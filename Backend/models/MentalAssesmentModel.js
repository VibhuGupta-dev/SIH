// models/MentalAssessmentModel.js
import mongoose from "mongoose";

const userMentalHealthAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  starterAnswers: [
    {
      questionText: { type: String, required: true },
      selectedOption: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MentalHealthAssessment", userMentalHealthAssessmentSchema);