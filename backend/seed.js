require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const TrainingData = require('./models/TrainingData');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await TrainingData.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create demo user
    const demoUser = new User({
      email: 'demo@lifetwin.ai',
      password: 'DemoPass123!',
      username: 'demo_user',
      firstName: 'Demo',
      lastName: 'User',
      bio: 'A tech enthusiast curious about life decisions',
      personalityTraits: {
        riskTolerance: 7,
        decisionMaking: 'analytical',
        optimism: 8,
        ambition: 9,
      },
      communicationStyle: {
        formality: 'casual',
        tone: 'friendly and direct',
        vocabulary: ['awesome', 'definitely', 'basically', 'actually', 'interesting'],
        patterns: ['asks questions', 'explains thoroughly', 'uses examples'],
      },
      habits: [
        'coding late nights',
        'morning coffee',
        'reading tech news',
        'attending meetups',
        'side projects',
      ],
      preferences: {
        career: ['tech', 'startup', 'innovation'],
        lifestyle: ['remote work', 'flexibility', 'continuous learning'],
        values: ['impact', 'growth', 'autonomy'],
      },
      trainingPhase: 'advanced',
      trainingDataPoints: 12,
    });

    await demoUser.save();
    console.log('✓ Created demo user');

    // Create training data
    const trainingDataPoints = [
      'I love building software that solves real problems. There\'s nothing better than seeing users benefit from something I created.',
      'In my career, I value autonomy and impact. I want to work on projects that matter and have the freedom to make decisions.',
      'When facing decisions, I like to analyze data and pros/cons, but I also trust my gut feeling. It\'s a balanced approach.',
      "I'm definitely an early adopter. I enjoy learning new technologies and experimenting with new ideas. Risk doesn't scare me much.",
      'My ideal career would involve leading a team working on cutting-edge tech. I see myself building something meaningful in the next 5 years.',
      'I handle stress by breaking problems into smaller chunks and tackling them methodically. I also like to take breaks and recharge.',
      'My core values are integrity, continuous improvement, and making a positive impact. Work-life balance is also important to me.',
      'I\'ve always been interested in startups. The idea of building something from scratch really appeals to me.',
      'Collaboration is key for me. I work best in teams where there\'s open communication and mutual respect.',
      'Money is important, but purpose matters more. I\'d rather earn less doing something meaningful than earn more doing something boring.',
      'I believe in lifelong learning. I spend time reading, taking courses, and staying updated with industry trends.',
      'Future-wise, I see myself either leading a tech company or working on AI/ML projects that can help society.',
    ];

    for (const content of trainingDataPoints) {
      const trainingData = new TrainingData({
        userId: demoUser._id,
        type: 'chat',
        content,
        metadata: {
          keywords: content.split(' ').slice(0, 10),
        },
      });
      await trainingData.save();
    }

    console.log('✓ Created training data');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Demo Account:');
    console.log('  Email: demo@lifetwin.ai');
    console.log('  Password: DemoPass123!');
    console.log('\nYou can now login and test the full app!');

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
