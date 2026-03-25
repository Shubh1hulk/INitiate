const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

class AIService {
  // Generate Digital Twin response
  static async generateTwinResponse(userProfile, userMessage) {
    try {
      const systemPrompt = `You are a digital twin of a person with these characteristics:
- Communication style: ${userProfile.communicationStyle?.tone || 'friendly'}
- Formality level: ${userProfile.communicationStyle?.formality || 'casual'}
- Risk tolerance: ${userProfile.personalityTraits?.riskTolerance || 5}/10
- Decision making: ${userProfile.personalityTraits?.decisionMaking || 'balanced'}
- Key habits: ${userProfile.habits?.join(', ') || 'none specified'}

Respond authentically as this person would, using their typical vocabulary and communication patterns.`;

      const message = await groq.messages.create({
        model: 'mixtral-8x7b-32768',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }

  // Generate Life Decision Simulation
  static async generateSimulation(decision, userProfile) {
    try {
      const systemPrompt = `You are an expert life decision simulator. Generate 4 realistic future scenarios for this decision.
User Profile:
- Risk tolerance: ${userProfile.personalityTraits?.riskTolerance || 5}/10
- Optimism level: ${userProfile.personalityTraits?.optimism || 5}/10
- Career interests: ${userProfile.preferences?.career?.join(', ') || 'not specified'}
- Values: ${userProfile.preferences?.values?.join(', ') || 'not specified'}

Return a JSON with this structure:
{
  "scenarios": [
    {
      "title": "Scenario name",
      "description": "Brief description",
      "probability": 75,
      "timeline": {
        "shortTerm": "0-6 months: what happens",
        "mediumTerm": "6-18 months: what happens",
        "longTerm": "18+ months: what happens"
      },
      "risks": ["risk 1", "risk 2"],
      "opportunities": ["opportunity 1", "opportunity 2"],
      "confidence": 80
    }
  ],
  "personalizedInsights": "Insights based on personality",
  "recommendation": "Which scenario best fits their profile"
}`;

      const message = await groq.messages.create({
        model: 'mixtral-8x7b-32768',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Decision to simulate: ${decision}`,
          },
        ],
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse AI response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Simulation generation error:', error);
      throw error;
    }
  }

  // Analyze training data to extract personality traits
  static async analyzePersonality(trainingDataArray) {
    try {
      const systemPrompt = `Analyze the provided text data and extract personality traits.
Return a JSON with this structure:
{
  "communicationStyle": {
    "formality": "formal|casual|mixed",
    "tone": "brief description",
    "vocabulary": ["common words"]
  },
  "personalityTraits": {
    "riskTolerance": 1-10,
    "decisionMaking": "analytical|intuitive|balanced",
    "optimism": 1-10,
    "ambition": 1-10
  }
}`;

      const content = trainingDataArray.join('\n\n');

      const message = await groq.messages.create({
        model: 'mixtral-8x7b-32768',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Analyze this data: ${content}`,
          },
        ],
      });

      const responseText = message.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse AI response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Personality analysis error:', error);
      throw error;
    }
  }
}

module.exports = AIService;
