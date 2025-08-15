// server/credibility.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

/**
 * Calculate credibility score from multiple factors
 * Factors: sourceReliability (30%), factualAccuracy (30%), biasLevel (20%), userVotes (10%), blockchainVerification (10%)
 */
function calculateCredibility({ sourceReliability, factualAccuracy, biasLevel, userVotes, blockchainVerification }) {
  const weightedScore =
    sourceReliability * 0.3 +
    factualAccuracy * 0.3 +
    biasLevel * 0.2 +
    userVotes * 0.1 +
    blockchainVerification * 0.1;

  return Math.round(weightedScore);
}

// Mock function to fetch reliability score of a news source
async function getSourceReliability(sourceName) {
  const database = {
    "BBC": 90,
    "CNN": 85,
    "RandomBlog": 40,
    "UnknownSource": 30
  };
  return database[sourceName] || 50;
}

// Mock NLP check for factual accuracy (simulated)
async function getFactualAccuracy(articleText) {
  // Later: integrate with Google Fact Check API or AI
  if (articleText.includes("breaking news")) return 85;
  return 75;
}

// Bias detection (simulated sentiment analysis)
async function getBiasLevel(articleText) {
  // Later: use NLP libraries
  return 70;
}

// Endpoint to get credibility score
app.post("/api/credibility", async (req, res) => {
  try {
    const { source, content, userVotes, blockchainVerified } = req.body;

    const sourceReliability = await getSourceReliability(source);
    const factualAccuracy = await getFactualAccuracy(content);
    const biasLevel = await getBiasLevel(content);
    const blockchainVerification = blockchainVerified ? 100 : 0;

    const score = calculateCredibility({
      sourceReliability,
      factualAccuracy,
      biasLevel,
      userVotes,
      blockchainVerification
    });

    res.json({
      score,
      breakdown: {
        sourceReliability,
        factualAccuracy,
        biasLevel,
        userVotes,
        blockchainVerification
      }
    });
  } catch (error) {
    console.error("Error calculating credibility:", error);
    res.status(500).json({ error: "Failed to calculate credibility" });
  }
});

app.listen(5000, () => console.log("Credibility API running on http://localhost:5000"));
