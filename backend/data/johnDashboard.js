/**
 * Mock dashboard data for John Smith
 * Based on OCR J277 Computer Science specification topics
 */

// Create date helpers for activity timestamps
const today = new Date();
const getDateBefore = (daysAgo) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  // Set to a reasonable time during the day
  date.setHours(Math.floor(Math.random() * 12) + 8); // Between 8 AM and 8 PM
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

// Define all OCR J277 topics with full resources
const johnData = {
  studentId: "john",
  studentName: "John Smith",
  overallProgress: 65, // Will be calculated dynamically based on skills
  skills: [
    {
      id: "sys_arch",
      name: "Systems Architecture",
      mastery: 68,
      resources: [
        { 
          type: "video", 
          title: "CPU Components & the Fetch-Execute Cycle", 
          url: "https://www.youtube.com/watch?v=Z5JC9Ve1sfI" 
        },
        { 
          type: "worksheet", 
          title: "Von Neumann Architecture", 
          url: "/worksheets/sys_arch_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: CPU Systems", 
          url: "https://www.bbc.co.uk/bitesize/guides/zmb9mp3/revision/1" 
        }
      ]
    },
    {
      id: "mem_storage",
      name: "Memory and Storage",
      mastery: 55,
      resources: [
        { 
          type: "video", 
          title: "RAM & ROM Explained", 
          url: "https://www.youtube.com/watch?v=1H-GtLzDuEw" 
        },
        { 
          type: "worksheet", 
          title: "Storage Devices Comparison", 
          url: "/worksheets/mem_storage_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "Seneca: Memory & Storage", 
          url: "https://senecalearning.com/en-GB/revision-notes/gcse/computer-science/ocr" 
        }
      ]
    },
    {
      id: "networks",
      name: "Computer Networks",
      mastery: 35,
      resources: [
        { 
          type: "video", 
          title: "Network Topologies & Protocols", 
          url: "https://www.youtube.com/watch?v=Hkl3JBM2rIE" 
        },
        { 
          type: "worksheet", 
          title: "Network Layers & Protocols", 
          url: "/worksheets/networks_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Computer Networks", 
          url: "https://www.bbc.co.uk/bitesize/guides/zc6rcdm/revision/1" 
        }
      ]
    },
    {
      id: "security",
      name: "Cyber Security",
      mastery: 30,
      resources: [
        { 
          type: "video", 
          title: "Cyber Attacks & Prevention Methods", 
          url: "https://www.youtube.com/watch?v=5MMoxyK1Y9o" 
        },
        { 
          type: "worksheet", 
          title: "Security Threats & Mitigation", 
          url: "/worksheets/security_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Network Security", 
          url: "https://www.bbc.co.uk/bitesize/guides/z8nk87h/revision/1" 
        }
      ]
    },
    {
      id: "prog_fund",
      name: "Programming Fundamentals",
      mastery: 88,
      resources: [
        { 
          type: "video", 
          title: "Selection, Iteration & Sequence", 
          url: "https://www.youtube.com/watch?v=WXgvAVl6fqE" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs", 
          url: "/worksheets/prog_fund_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Python Programming", 
          url: "https://www.bbc.co.uk/bitesize/guides/zts8v9q/revision/4" 
        }
      ]
    },
    {
      id: "data_rep",
      name: "Data Representation",
      mastery: 62,
      resources: [
        { 
          type: "video", 
          title: "Binary, Denary & Hex Conversions", 
          url: "https://www.youtube.com/watch?v=rKJbOCXKu0I" 
        },
        { 
          type: "worksheet", 
          title: "Number Systems & Encoding", 
          url: "/worksheets/data_rep_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Representing Data", 
          url: "https://www.bbc.co.uk/bitesize/guides/zpfdwmn/revision/1" 
        }
      ]
    },
    {
      id: "algo",
      name: "Algorithms",
      mastery: 75,
      resources: [
        { 
          type: "video", 
          title: "Searching & Sorting Algorithms", 
          url: "https://www.youtube.com/watch?v=DLvJkG2a2aU" 
        },
        { 
          type: "worksheet", 
          title: "Algorithm Efficiency & Big O", 
          url: "/worksheets/algo_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "VisuAlgo: Sorting Algorithms", 
          url: "https://visualgo.net/en/sorting" 
        }
      ]
    },
    {
      id: "ethics",
      name: "Ethical, Legal & Cultural Issues",
      mastery: 60,
      resources: [
        { 
          type: "video", 
          title: "Privacy, Legislation & Cultural Impact", 
          url: "https://www.youtube.com/watch?v=qI9AK0401D0" 
        },
        { 
          type: "worksheet", 
          title: "Ethics & Legislation", 
          url: "/worksheets/ethics_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Ethics & Environment", 
          url: "https://www.bbc.co.uk/bitesize/guides/zbxbwmn/revision/1" 
        }
      ]
    }
  ],
  // Generate 8 recent activities
  recentActivity: [
    {
      type: "assessment",
      title: "Programming Fundamentals Quiz",
      completedAt: getDateBefore(1),
      score: 92,
      topicId: "prog_fund",
      topicName: "Programming Fundamentals",
      resources: [
        { 
          type: "video", 
          title: "Selection, Iteration & Sequence", 
          url: "https://www.youtube.com/watch?v=WXgvAVl6fqE" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs", 
          url: "/worksheets/prog_fund_ws1.pdf" 
        }
      ]
    },
    {
      type: "activity",
      title: "Algorithms Practice",
      completedAt: getDateBefore(2),
      score: 80,
      topicId: "algo",
      topicName: "Algorithms",
      resources: [
        { 
          type: "worksheet", 
          title: "Algorithm Efficiency & Big O", 
          url: "/worksheets/algo_ws1.pdf" 
        }
      ]
    },
    {
      type: "assessment",
      title: "Systems Architecture Test",
      completedAt: getDateBefore(4),
      score: 65,
      topicId: "sys_arch",
      topicName: "Systems Architecture",
      resources: [
        { 
          type: "video", 
          title: "CPU Components & the Fetch-Execute Cycle", 
          url: "https://www.youtube.com/watch?v=Z5JC9Ve1sfI" 
        }
      ]
    },
    {
      type: "activity",
      title: "Networks Tutorial",
      completedAt: getDateBefore(5),
      score: 40,
      topicId: "networks",
      topicName: "Computer Networks",
      resources: [
        { 
          type: "worksheet", 
          title: "Network Layers & Protocols", 
          url: "/worksheets/networks_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Network Security", 
          url: "https://www.bbc.co.uk/bitesize/guides/z8nk87h/revision/1" 
        }
      ]
    },
    {
      type: "activity",
      title: "Data Representation Exercise",
      completedAt: getDateBefore(6),
      score: 70,
      topicId: "data_rep",
      topicName: "Data Representation",
      resources: [
        { 
          type: "video", 
          title: "Binary, Denary & Hex Conversions", 
          url: "https://www.youtube.com/watch?v=rKJbOCXKu0I" 
        }
      ]
    },
    {
      type: "assessment",
      title: "Memory & Storage Quiz",
      completedAt: getDateBefore(8),
      score: 55,
      topicId: "mem_storage",
      topicName: "Memory and Storage",
      resources: [
        { 
          type: "link", 
          title: "Seneca: Memory & Storage", 
          url: "https://senecalearning.com/en-GB/revision-notes/gcse/computer-science/ocr" 
        }
      ]
    },
    {
      type: "activity",
      title: "Cyber Security Worksheet",
      completedAt: getDateBefore(9),
      score: 35,
      topicId: "security",
      topicName: "Cyber Security",
      resources: [
        { 
          type: "worksheet", 
          title: "Security Threats & Mitigation", 
          url: "/worksheets/security_ws1.pdf" 
        }
      ]
    },
    {
      type: "assessment",
      title: "Ethics and Legislation Exam",
      completedAt: getDateBefore(12),
      score: 62,
      topicId: "ethics",
      topicName: "Ethical, Legal & Cultural Issues",
      resources: [
        { 
          type: "video", 
          title: "Privacy, Legislation & Cultural Impact", 
          url: "https://www.youtube.com/watch?v=qI9AK0401D0" 
        }
      ]
    }
  ],
  insights: {
    strengths: ["Programming Fundamentals", "Algorithms"],
    areasForImprovement: ["Computer Networks", "Cyber Security"],
    lastActive: null, // Will be set to the most recent activity date
    activityCount: 8
  }
};

// Calculate the overall progress based on skill masteries
const totalMastery = johnData.skills.reduce((sum, skill) => sum + skill.mastery, 0);
johnData.overallProgress = Math.round(totalMastery / johnData.skills.length);

// Set the most recent activity date
johnData.insights.lastActive = johnData.recentActivity[0]?.completedAt || null;

module.exports = johnData;