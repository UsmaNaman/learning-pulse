/**
 * Mock student progress data covering 14 days of revision activities
 * Based on OCR J277 Computer Science specification topics
 */

// Set dates relative to current date (for 14 days of data)
const today = new Date();
const getDateBefore = (daysAgo) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  // Set to a reasonable time during the day
  date.setHours(Math.floor(Math.random() * 12) + 8); // Between 8 AM and 8 PM
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

// Define OCR J277 topics as skill IDs with friendly names and learning resources
const topics = [
  { 
    id: "sys_arch", 
    name: "Systems Architecture",
    resources: [
      { type: "video", title: "CPU Components Explained", url: "https://www.youtube.com/watch?v=CPU_example" },
      { type: "pdf", title: "Von Neumann Architecture", url: "/resources/sys_arch/von_neumann.pdf" },
      { type: "worksheet", title: "CPU Performance Factors", url: "/resources/sys_arch/cpu_performance.pdf" }
    ]
  },
  { 
    id: "mem_storage", 
    name: "Memory and Storage",
    resources: [
      { type: "video", title: "Primary Storage Overview", url: "https://www.youtube.com/watch?v=memory_example" },
      { type: "link", title: "Data Storage Calculations", url: "https://www.craigndave.org/storage-calculations/" },
      { type: "pdf", title: "Secondary Storage Devices", url: "/resources/mem_storage/secondary_storage.pdf" }
    ]
  },
  { 
    id: "networks", 
    name: "Computer Networks",
    resources: [
      { type: "video", title: "Network Topologies", url: "https://www.youtube.com/watch?v=network_topologies" },
      { type: "pdf", title: "Protocols and Layers", url: "/resources/networks/protocols.pdf" },
      { type: "link", title: "Packet Switching Interactive", url: "https://www.craigndave.org/packet-switching-demo/" }
    ]
  },
  { 
    id: "security", 
    name: "Cyber Security",
    resources: [
      { type: "video", title: "Malware Types Explained", url: "https://www.youtube.com/watch?v=malware_types" },
      { type: "pdf", title: "Social Engineering Threats", url: "/resources/security/social_engineering.pdf" },
      { type: "worksheet", title: "Network Security Measures", url: "/resources/security/network_security.pdf" }
    ]
  },
  { 
    id: "programming", 
    name: "Programming Concepts",
    resources: [
      { type: "video", title: "Selection & Iteration", url: "https://www.youtube.com/watch?v=selection_iteration" },
      { type: "link", title: "Python Tutor Visualizer", url: "https://pythontutor.com/" },
      { type: "pdf", title: "Data Types & Operators", url: "/resources/programming/data_types.pdf" }
    ]
  },
  { 
    id: "algo", 
    name: "Algorithms",
    resources: [
      { type: "video", title: "Searching Algorithms", url: "https://www.youtube.com/watch?v=searching_algorithms" },
      { type: "link", title: "Sorting Visualizations", url: "https://visualgo.net/en/sorting" },
      { type: "worksheet", title: "Algorithm Efficiency", url: "/resources/algo/efficiency.pdf" }
    ] 
  },
  { 
    id: "ethics", 
    name: "Ethical, Legal, Cultural Issues",
    resources: [
      { type: "video", title: "Privacy & Data Protection", url: "https://www.youtube.com/watch?v=privacy_data" },
      { type: "pdf", title: "Copyright & Licensing", url: "/resources/ethics/copyright.pdf" },
      { type: "link", title: "Environmental Impact of Computing", url: "https://www.craigndave.org/environmental-impact/" }
    ]
  }
];

/**
 * Generates realistic student progress data
 * @param {Object} options - Configuration options
 * @returns {Object} Complete student progress data
 */
const generateStudentData = ({
  studentId,
  studentName,
  strengths = [],
  weaknesses = [],
  activityCount = 8,
  startingMastery = {},
  completionPattern = "regular", // regular, sporadic, frontloaded, etc.
  skillProgressPattern = "balanced" // balanced, polarized, improving, etc.
}) => {
  // Generate random activity completion dates based on the pattern
  const activityDates = [];
  
  if (completionPattern === "regular") {
    // Evenly spread throughout the two weeks
    for (let i = 0; i < activityCount; i++) {
      activityDates.push(getDateBefore(Math.floor((14 / activityCount) * i)));
    }
  } else if (completionPattern === "sporadic") {
    // Clustered with gaps
    const clusters = [1, 3, 8, 13]; // days with activity clusters
    for (let i = 0; i < activityCount; i++) {
      const clusterIndex = i % clusters.length;
      const dayOffset = clusters[clusterIndex] + (Math.random() > 0.5 ? 1 : 0);
      activityDates.push(getDateBefore(dayOffset));
    }
  } else if (completionPattern === "frontloaded") {
    // More activities at the beginning
    for (let i = 0; i < activityCount; i++) {
      const dayOffset = Math.floor((i / activityCount) * 10) + 1;
      activityDates.push(getDateBefore(dayOffset));
    }
  } else if (completionPattern === "recent") {
    // More activities recently
    for (let i = 0; i < activityCount; i++) {
      const dayOffset = Math.floor(((activityCount - i) / activityCount) * 12);
      activityDates.push(getDateBefore(dayOffset));
    }
  } else if (completionPattern === "weekend") {
    // Activities clustered on weekends
    const weekendDays = [2, 3, 9, 10]; // Weekend days within the 14-day period
    for (let i = 0; i < activityCount; i++) {
      const weekendIndex = i % weekendDays.length;
      activityDates.push(getDateBefore(weekendDays[weekendIndex]));
    }
  }
  
  // Sort dates from newest to oldest
  activityDates.sort((a, b) => b - a);
  
  // Generate initial skill masteries with some randomization
  const skills = topics.map(topic => {
    // Get starting mastery or generate a random value
    const initialMastery = startingMastery[topic.id] || 
      Math.floor(Math.random() * 40) + 30; // Between 30 and 70
    
    // Apply skill pattern modifications
    let mastery = initialMastery;
    
    // Adjust for strengths and weaknesses
    if (strengths.includes(topic.id)) {
      mastery += 15 + Math.floor(Math.random() * 10);
    } else if (weaknesses.includes(topic.id)) {
      mastery -= 15 + Math.floor(Math.random() * 10);
    }
    
    // Apply pattern-specific adjustments
    if (skillProgressPattern === "polarized") {
      // Exaggerate high and low scores
      mastery = mastery > 60 ? mastery + 10 : mastery - 10;
    } else if (skillProgressPattern === "improving") {
      // More improvement on lower scores
      const improvement = Math.max(0, (70 - mastery) / 2);
      mastery += improvement;
    } else if (skillProgressPattern === "struggling") {
      // Lower overall scores
      mastery = Math.max(20, mastery - 15);
    }
    
    // Ensure mastery is within bounds
    mastery = Math.min(95, Math.max(20, Math.round(mastery)));
    
    // Find the full topic data including resources
    const fullTopicData = topics.find(t => t.id === topic.id);
    
    return {
      id: topic.id,
      name: topic.name,
      mastery: mastery,
      resources: fullTopicData?.resources || []
    };
  });
  
  // Generate realistic activities based on the dates
  const recentActivity = activityDates.map((date, index) => {
    // Assign a random topic to each activity
    let topicIndex;
    
    if (index < 3 && strengths.length > 0) {
      // First few activities more likely to be from strengths
      const strengthIndex = Math.floor(Math.random() * strengths.length);
      topicIndex = topics.findIndex(t => t.id === strengths[strengthIndex]);
    } else if (index >= 3 && index < 6 && weaknesses.length > 0) {
      // Middle activities more likely to be from weaknesses
      const weaknessIndex = Math.floor(Math.random() * weaknesses.length);
      topicIndex = topics.findIndex(t => t.id === weaknesses[weaknessIndex]);
    } else {
      // Otherwise random topic
      topicIndex = Math.floor(Math.random() * topics.length);
    }
    
    if (topicIndex === -1) topicIndex = 0;
    
    const topic = topics[topicIndex];
    
    // Determine activity type (slightly more activities than assessments)
    const type = Math.random() > 0.4 ? "activity" : "assessment";
    
    // Generate score based on mastery and some randomness
    const baseScore = skills.find(s => s.id === topic.id).mastery;
    let score;
    
    if (type === "assessment") {
      // Assessments have wider score variance
      score = baseScore + (Math.random() * 30 - 15);
    } else {
      // Activities have less variance
      score = baseScore + (Math.random() * 20 - 10);
    }
    
    // Ensure score is within bounds
    score = Math.min(100, Math.max(0, Math.round(score)));
    
    // Create appropriate title
    let title;
    if (type === "assessment") {
      const assessmentTypes = ["Quiz", "Test", "Exam", "Challenge"];
      title = `${topic.name} ${assessmentTypes[Math.floor(Math.random() * assessmentTypes.length)]}`;
    } else {
      const activityTypes = ["Practice", "Exercise", "Worksheet", "Tutorial", "Application"];
      title = `${topic.name} ${activityTypes[Math.floor(Math.random() * activityTypes.length)]}`;
    }
    
    // Find the full topic data to get resources
    const fullTopicData = topics.find(t => t.id === topic.id);
    
    // Select 1-2 resources relevant to this activity
    const activityResources = fullTopicData?.resources 
      ? fullTopicData.resources
          .sort(() => Math.random() - 0.5) // Shuffle resources
          .slice(0, Math.floor(Math.random() * 2) + 1) // Take 1-2 random resources
      : [];
    
    return {
      type,
      title,
      completedAt: date,
      score,
      topicId: topic.id,
      topicName: topic.name,
      resources: activityResources
    };
  });
  
  // Calculate overall progress based on skill masteries
  const totalMastery = skills.reduce((sum, skill) => sum + skill.mastery, 0);
  const overallProgress = Math.round(totalMastery / skills.length);
  
  // Determine strengths and areas for improvement
  const sortedSkills = [...skills].sort((a, b) => b.mastery - a.mastery);
  const strengthsNames = sortedSkills.slice(0, 2).map(s => s.name);
  const weaknessesNames = sortedSkills.slice(-2).map(s => s.name);
  
  return {
    studentId,
    studentName,
    overallProgress,
    skills,
    recentActivity,
    insights: {
      strengths: strengthsNames,
      areasForImprovement: weaknessesNames,
      lastActive: recentActivity[0]?.completedAt || null,
      activityCount: recentActivity.length
    }
  };
};

// Generate data for 5 students with different patterns
const mockProgressData = {
  // Student 1: John - Strong in programming, weak in networking, regular study pattern
  john: generateStudentData({
    studentId: "john",
    studentName: "John Smith",
    strengths: ["programming", "algo"],
    weaknesses: ["networks", "security"],
    activityCount: 8,
    completionPattern: "regular",
    skillProgressPattern: "polarized",
    startingMastery: {
      "programming": 80,
      "networks": 45
    }
  }),
  
  // Student 2: Ava - Balanced skills, weekend-focused study pattern
  ava: generateStudentData({
    studentId: "ava",
    studentName: "Ava Johnson",
    strengths: ["security", "ethics"],
    weaknesses: [],
    activityCount: 6,
    completionPattern: "weekend",
    skillProgressPattern: "balanced",
    startingMastery: {
      "security": 75,
      "ethics": 78
    }
  }),
  
  // Student 3: David - Strong in theory, weak in programming, sporadic study
  david: generateStudentData({
    studentId: "david",
    studentName: "David Chen",
    strengths: ["sys_arch", "mem_storage"],
    weaknesses: ["programming", "algo"],
    activityCount: 10,
    completionPattern: "sporadic",
    skillProgressPattern: "polarized",
    startingMastery: {
      "sys_arch": 85,
      "programming": 45
    }
  }),
  
  // Student 4: Fatima - Strong in algorithms, improving pattern overall
  fatima: generateStudentData({
    studentId: "fatima",
    studentName: "Fatima Ahmed",
    strengths: ["algo", "programming"],
    weaknesses: ["sys_arch", "mem_storage"],
    activityCount: 9,
    completionPattern: "recent",
    skillProgressPattern: "improving",
    startingMastery: {
      "algo": 82,
      "sys_arch": 50
    }
  }),
  
  // Student 5: Liam - Generally struggling but making effort
  liam: generateStudentData({
    studentId: "liam",
    studentName: "Liam Wilson",
    strengths: ["ethics"],
    weaknesses: ["networks", "security", "algo"],
    activityCount: 7,
    completionPattern: "frontloaded",
    skillProgressPattern: "struggling",
    startingMastery: {
      "ethics": 70,
      "networks": 40
    }
  })
};

module.exports = mockProgressData;