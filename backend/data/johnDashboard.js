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
          url: "https://cdn.savemyexams.com/pdfs/PfIkRd.pdf" 
        },
        { 
          type: "worksheet", 
          title: "Systems Architecture Worksheet", 
          url: "https://docs.google.com/document/d/1TWjiO8KYwiiiRoC7eOWNxRlbqTPipMMIaaVjKvjykLc/edit?usp=sharing" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: CPU Systems", 
          url: "https://www.bbc.co.uk/bitesize/guides/zbfny4j/revision/6#:~:text=Systems%20architecture%20%2D%20OCRCPU%20performance,describes%20how%20a%20processor%20functions.&text=Save%20guides%2C%20add%20subjects%20and,off%20with%20your%20BBC%20account." 
        },
        { 
          type: "quiz", 
          title: "Computer Systems Architecture Quiz", 
          url: "/worksheets/computer_systems_architecture_quiz.html" 
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
          url: "https://youtu.be/Q2pzT6oYPWg?si=YAcHN3Hu8Az7TkRu" 
        },
        { 
          type: "video", 
          title: "Memory and Storage Video", 
          url: "https://youtu.be/dhQOkkZXu5w?si=ZzjsPFGSG76VSJhP" 
        },
        { 
          type: "worksheet", 
          title: "Storage Devices Comparison (Self-Marked)", 
          url: "/worksheets/storage_devices_self_marked.html" 
        },
        { 
          type: "worksheet", 
          title: "Memory and Storage Worksheet", 
          url: "https://docs.google.com/document/d/1kvjKHSvhHFIVO1XxTqssamLP1HGv6Fsjro1L7raBb2I/edit?usp=sharing" 
        },
        { 
          type: "link", 
          title: "Seneca: Memory & Storage", 
          url: "https://senecalearning.com/en-GB/definitions/memory/" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Memory and Storage", 
          url: "https://www.bbc.co.uk/bitesize/guides/zd4r97h/revision/1" 
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
          url: "https://youtube.com/playlist?list=PLCiOXwirraUBnOLZCIxrLTSuIfgvYeWj-&si=WuktcTOyqb08qYan" 
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
      name: "Network Security",
      mastery: 30,
      resources: [
        { 
          type: "video", 
          title: "J277 1.4.1 Threats to Computer Systems and Networks", 
          url: "https://youtu.be/4f05t8ppJfk?si=oeiGrNYUuHPR0I1r" 
        },
        { 
          type: "worksheet", 
          title: "J277 1.4.2 Identifying and Preventing Vulnerabilities", 
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
          url: "https://youtu.be/t0VphK9cWgE?si=KJTMM38oX6exgmPg" 
        },
        { 
          type: "video", 
          title: "Producing Robust Programs", 
          url: "https://youtu.be/2IIF4Infdf4?si=mWLxqKMyTYbco-84" 
        },
        { 
          type: "video", 
          title: "Programming Fundamentals Video", 
          url: "https://youtu.be/dpBe_TXFqZ8?si=LyC8AXq7tk8DIEj0" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs", 
          url: "/worksheets/prog_fund_ws1.html" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs OCR – Year 10 Worksheet", 
          url: "/worksheets/programming_constructs_ocr_year10.html" 
        },
        { 
          type: "worksheet", 
          title: "Producing Robust Programmes Worksheet", 
          url: "https://docs.google.com/document/d/1tQoKrgB17aAi6v2F8OZ4GgMQSlEzVuV1GXrq1ATy9KA/edit?usp=sharing" 
        },
        { 
          type: "worksheet", 
          title: "Programming Fundamentals Worksheet", 
          url: "https://docs.google.com/document/d/17_ZypEHE9wvGCvrH3EwY-NE1TCIZNCDTR44py-KUN9s/edit?usp=sharing" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Python Programming", 
          url: "https://www.bbc.co.uk/bitesize/guides/zts8v9q/revision/4" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Producing Robust Programs", 
          url: "https://www.bbc.co.uk/bitesize/guides/z4cg4qt/revision/1" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Programming Fundamentals", 
          url: "https://www.bbc.co.uk/bitesize/guides/znh6pbk/revision/3" 
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
          url: "https://www.youtube.com/watch?v=nmbr7GxN6TA&ab_channel=Craig%27n%27Dave" 
        },
        { 
          type: "worksheet", 
          title: "Number Systems & Encoding", 
          url: "/worksheets/data_rep_ws1.pdf" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Representing Data", 
          url: "https://www.bbc.co.uk/bitesize/guides/zfspfcw/revision/9#:~:text=Units%20and%20data%20representation%20%2D%20OCRSound,are%20also%20done%20in%20binary." 
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
          url: "https://youtube.com/playlist?list=PLCiOXwirraUAzsy9tacd98LBTbj7cyFQV&si=qc69yJWHt6NwYAuf" 
        },
        { 
          type: "video", 
          title: "Algorithms Video", 
          url: "https://youtu.be/wLJ1n47sGRI?si=YFufeD_DLkHgSTiD" 
        },
        { 
          type: "worksheet", 
          title: "Algorithms Worksheet", 
          url: "https://docs.google.com/document/d/1Vup5Emtl8V86MpKMWdHmxzFgo5IsVmo5TprxDy1EZ8U/edit?usp=sharing" 
        },
        { 
          type: "link", 
          title: "VisuAlgo: Sorting Algorithms", 
          url: "https://visualgo.net/en/sorting" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Algorithms", 
          url: "https://www.bbc.co.uk/bitesize/guides/z6m7xfr/revision/1" 
        }
      ]
    },
    {
      id: "boolean_logic",
      name: "Boolean Logic",
      mastery: 45,
      resources: [
        { 
          type: "video", 
          title: "Boolean Logic & Truth Tables", 
          url: "https://youtu.be/jN9WtjyjXf4?si=MoYR8LJ570_daAHR" 
        },
        { 
          type: "worksheet", 
          title: "Boolean Logic Worksheet", 
          url: "https://docs.google.com/document/d/1YbUNlX1NnGF8hzgoVzgkRv54L-B4yARN3x0dVQrcLlQ/edit?usp=sharing" 
        },
        { 
          type: "link", 
          title: "BBC Bitesize: Boolean Logic", 
          url: "https://www.bbc.co.uk/bitesize/guides/zjw8jty/revision/1" 
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
          url: "https://youtube.com/playlist?list=PLCiOXwirraUCJmKc7xDNgrKdUNIxIeQbi&si=V-gPwV0vmKPLPSkF" 
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
          url: "https://youtu.be/t0VphK9cWgE?si=KJTMM38oX6exgmPg" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs", 
          url: "/worksheets/prog_fund_ws1.html" 
        },
        { 
          type: "worksheet", 
          title: "Programming Constructs OCR – Year 10 Worksheet", 
          url: "/worksheets/programming_constructs_ocr_year10.html" 
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
      title: "Network Security Worksheet",
      completedAt: getDateBefore(9),
      score: 35,
      topicId: "security",
      topicName: "Network Security",
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
    areasForImprovement: ["Computer Networks", "Network Security"],
    lastActive: null, // Will be set to the most recent activity date
    activityCount: 8
  },
  badges: [
    {
      id: 'first_login',
      title: 'Welcome Aboard!',
      description: 'Completed your first login',
      icon: '🎉',
      color: '#2196f3',
      earnedDate: '2024-01-15'
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Scored 90%+ on 5 quizzes',
      icon: '🧠',
      color: '#9c27b0',
      earnedDate: '2024-01-20'
    },
    {
      id: 'blooms_climber',
      title: "Bloom's Climber",
      description: 'Reached Analyze level in any topic',
      icon: '🏔️',
      color: '#4caf50',
      earnedDate: '2024-01-22'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Achieved 100% on any assessment',
      icon: '💯',
      color: '#ffc107',
      earnedDate: '2024-01-18'
    }
  ]
};

// Calculate the overall progress based on skill masteries
const totalMastery = johnData.skills.reduce((sum, skill) => sum + skill.mastery, 0);
johnData.overallProgress = Math.round(totalMastery / johnData.skills.length);

// Set the most recent activity date
johnData.insights.lastActive = johnData.recentActivity[0]?.completedAt || null;

module.exports = johnData;