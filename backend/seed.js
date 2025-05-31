// seed.js - Seed data for Learning Pulse KS3 Computer Science Tracker

/**
 * This script populates the MongoDB database with sample data for the Learning Pulse system.
 * It creates users (students and teachers), curriculum topics, learning resources, assessments,
 * and student progress data to enable demonstration of the system's functionality.
 *
 * To use:
 * 1. Ensure MongoDB is running
 * 2. Configure your .env file with MONGODB_URI
 * 3. Run: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Topic, Resource, Assessment, Progress, MasteryLevel } = require('./models');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-pulse')
.then(() => {
  console.log('MongoDB connected for seeding');
  // Run the seed function
  seedDatabase();
})
.catch(err => console.error('MongoDB connection error:', err));

// Seed data functions
async function seedDatabase() {
  try {
    // Clear existing data
    await clearDatabase();

    // Create the mastery levels
    const masteryLevels = await seedMasteryLevels();

    // Create curriculum topics
    const topics = await seedTopics();

    // Create users (students and teachers)
    const users = await seedUsers();

    // Create learning resources
    const resources = await seedResources(topics);

    // Create assessments
    const assessments = await seedAssessments(topics);

    // Create progress data
    await seedProgress(users.students, topics, masteryLevels, assessments);

    console.log('Database seeded successfully!');
    mongoose.disconnect();

  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
  }
}

async function clearDatabase() {
  await User.deleteMany({});
  await Topic.deleteMany({});
  await Resource.deleteMany({});
  await Assessment.deleteMany({});
  await Progress.deleteMany({});
  await MasteryLevel.deleteMany({});
  console.log('Database cleared');
}

async function seedMasteryLevels() {
  const masteryLevels = [
    {
      name: 'Novice',
      description: 'Basic awareness of concepts. Can follow guided examples with support.',
      minScore: 0,
      maxScore: 40,
      color: '#FF6B6B' // Red
    },
    {
      name: 'Developing',
      description: 'Understanding key concepts. Can apply learning to similar problems with some guidance.',
      minScore: 41,
      maxScore: 60,
      color: '#FFD166' // Orange/Yellow
    },
    {
      name: 'Proficient',
      description: 'Solid understanding. Can independently apply concepts to new contexts and explain their reasoning.',
      minScore: 61,
      maxScore: 75,
      color: '#06D6A0' // Green
    },
    {
      name: 'Advanced',
      description: 'Comprehensive understanding. Can solve complex problems and teach concepts to others.',
      minScore: 76,
      maxScore: 90,
      color: '#118AB2' // Blue
    },
    {
      name: 'Expert',
      description: 'Mastery of concepts. Can create original applications, evaluate approaches, and suggest improvements.',
      minScore: 91,
      maxScore: 100,
      color: '#073B4C' // Dark Blue
    }
  ];

  return await MasteryLevel.insertMany(masteryLevels);
}

async function seedTopics() {
  const topics = [
    {
      name: 'Algorithms',
      category: 'Computational Thinking',
      curriculumReference: 'KS4-CT1',
      description: 'Understanding and creating algorithms, flowcharts, pseudocode',
      subtopics: [
        { name: 'Algorithmic Thinking', description: 'Understanding what algorithms are and why they are important' },
        { name: 'Flowcharts', description: 'Creating visual representations of algorithms' },
        { name: 'Pseudocode', description: 'Writing algorithms using structured English' },
        { name: 'Efficiency', description: 'Understanding algorithm efficiency and performance' }
      ]
    },
    {
      name: 'Programming Constructs',
      category: 'Programming',
      curriculumReference: 'KS4-P1',
      description: 'Sequence, selection, iteration, variables',
      subtopics: [
        { name: 'Sequence', description: 'Ordering instructions logically' },
        { name: 'Selection', description: 'Making decisions in programs using if statements' },
        { name: 'Iteration', description: 'Repeating instructions using loops' },
        { name: 'Variables', description: 'Storing and manipulating data in programs' }
      ]
    },
    {
      name: 'Data Representation',
      category: 'Data & Information',
      curriculumReference: 'KS4-D1',
      description: 'Binary, units, text/image representation',
      subtopics: [
        { name: 'Binary Number System', description: 'Understanding the binary system and conversion' },
        { name: 'Text Representation', description: 'How text is represented using ASCII and Unicode' },
        { name: 'Image Representation', description: 'How images are stored as binary data' },
        { name: 'Units of Information', description: 'Bits, bytes, kilobytes, megabytes, etc.' }
      ]
    },
    {
      name: 'Computer Systems',
      category: 'Hardware & Software',
      curriculumReference: 'KS4-CS1',
      description: 'Components, input/output, storage, software classifications',
      subtopics: [
        { name: 'Hardware Components', description: 'Understanding CPU, memory, and storage' },
        { name: 'Input/Output Devices', description: 'Different ways computers take input and provide output' },
        { name: 'Software Types', description: 'Understanding system and application software' },
        { name: 'Storage Technologies', description: 'Different methods of storing digital data' }
      ]
    },
    {
      name: 'Networks',
      category: 'Computer Systems',
      curriculumReference: 'KS4-CS2',
      description: 'Network types, internet, protocols, security',
      subtopics: [
        { name: 'Network Types', description: 'LANs, WANs, and network topologies' },
        { name: 'Internet Structure', description: 'How the internet works, IP addresses, DNS' },
        { name: 'Network Protocols', description: 'Rules for data transmission between devices' },
        { name: 'Network Security', description: 'Threats and protective measures for networks' }
      ]
    },
    {
      name: 'E-Safety & Ethics',
      category: 'Digital Literacy',
      curriculumReference: 'KS4-DL1',
      description: 'Online safety, privacy, cyberbullying, digital footprint',
      subtopics: [
        { name: 'Online Safety', description: 'Protecting yourself online' },
        { name: 'Privacy', description: 'Understanding data privacy and rights' },
        { name: 'Cyberbullying', description: 'Recognizing and responding to cyberbullying' },
        { name: 'Digital Footprint', description: 'Managing your online presence' }
      ]
    },
    {
      name: 'Problem Solving',
      category: 'Computational Thinking',
      curriculumReference: 'KS4-CT2',
      description: 'Decomposition, pattern recognition, abstraction',
      subtopics: [
        { name: 'Decomposition', description: 'Breaking down complex problems' },
        { name: 'Pattern Recognition', description: 'Identifying similarities in problems' },
        { name: 'Abstraction', description: 'Focusing on important information only' },
        { name: 'Algorithm Design', description: 'Creating step-by-step solutions' }
      ]
    },
    {
      name: 'Boolean Logic',
      category: 'Data & Information',
      curriculumReference: 'KS4-D2',
      description: 'AND, OR, NOT gates, truth tables',
      subtopics: [
        { name: 'Logical Operators', description: 'AND, OR, NOT operations' },
        { name: 'Truth Tables', description: 'Representing logical operations' },
        { name: 'Logic Gates', description: 'Physical implementations of logical operations' },
        { name: 'Boolean Expressions', description: 'Creating and evaluating logical expressions' }
      ]
    },
    {
      name: 'Programming Languages',
      category: 'Programming',
      curriculumReference: 'KS4-P2',
      description: 'Text-based languages (Python), syntax, debugging',
      subtopics: [
        { name: 'Python Basics', description: 'Fundamental Python programming concepts' },
        { name: 'Syntax Rules', description: 'Understanding programming language grammar' },
        { name: 'Debugging', description: 'Finding and fixing errors in code' },
        { name: 'Functions', description: 'Creating reusable blocks of code' }
      ]
    },
    {
      name: 'Data Handling',
      category: 'Data & Information',
      curriculumReference: 'KS4-D3',
      description: 'Collecting, analyzing and visualizing data',
      subtopics: [
        { name: 'Data Collection', description: 'Methods of gathering reliable data' },
        { name: 'Data Analysis', description: 'Techniques for interpreting data' },
        { name: 'Data Visualization', description: 'Creating charts and graphs to represent data' },
        { name: 'Spreadsheets', description: 'Using spreadsheet software to manage data' }
      ]
    }
  ];

  return await Topic.insertMany(topics);
}

async function seedUsers() {
  // Create teachers
  const teachers = [
    {
      name: 'Usman Akram',
      email: 'smith@school.edu',
      password: await bcrypt.hash('password123', 10),
      role: 'instructor', // Using instructor instead of teacher to match the enum in User model
      department: 'Computing',
      classes: ['10A', '10B', '11A']
    },
    {
      name: 'David Jones',
      email: 'jones@school.edu',
      password: await bcrypt.hash('password123', 10),
      role: 'instructor', // Using instructor instead of teacher to match the enum in User model
      department: 'Computing',
      classes: ['10C', '10D', '11B']
    }
  ];

  // Create students
  const students = [
    {
      name: 'John Smith',
      email: 'john.s@school.edu',
      password: await bcrypt.hash('student123', 10),
      role: 'student',
      yearGroup: 10,
      class: '10A',
      preferences: {
        learningStyle: 'Visual',
        preferredResourceTypes: ['Video', 'Interactive'],
        additionalNeeds: 'None'
      }
    },
    {
      name: 'Emily Jones',
      email: 'emily.j@school.edu',
      password: await bcrypt.hash('student123', 10),
      role: 'student',
      yearGroup: 10,
      class: '10A',
      preferences: {
        learningStyle: 'Interactive',
        preferredResourceTypes: ['Simulation', 'Game'],
        additionalNeeds: 'None'
      }
    },
    {
      name: 'David Wilson',
      email: 'david.w@school.edu',
      password: await bcrypt.hash('student123', 10),
      role: 'student',
      yearGroup: 10,
      class: '10A',
      preferences: {
        learningStyle: 'Reading/Writing',
        preferredResourceTypes: ['Document', 'Quiz'],
        additionalNeeds: 'Additional time for tasks'
      }
    },
    {
      name: 'Sarah Brown',
      email: 'sarah.b@school.edu',
      password: await bcrypt.hash('student123', 10),
      role: 'student',
      yearGroup: 10,
      class: '10B',
      preferences: {
        learningStyle: 'Auditory',
        preferredResourceTypes: ['Video', 'Audio'],
        additionalNeeds: 'Larger text'
      }
    },
    {
      name: 'Michael Taylor',
      email: 'michael.t@school.edu',
      password: await bcrypt.hash('student123', 10),
      role: 'student',
      yearGroup: 10,
      class: '10B',
      preferences: {
        learningStyle: 'Kinesthetic',
        preferredResourceTypes: ['Interactive', 'Simulation'],
        additionalNeeds: 'None'
      }
    }
  ];

  const insertedTeachers = await User.insertMany(teachers);
  const insertedStudents = await User.insertMany(students);

  return {
    teachers: insertedTeachers,
    students: insertedStudents
  };
}

async function seedResources(topics) {
  // Build resources linked to topics
  const resources = [
    // Algorithms resources
    {
      title: 'Introduction to Algorithms',
      type: 'Video',
      format: 'mp4',
      url: '/resources/videos/intro-algorithms.mp4',
      topic: topics[0]._id, // Algorithms
      subtopic: topics[0].subtopics[0].name, // Algorithmic Thinking
      difficultyLevel: 'Introductory',
      estimatedDuration: 15,
      description: 'An introduction to what algorithms are and why they are important in computing.',
      author: 'Computing Department',
      tags: ['algorithms', 'introduction', 'computational thinking']
    },
    {
      title: 'Flowchart Basics',
      type: 'Document',
      format: 'pdf',
      url: '/resources/documents/flowchart-basics.pdf',
      topic: topics[0]._id, // Algorithms
      subtopic: topics[0].subtopics[1].name, // Flowcharts
      difficultyLevel: 'Introductory',
      estimatedDuration: 20,
      description: 'Learn the basic symbols and conventions for creating flowcharts.',
      author: 'Computing Department',
      tags: ['algorithms', 'flowcharts', 'diagram']
    },
    {
      title: 'Pseudocode Challenge',
      type: 'Interactive',
      format: 'html',
      url: '/resources/interactive/pseudocode-challenge.html',
      topic: topics[0]._id, // Algorithms
      subtopic: topics[0].subtopics[2].name, // Pseudocode
      difficultyLevel: 'Intermediate',
      estimatedDuration: 25,
      description: 'Practice writing pseudocode for various scenarios.',
      author: 'Computing Department',
      tags: ['algorithms', 'pseudocode', 'practice']
    },

    // Programming Constructs resources
    {
      title: 'Sequence, Selection, Iteration',
      type: 'Video',
      format: 'youtube',
      url: 'https://youtu.be/t0VphK9cWgE?si=KJTMM38oX6exgmPg',
      topic: topics[1]._id, // Programming Constructs
      subtopic: topics[1].subtopics[0].name, // Sequence
      difficultyLevel: 'Introductory',
      estimatedDuration: 18,
      description: 'Understanding the three basic programming constructs.',
      author: 'Computing Department',
      tags: ['programming', 'basics', 'constructs']
    },
    {
      title: 'Programming Constructs OCR – Year 10 Worksheet',
      type: 'Document',
      format: 'html',
      url: '/worksheets/programming_constructs_ocr_year10.html',
      topic: topics[1]._id, // Programming Constructs
      subtopic: topics[1].subtopics[0].name, // Sequence
      difficultyLevel: 'Introductory',
      estimatedDuration: 25,
      description: 'Comprehensive worksheet covering sequence, selection, and iteration with answer key.',
      author: 'Computing Department',
      tags: ['programming', 'constructs', 'worksheet', 'ocr', 'year10']
    },
    {
      title: 'If Statements in Python',
      type: 'Interactive',
      format: 'html',
      url: '/resources/interactive/if-statements.html',
      topic: topics[1]._id, // Programming Constructs
      subtopic: topics[1].subtopics[1].name, // Selection
      difficultyLevel: 'Intermediate',
      estimatedDuration: 30,
      description: 'Learn how to use if statements to make decisions in Python.',
      author: 'Computing Department',
      tags: ['programming', 'python', 'selection', 'if statements']
    },
    {
      title: 'Loops Worksheet',
      type: 'Document',
      format: 'pdf',
      url: '/resources/documents/loops-worksheet.pdf',
      topic: topics[1]._id, // Programming Constructs
      subtopic: topics[1].subtopics[2].name, // Iteration
      difficultyLevel: 'Intermediate',
      estimatedDuration: 25,
      description: 'Practice exercises for using loops in programming.',
      author: 'Computing Department',
      tags: ['programming', 'loops', 'iteration', 'practice']
    },

    // Data Representation resources
    {
      title: 'Binary Number System',
      type: 'Video',
      format: 'mp4',
      url: '/resources/videos/binary-system.mp4',
      topic: topics[2]._id, // Data Representation
      subtopic: topics[2].subtopics[0].name, // Binary Number System
      difficultyLevel: 'Introductory',
      estimatedDuration: 12,
      description: 'Understanding how the binary number system works.',
      author: 'Computing Department',
      tags: ['data', 'binary', 'number systems']
    },
    {
      title: 'Binary Conversion Practice',
      type: 'Interactive',
      format: 'html',
      url: '/resources/interactive/binary-conversion.html',
      topic: topics[2]._id, // Data Representation
      subtopic: topics[2].subtopics[0].name, // Binary Number System
      difficultyLevel: 'Intermediate',
      estimatedDuration: 20,
      description: 'Practice converting between binary and decimal number systems.',
      author: 'Computing Department',
      tags: ['data', 'binary', 'conversion', 'practice']
    },

    // Computer Systems resources
    {
      title: 'Computer Components Explained',
      type: 'Document',
      format: 'pdf',
      url: '/resources/documents/computer-components.pdf',
      topic: topics[3]._id, // Computer Systems
      subtopic: topics[3].subtopics[0].name, // Hardware Components
      difficultyLevel: 'Introductory',
      estimatedDuration: 15,
      description: 'Detailed explanation of the main components in a computer system.',
      author: 'Computing Department',
      tags: ['hardware', 'components', 'computer systems']
    },
    {
      title: 'Inside Your Computer',
      type: 'Video',
      format: 'mp4',
      url: '/resources/videos/inside-computer.mp4',
      topic: topics[3]._id, // Computer Systems
      subtopic: topics[3].subtopics[0].name, // Hardware Components
      difficultyLevel: 'Introductory',
      estimatedDuration: 22,
      description: 'Visual exploration of computer hardware components.',
      author: 'Computing Department',
      tags: ['hardware', 'computer systems', 'components']
    },

    // E-Safety resources
    {
      title: 'Staying Safe Online',
      type: 'Video',
      format: 'mp4',
      url: '/resources/videos/online-safety.mp4',
      topic: topics[5]._id, // E-Safety & Ethics
      subtopic: topics[5].subtopics[0].name, // Online Safety
      difficultyLevel: 'Introductory',
      estimatedDuration: 18,
      description: 'Essential tips for staying safe when using the internet.',
      author: 'Computing Department',
      tags: ['e-safety', 'online', 'protection']
    },
    {
      title: 'Digital Footprint Activity',
      type: 'Interactive',
      format: 'html',
      url: '/resources/interactive/digital-footprint.html',
      topic: topics[5]._id, // E-Safety & Ethics
      subtopic: topics[5].subtopics[3].name, // Digital Footprint
      difficultyLevel: 'Intermediate',
      estimatedDuration: 25,
      description: 'Interactive activity to help understand your digital footprint.',
      author: 'Computing Department',
      tags: ['e-safety', 'digital footprint', 'online presence']
    },

    // Programming Languages resources
    {
      title: 'Python for Beginners',
      type: 'Video',
      format: 'mp4',
      url: '/resources/videos/python-beginners.mp4',
      topic: topics[8]._id, // Programming Languages
      subtopic: topics[8].subtopics[0].name, // Python Basics
      difficultyLevel: 'Introductory',
      estimatedDuration: 30,
      description: 'Introduction to programming with Python.',
      author: 'Computing Department',
      tags: ['programming', 'python', 'beginners']
    },
    {
      title: 'Python Cheat Sheet',
      type: 'Document',
      format: 'pdf',
      url: '/resources/documents/python-cheatsheet.pdf',
      topic: topics[8]._id, // Programming Languages
      subtopic: topics[8].subtopics[0].name, // Python Basics
      difficultyLevel: 'All Levels',
      estimatedDuration: 10,
      description: 'Quick reference guide for Python programming.',
      author: 'Computing Department',
      tags: ['programming', 'python', 'reference']
    },
    {
      title: 'Debugging Practice',
      type: 'Interactive',
      format: 'html',
      url: '/resources/interactive/debugging.html',
      topic: topics[8]._id, // Programming Languages
      subtopic: topics[8].subtopics[2].name, // Debugging
      difficultyLevel: 'Intermediate',
      estimatedDuration: 35,
      description: 'Practice finding and fixing errors in Python code.',
      author: 'Computing Department',
      tags: ['programming', 'python', 'debugging', 'practice']
    }
  ];

  return await Resource.insertMany(resources);
}

async function seedAssessments(topics) {
  const assessments = [
    {
      title: 'Algorithm Basics Quiz',
      type: 'quiz',
      topic: topics[0]._id, // Algorithms
      difficultyLevel: 'introductory',
      estimatedTime: 20,
      questions: [
        {
          questionText: 'What is an algorithm?',
          questionType: 'multiple_choice',
          options: [
            'A computer programming language',
            'A step-by-step procedure for solving a problem',
            'A type of computer hardware',
            'A mathematical equation'
          ],
          correctAnswer: 'A step-by-step procedure for solving a problem',
          points: 10
        },
        {
          questionText: 'Which of these is NOT typically found in a flowchart?',
          questionType: 'multiple_choice',
          options: [
            'Diamond shape for decisions',
            'Rectangle for processes',
            'Triangle for input/output',
            'Oval for start/end'
          ],
          correctAnswer: 'Triangle for input/output',
          points: 10
        },
        {
          questionText: 'Pseudocode is:',
          questionType: 'multiple_choice',
          options: [
            'A programming language that only works on certain computers',
            'An informal way to describe algorithms using a mixture of natural language and programming constructs',
            'Code that doesn\'t work properly',
            'A type of encryption'
          ],
          correctAnswer: 'An informal way to describe algorithms using a mixture of natural language and programming constructs',
          points: 10
        }
      ],
      totalPoints: 30
    },
    {
      title: 'Programming Constructs Assessment',
      type: 'quiz',
      topic: topics[1]._id, // Programming Constructs
      difficultyLevel: 'intermediate',
      estimatedTime: 30,
      questions: [
        {
          questionText: 'Which programming construct is used to make decisions in code?',
          questionType: 'multiple_choice',
          options: [
            'Sequence',
            'Selection',
            'Iteration',
            'Declaration'
          ],
          correctAnswer: 'Selection',
          points: 10
        },
        {
          questionText: 'What is the purpose of a loop in programming?',
          questionType: 'multiple_choice',
          options: [
            'To store data',
            'To repeat instructions',
            'To make decisions',
            'To organize code'
          ],
          correctAnswer: 'To repeat instructions',
          points: 10
        },
        {
          questionText: 'Which of these is an example of a variable name that follows good naming conventions?',
          questionType: 'multiple_choice',
          options: [
            '123variable',
            'user name',
            'userAge',
            'variable!'
          ],
          correctAnswer: 'userAge',
          points: 10
        }
      ],
      totalPoints: 30
    },
    {
      title: 'Binary Conversion Test',
      type: 'quiz',
      topic: topics[2]._id, // Data Representation
      difficultyLevel: 'intermediate',
      estimatedTime: 25,
      questions: [
        {
          questionText: 'Convert the binary number 1010 to decimal.',
          questionType: 'short_answer',
          correctAnswer: '10',
          points: 10
        },
        {
          questionText: 'Convert the decimal number 15 to binary.',
          questionType: 'short_answer',
          correctAnswer: '1111',
          points: 10
        },
        {
          questionText: 'How many different values can be represented with 4 bits?',
          questionType: 'multiple_choice',
          options: [
            '4',
            '8',
            '16',
            '32'
          ],
          correctAnswer: '16',
          points: 10
        }
      ],
      totalPoints: 30
    },
    {
      title: 'Computer Hardware Components',
      type: 'quiz',
      topic: topics[3]._id, // Computer Systems
      difficultyLevel: 'introductory',
      estimatedTime: 20,
      questions: [
        {
          questionText: 'Which component is considered the "brain" of the computer?',
          questionType: 'multiple_choice',
          options: [
            'RAM',
            'Hard Drive',
            'CPU',
            'Graphics Card'
          ],
          correctAnswer: 'CPU',
          points: 10
        },
        {
          questionText: 'What is the purpose of RAM in a computer?',
          questionType: 'multiple_choice',
          options: [
            'Long-term storage of files',
            'Processing calculations',
            'Temporary memory for running programs',
            'Connecting to the internet'
          ],
          correctAnswer: 'Temporary memory for running programs',
          points: 10
        },
        {
          questionText: 'Which of these is an output device?',
          questionType: 'multiple_choice',
          options: [
            'Keyboard',
            'Mouse',
            'Monitor',
            'Microphone'
          ],
          correctAnswer: 'Monitor',
          points: 10
        }
      ],
      totalPoints: 30
    },
    {
      title: 'E-Safety Knowledge Check',
      type: 'quiz',
      topic: topics[5]._id, // E-Safety & Ethics
      difficultyLevel: 'introductory',
      estimatedTime: 15,
      questions: [
        {
          questionText: 'What is a strong password likely to include?',
          questionType: 'multiple_choice',
          options: [
            'Only lowercase letters',
            'Your name and birthday',
            'A mix of letters, numbers, and special characters',
            'A common word or phrase'
          ],
          correctAnswer: 'A mix of letters, numbers, and special characters',
          points: 10
        },
        {
          questionText: 'What should you do if you receive a suspicious email asking for personal information?',
          questionType: 'multiple_choice',
          options: [
            'Reply with the requested information',
            'Click on any links to learn more',
            'Delete it and don\'t click on any links',
            'Forward it to everyone you know as a warning'
          ],
          correctAnswer: 'Delete it and don\'t click on any links',
          points: 10
        },
        {
          questionText: 'Your digital footprint includes:',
          questionType: 'multiple_choice',
          options: [
            'Only information you deliberately share online',
            'Only your social media profiles',
            'All traces of your activity left online, both intentional and unintentional',
            'Only information collected by the government'
          ],
          correctAnswer: 'All traces of your activity left online, both intentional and unintentional',
          points: 10
        }
      ],
      totalPoints: 30
    },
    {
      title: 'Python Programming Basics',
      type: 'quiz',
      topic: topics[8]._id, // Programming Languages
      difficultyLevel: 'intermediate',
      estimatedTime: 25,
      questions: [
        {
          questionText: 'What symbol is used for comments in Python?',
          questionType: 'multiple_choice',
          options: [
            '//',
            '/* */',
            '#',
            '--'
          ],
          correctAnswer: '#',
          points: 10
        },
        {
          questionText: 'What is the output of: print(3 * "Hello ")',
          questionType: 'short_answer',
          correctAnswer: 'Hello Hello Hello ',
          points: 10
        },
        {
          questionText: 'Which of these is the correct way to define a function in Python?',
          questionType: 'multiple_choice',
          options: [
            'function myFunction():',
            'def myFunction():',
            'define myFunction():',
            'func myFunction():'
          ],
          correctAnswer: 'def myFunction():',
          points: 10
        }
      ],
      totalPoints: 30
    }
  ];

  return await Assessment.insertMany(assessments);
}

async function seedProgress(students, topics, masteryLevels, assessments) {
  // Generate realistic progress data for each student
  const progressData = [];

  // Define mastery levels for quick reference
  const masteryLevelMap = {
    'Novice': masteryLevels[0]._id,
    'Developing': masteryLevels[1]._id,
    'Proficient': masteryLevels[2]._id,
    'Advanced': masteryLevels[3]._id,
    'Expert': masteryLevels[4]._id
  };

  // A few weeks ago (for start dates)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 21);

  // Last week (for some completion dates)
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() - 7);

  // Generate different progress profiles for each student

  // John Smith - Good at programming, needs work on data representation
  for (const topic of topics) {
    let masteryLevel;
    let score;
    let completed = false;

    // Set different mastery levels based on topic
    if (topic.category === 'Programming') {
      masteryLevel = masteryLevelMap['Advanced'];
      score = 85;
      completed = true;
    } else if (topic.name === 'Algorithms' || topic.name === 'Problem Solving') {
      masteryLevel = masteryLevelMap['Proficient'];
      score = 72;
      completed = true;
    } else if (topic.name === 'Data Representation' || topic.name === 'Boolean Logic') {
      masteryLevel = masteryLevelMap['Developing'];
      score = 55;
      completed = true;
    } else if (topic.name === 'E-Safety & Ethics') {
      masteryLevel = masteryLevelMap['Expert'];
      score = 95;
      completed = true;
    } else if (topic.name === 'Computer Systems') {
      masteryLevel = masteryLevelMap['Advanced'];
      score = 82;
      completed = true;
    } else {
      masteryLevel = masteryLevelMap['Developing'];
      score = 58;
      completed = topic.name !== 'Data Handling'; // Not yet started Data Handling
    }

    progressData.push({
      student: students[0]._id, // John Smith
      topic: topic._id,
      currentMasteryLevel: masteryLevel,
      targetMasteryLevel: masteryLevelMap['Expert'],
      startDate: startDate,
      completionDate: completed ? completionDate : null,
      lastAssessmentDate: completed ? completionDate : null,
      score: score,
      progress: score,
      nextSteps: `Continue practicing ${topic.name} concepts with focus on ${topic.subtopics[0].name}`,
      notes: `Showing good understanding of ${topic.category} concepts`
    });
  }

  // Emily Jones - High achiever across all topics
  for (const topic of topics) {
    let masteryLevel;
    let score;

    // Set different mastery levels based on topic
    if (topic.name === 'Programming Languages' || topic.name === 'Problem Solving') {
      masteryLevel = masteryLevelMap['Expert'];
      score = 95;
    } else if (topic.name === 'Data Representation') {
      masteryLevel = masteryLevelMap['Advanced'];
      score = 88;
    } else if (topic.name === 'Computer Systems') {
      masteryLevel = masteryLevelMap['Proficient'];
      score = 74;
    } else {
      masteryLevel = masteryLevelMap['Advanced'];
      score = 85;
    }

    progressData.push({
      student: students[1]._id, // Emily Jones
      topic: topic._id,
      currentMasteryLevel: masteryLevel,
      targetMasteryLevel: masteryLevelMap['Expert'],
      startDate: startDate,
      completionDate: completionDate,
      lastAssessmentDate: completionDate,
      score: score,
      progress: score,
      nextSteps: `Challenge yourself with advanced ${topic.name} projects`,
      notes: `Excellent understanding across all topics. Consider peer mentoring.`
    });
  }

  // David Wilson - Struggling with most topics
  for (const topic of topics) {
    let masteryLevel;
    let score;
    let completed = false;

    // Set different mastery levels based on topic
    if (topic.name === 'E-Safety & Ethics') {
      masteryLevel = masteryLevelMap['Proficient'];
      score = 68;
      completed = true;
    } else if (topic.name === 'Computer Systems') {
      masteryLevel = masteryLevelMap['Developing'];
      score = 52;
      completed = true;
    } else if (topic.name === 'Algorithms' || topic.name === 'Problem Solving') {
      masteryLevel = masteryLevelMap['Novice'];
      score = 35;
      completed = true;
    } else if (topic.name === 'Programming Languages' || topic.name === 'Programming Constructs') {
      masteryLevel = masteryLevelMap['Developing'];
      score = 45;
      completed = true;
    } else if (topic.name === 'Data Representation') {
      masteryLevel = masteryLevelMap['Developing'];
      score = 48;
      completed = true;
    } else {
      masteryLevel = masteryLevelMap['Novice'];
      score = 30;
      completed = false;
    }

    progressData.push({
      student: students[2]._id, // David Wilson
      topic: topic._id,
      currentMasteryLevel: masteryLevel,
      targetMasteryLevel: masteryLevelMap['Proficient'],
      startDate: startDate,
      completionDate: completed ? completionDate : null,
      lastAssessmentDate: completed ? completionDate : null,
      score: score,
      progress: score,
      nextSteps: `Focus on foundational concepts in ${topic.name}`,
      notes: `Requires additional support with ${topic.category} topics. Consider visual learning resources.`
    });
  }

  // Sarah Brown - Mixed performance
  for (const topic of topics) {
    let masteryLevel;
    let score;
    let completed = true;

    // Set different mastery levels based on topic
    if (topic.name === 'Data Representation' || topic.name === 'Boolean Logic') {
      masteryLevel = masteryLevelMap['Advanced'];
      score = 82;
    } else if (topic.name === 'Computer Systems' || topic.name === 'Networks') {
      masteryLevel = masteryLevelMap['Proficient'];
      score = 75;
    } else if (topic.name === 'Programming Languages' || topic.name === 'Programming Constructs') {
      masteryLevel = masteryLevelMap['Developing'];
      score = 55;
    } else if (topic.name === 'Algorithms') {
      masteryLevel = masteryLevelMap['Novice'];
      score = 38;
    } else {
      masteryLevel = masteryLevelMap['Proficient'];
      score = 68;
    }

    progressData.push({
      student: students[3]._id, // Sarah Brown
      topic: topic._id,
      currentMasteryLevel: masteryLevel,
      targetMasteryLevel: masteryLevelMap['Advanced'],
      startDate: startDate,
      completionDate: completed ? completionDate : null,
      lastAssessmentDate: completed ? completionDate : null,
      score: score,
      progress: score,
      nextSteps: `Work on strengthening understanding of ${topic.subtopics[1].name}`,
      notes: `Prefers auditory learning resources. Shows good understanding of data concepts.`
    });
  }

  // Michael Taylor - Strong in practical topics
  for (const topic of topics) {
    let masteryLevel;
    let score;
    let completed = true;

    // Set different mastery levels based on topic
    if (topic.name === 'Programming Languages' || topic.name === 'Programming Constructs') {
      masteryLevel = masteryLevelMap['Expert'];
      score = 92;
    } else if (topic.name === 'E-Safety & Ethics' || topic.name === 'Data Handling') {
      masteryLevel = masteryLevelMap['Advanced'];
      score = 84;
    } else if (topic.name === 'Data Representation' || topic.name === 'Boolean Logic') {
      masteryLevel = masteryLevelMap['Developing'];
      score = 58;
    } else if (topic.name === 'Computer Systems' || topic.name === 'Networks') {
      masteryLevel = masteryLevelMap['Advanced'];
      score = 80;
    } else {
      masteryLevel = masteryLevelMap['Proficient'];
      score = 70;
    }

    progressData.push({
      student: students[4]._id, // Michael Taylor
      topic: topic._id,
      currentMasteryLevel: masteryLevel,
      targetMasteryLevel: masteryLevelMap['Expert'],
      startDate: startDate,
      completionDate: completed ? completionDate : null,
      lastAssessmentDate: completed ? completionDate : null,
      score: score,
      progress: score,
      nextSteps: `Continue developing skills in ${topic.name} with practical projects`,
      notes: `Excels with hands-on, kinesthetic learning. Strong practical programmer.`
    });
  }

  // Create assessment results for each student
  // This would link students to the assessments they've taken

  return await Progress.insertMany(progressData);
}
