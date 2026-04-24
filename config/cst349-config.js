// AUTO-GENERATED — Do not edit manually
// Source: config/cst349-assignments.csv
// Run: node scripts/canvas-sync.js --action=generate-config --course=cst349
//
// To update assignments: Edit the CSV file, then run the generate-config command above.
// Canvas IDs are synced via GitHub Actions workflow.

/**
 * CST349 Configuration
 * Professional Seminar
 */

const CST349_CONFIG = {
  // Semester info
  semester: "Spring 2026",
  courseCode: "CST349-01",
  courseName: "Professional Seminar",

  // Canvas base URL - UPDATE EACH SEMESTER
  // Find this in your Canvas URL: https://csumb.instructure.com/courses/XXXXX
  canvasBaseUrl: "https://csumb.instructure.com/courses/32911",

  // Canvas assignment URLs - UPDATE EACH SEMESTER
  // To find assignment IDs: Go to assignment in Canvas, look at URL
  // Example: /courses/12345/assignments/67890 -> canvasId: "67890"
  assignments: {
    // Sprint 1
    "s1-self-assessment": {
      canvasId: "144469",
      title: "S1: Skills Self-Assessment",
      dueDate: "2026-01-22",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Goal Setting",
      points: 10,
      sprint: 1,
      week: 1,
      htmlFile: "assignments/s1-w1-skills-self-assessment.html",
      briefing: "Rate yourself honestly across 8 SDL dimensions. This becomes your baseline — you'll compare against it in every sprint. Accuracy matters more than looking good."
    },
    "s1-reflection-1": {
      canvasId: "144470",
      title: "S1: Productive Reflection #1",
      dueDate: "2026-01-24",
      type: "reflection",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 1,
      htmlFile: "assignments/s1-w1-productive-reflection.html",
      briefing: "Your first reflection captures where you think you are. The value comes later when you compare this to where you actually end up."
    },
    "s1-skills-revision": {
      canvasId: "144730",
      title: "S1: Skills Assessment Revision",
      dueDate: "2026-01-29",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Goal Setting",
      points: 5,
      sprint: 1,
      week: 2,
      htmlFile: "assignments/s1-w2-skills-revision.html",
      briefing: "After a week of class, revisit your self-assessment. What did you rate too high? Too low? The revision is evidence of metacognition.",
      questions: [
        {
          "type": "essay",
          "text": "What's underneath your gap? If you said 'communication' or something similarly broad — what's the real barrier? Be specific about what actually happens. (If your gap was already specific, explain why you're confident it's the real issue.)",
          "points": 2
        },
        {
          "type": "essay",
          "text": "Rewrite your friction story with YOU as the protagonist. Focus on what YOU had control over. What could you have done differently? What opportunities did you have that you didn't take?",
          "points": 2
        },
        {
          "type": "essay",
          "text": "What would 'better' look like? Describe a specific future situation where you'd handle it differently. What would you actually DO? Be concrete and observable.",
          "points": 1
        }
      ]
    },
    "s1-five-whys": {
      canvasId: "570032",
      title: "S1: 5 Whys Analysis",
      dueDate: "2026-01-29",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 1: Goal Setting",
      points: 5,
      sprint: 1,
      week: 2,
      htmlFile: "assignments/s1-w2-five-whys.html",
      briefing: "Apply 5 Whys to one skill gap you identified. Surface-level answers sound like 'I need to practice more.' Real root causes sound like 'I avoid situations where this skill matters.'",
      questions: [
        {
          "type": "essay",
          "text": "Starting Point: 'I struggle with [your skill] because...' — Write your first answer. What happens when you try to use this skill?",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Why #1: Why is that? What causes the problem you described above?",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Why #2: Why does that happen? Go deeper into the cause.",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Why #3: Why is that the case? Keep pushing past surface explanations.",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Why #4/5: What's the root cause you can actually address? This should be something specific, actionable, and honest — something you can actually work on.",
          "points": 1
        }
      ]
    },
    "s1-sprint-plan": {
      canvasId: "144791",
      title: "S1: Sprint Plan v1",
      dueDate: "2026-02-07",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Goal Setting",
      points: 5,
      sprint: 1,
      week: 3,
      htmlFile: "assignments/s1-w3-sprint-plan.html",
      briefing: "Your plan for developing one skill over the sprint. The plan itself matters less than whether you can explain why you chose this sequence of steps.",
      questions: [
        {
          "type": "file_upload",
          "text": "Upload the JSON file downloaded from the Sprint Plan activity. Make sure the file includes your name.",
          "points": 5
        }
      ]
    },
    "s1-reflection-2": {
      canvasId: "570068",
      title: "S1: Productive Reflection #2",
      dueDate: "2026-01-31",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 2,
      htmlFile: "assignments/s1-w2-productive-reflection.html",
      briefing: "Handwritten reflection on what shifted this week. If you're writing what you think the instructor wants to hear, start over.",
      questions: [
        {
          "type": "file_upload",
          "text": "Upload a photo of your handwritten reflection from today's class session. Your reflection should capture your thinking about your skill gap and root cause analysis.",
          "points": 5
        }
      ]
    },
    "s1-learning-log": {
      canvasId: "144792",
      title: "S1: Learning Log (Week 3)",
      dueDate: "2026-02-07",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 3,
      htmlFile: "assignments/s1-w3-learning-log.html",
      briefing: "Document what you actually did this week versus what you planned. The gap between plan and reality is the most useful data in this course.",
      questions: [
        {
          "type": "file_upload",
          "text": "Upload photos of your 3 handwritten learning log entries from your notebook. Make sure all text is legible in the photos.",
          "points": 5
        }
      ]
    },
    "s1-reflection-3": {
      canvasId: "144793",
      title: "S1: Productive Reflection #3",
      dueDate: "2026-02-09",
      type: "reflection",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 3,
      htmlFile: "assignments/s1-w3-productive-reflection.html",
      briefing: "Third reflection — what's your honest assessment of whether your sprint plan is working? If it isn't, what would you change?",
      questions: [
        {
          "type": "file_upload",
          "text": "Upload a photo of your handwritten Productive Reflection #3 from your notebook.",
          "points": 5
        }
      ]
    },
    "s1-demo-discussion": {
      canvasId: "582107",
      title: "S1: Sprint 1 Demo Discussion",
      dueDate: "2026-02-11",
      type: "quiz",
      canvasType: "assignment",
      assignmentGroup: "Sprint 1: Demonstration",
      points: 10,
      sprint: 1,
      week: 4,
      htmlFile: "activities/sprint-1-demo.html",
      briefing: "Present your growth arc to your group. Not what you did — what changed in how you think about this skill. Evidence required."
    },

    // Sprint 2
    "s2-bridge-reflection-1": {
      canvasId: "582108",
      title: "S2: Sprint 1-2 Bridge Reflection",
      dueDate: "2026-02-12",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 4,
      htmlFile: "assignments/s2-w5-bridge-reflection.html",
      briefing: "What actually worked in Sprint 1? What was just going through the motions? Carry the real lessons forward, drop the performance."
    },
    "s2-orientation": {
      canvasId: "582109",
      title: "S2: Sprint 2 Orientation",
      dueDate: "2026-02-14",
      type: "quiz",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Goal Setting",
      points: 5,
      sprint: 2,
      week: 4,
      htmlFile: "activities/s2-orientation.html",
      briefing: "Sprint 2 adds external accountability — your group. The orientation explains why this changes the dynamic."
    },
    "s2-goal-setting": {
      canvasId: "582110",
      title: "S2: Sprint 2 Goal Setting",
      dueDate: "2026-02-16",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Goal Setting",
      points: 10,
      sprint: 2,
      week: 4,
      htmlFile: "assignments/s2-w5-goal-setting.html",
      briefing: "Set goals that build on Sprint 1 findings. If you're picking the same goal with the same plan, ask why Sprint 1 didn't work."
    },
    "s2-group-rules": {
      canvasId: "582790",
      title: "S2: Group Rules & Check-in Plan",
      dueDate: "2026-02-19",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 5,
      htmlFile: "assignments/s2-w5-group-rules.html",
      briefing: "Establish how your group will hold each other accountable. Vague rules produce vague accountability."
    },
    "s2-reflection-4": {
      canvasId: "582791",
      title: "S2: Productive Reflection #4",
      dueDate: "2026-02-21",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 5,
      htmlFile: "assignments/s2-w5-productive-reflection.html",
      briefing: "First group-context reflection. How does having others watching change your effort? Be honest about whether it helps or creates pressure to perform."
    },
    "s2-evidence-design": {
      canvasId: "582792",
      title: "S2: Evidence Design — What Will You Demonstrate?",
      dueDate: "2026-02-23",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Goal Setting",
      points: 5,
      sprint: 2,
      week: 5,
      htmlFile: "assignments/s2-w5-evidence-design.html",
      briefing: "Design what evidence of growth will look like for your specific goal. If you can't describe it concretely, your goal may be too vague."
    },
    "s2-triad-checkin-1": {
      canvasId: "582793",
      title: "S2: Triad Check-in #1",
      dueDate: "2026-02-26",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 6,
      htmlFile: "assignments/s2-w6-triad-checkin.html",
      briefing: "First structured check-in with your group. Share progress honestly — what you did, what you skipped, what surprised you."
    },
    "s2-reflection-5": {
      canvasId: "582794",
      title: "S2: Productive Reflection #5",
      dueDate: "2026-02-28",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 6,
      htmlFile: "assignments/s2-w6-productive-reflection.html",
      briefing: "What's different about how you're approaching your goal compared to Sprint 1? If nothing changed, that's worth examining."
    },
    "s2-networking-prep": {
      canvasId: "582795",
      title: "S2: Networking Event Preparation",
      dueDate: "2026-03-02",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 6,
      htmlFile: "assignments/s2-w6-networking-prep.html",
      briefing: "Prepare for the networking event. Come with questions that test your assumptions about what the industry actually values."
    },
    "s2-networking-report": {
      canvasId: "582796",
      title: "S2: Networking Event Report",
      dueDate: "2026-03-05",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 10,
      sprint: 2,
      week: 7,
      htmlFile: "assignments/s2-w7-networking-report.html",
      briefing: "What did you learn from professionals that challenged or confirmed your assumptions? Specific quotes or moments, not vague takeaways."
    },
    "s2-reflection-6": {
      canvasId: "582797",
      title: "S2: Productive Reflection #6",
      dueDate: "2026-03-07",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 7,
      htmlFile: "assignments/s2-w7-productive-reflection.html",
      briefing: "Post-networking reflection. Did anything you heard change your Sprint 2 goal or approach?"
    },
    "s2-demo-slides": {
      canvasId: "582798",
      title: "S2: Demo Slide Builder",
      dueDate: "2026-03-09",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Demonstration",
      points: 5,
      sprint: 2,
      week: 7,
      htmlFile: "assignments/s2-w7-demo-slides.html",
      briefing: "Build your demo around evidence, not claims. Each slide should show something observable, not just say you grew."
    },
    "s2-demo": {
      canvasId: "582799",
      title: "S2: Demonstration with Evidence",
      dueDate: "2026-03-11",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Demonstration",
      points: 10,
      sprint: 2,
      week: 8,
      htmlFile: "assignments/s2-w8-demo.html",
      briefing: "Present growth evidence to your combined group. The audience looks for the gap between what you claim and what you show — prepare for that."
    },
    "s2-peer-eval": {
      canvasId: "582800",
      title: "S2: Peer Evaluation",
      dueDate: "2026-03-11",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 8,
      htmlFile: "assignments/s2-w8-peer-eval.html",
      briefing: "Observe other demos. Use the NOTICE/INTERPRET/ASK framework. Your observations help others see what they can't see about themselves."
    },
    "s2-bridge-reflection-2": {
      canvasId: "582801",
      title: "S2: Sprint 2→3 Bridge Reflection",
      dueDate: "2026-03-12",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 8,
      htmlFile: "assignments/s2-w8-bridge-reflection.html",
      briefing: "Five claims about what this course has taught you so far. Connect each to specific moments, not general feelings."
    },
    "s2-claims-discussion": {
      canvasId: "585103",
      title: "S2: Claims in Practice",
      dueDate: "2026-03-13",
      type: "ai-discussion",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 8,
      htmlFile: "assignments/s2-w8-claims-discussion.html",
      briefing: "AI-structured conversation pushing you to find real evidence for each claim. The AI won't let you get away with vague assertions."
    },

    // Sprint 3
    "s3-reflection-7": {
      canvasId: "586014",
      title: "S3: Productive Reflection #7",
      dueDate: "2026-03-20",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Productive Reflections",
      points: 5,
      sprint: 3,
      week: 9,
      htmlFile: "assignments/s3-w9-reflection.html",
      briefing: "What did your audit reveal that surprised you? Not what you wish your diet looked like — what does the actual pattern tell you about what you've been paying attention to?"
    },
    "s3-info-diet-audit": {
      canvasId: "586015",
      title: "S3: Information Diet Audit + First Signal",
      dueDate: "2026-03-19",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Goal Setting",
      points: 5,
      sprint: 3,
      week: 9,
      htmlFile: "assignments/s3-w9-info-diet-audit.html",
      briefing: "Document what you actually consume, not what you wish you consumed. The patterns you find are the starting point for change."
    },
    "s3-goal-setting": {
      canvasId: "586016",
      title: "S3: Sprint 3 Goal Setting",
      dueDate: "2026-03-23",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Goal Setting",
      points: 5,
      sprint: 3,
      week: 9,
      htmlFile: "assignments/s3-w9-goal-setting.html",
      briefing: "Three commitments: your focus area, your intake targets, and first-attempt answers to the questions your Futures Brief will answer."
    },

    // Sprint 4
    "s4-evidence-inventory": {
      title: "S4: Evidence Inventory",
      dueDate: "2026-04-23",
      type: "assignment"
    },
    "s4-gap-analysis": {
      title: "S4: Gap Analysis",
      dueDate: "2026-04-23",
      type: "assignment"
    },
    "s4-reflection-10": {
      title: "S4: Productive Reflection #10",
      dueDate: "2026-04-25",
      type: "reflection"
    },
    "s4-narrative-arc": {
      title: "S4: Narrative Arc Draft",
      dueDate: "2026-04-30",
      type: "assignment"
    },
    "s4-evidence-selection": {
      title: "S4: Evidence Selection",
      dueDate: "2026-04-30",
      type: "assignment"
    },
    "s4-reflection-11": {
      title: "S4: Productive Reflection #11",
      dueDate: "2026-05-02",
      type: "reflection"
    },
    "s4-defense-draft": {
      title: "S4: Defense Draft",
      dueDate: "2026-05-07",
      type: "assignment"
    },
    "s4-practice-defense": {
      title: "S4: Practice Defense",
      dueDate: "2026-05-07",
      type: "assignment"
    },
    "s4-reflection-12": {
      title: "S4: Productive Reflection #12",
      dueDate: "2026-05-09",
      type: "reflection"
    },
    "s4-final-defense": {
      title: "S4: Final Portfolio Defense",
      dueDate: "2026-05-14",
      type: "assignment"
    },
    "s4-peer-eval": {
      title: "S4: Peer Evaluations",
      dueDate: "2026-05-15",
      type: "assignment"
    },
    "s4-final-reflection": {
      title: "Final Reflection",
      dueDate: "2026-05-16",
      type: "bridge"
    },

    // Sprint 3
    "s3-w10-checkin": {
      canvasId: "586958",
      title: "S3: Goal Check-In Week 10",
      dueDate: "2026-03-25",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 5,
      sprint: 3,
      week: 10,
      htmlFile: "assignments/s3-w10-goal-checkin.html",
      briefing: "First honest check against your Sprint 3 goals. Update your intake numbers, name a new source, and track how your three questions are evolving."
    },
    "s3-reflection-8": {
      canvasId: "586959",
      title: "S3: Productive Reflection #8",
      dueDate: "2026-03-27",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Productive Reflections",
      points: 5,
      sprint: 3,
      week: 10,
      htmlFile: "assignments/s3-w10-productive-reflection.html",
      briefing: "What did you consume this week that you wouldn't have before this sprint? Name the source. What surprised you? If nothing new — what got in the way?"
    },
    "s3-w11-checkin": {
      canvasId: "586960",
      title: "S3: Goal Check-In Week 11",
      dueDate: "2026-04-08",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 5,
      sprint: 3,
      week: 11,
      htmlFile: "assignments/s3-w11-goal-checkin.html",
      briefing: "Second check-in. Same structure as Week 10 but the bar is higher — has anything you consumed actually changed something you think or do?"
    },
    "s3-reflection-9": {
      canvasId: "586961",
      title: "S3: Productive Reflection #9",
      dueDate: "2026-04-10",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Productive Reflections",
      points: 5,
      sprint: 3,
      week: 11,
      htmlFile: "assignments/s3-w11-productive-reflection.html",
      briefing: "The transfer test: can you point to something specific you believe differently now because of what you read or listened to this sprint?"
    },
    "s3-w11-codesign": {
      canvasId: "588225",
      title: "Sprint 4 Co-Design Activity",
      dueDate: "2026-04-08",
      type: "activity",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 10,
      sprint: 3,
      week: 11,
      htmlFile: "activities/s3-w11-codesign.html"
    },
    "s3-demo-discussion": {
      canvasId: "588226",
      title: "S3: Sprint 3 Demo Discussion",
      dueDate: "2026-04-15",
      type: "ai-discussion",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Demonstration",
      points: 10,
      sprint: 3,
      week: 12,
      htmlFile: "activities/sprint-3-demo.html",
      briefing: "Demo Day. Your partner enters your handwritten responses, formulates follow-up questions, and you discuss face-to-face. The conversation is the assessment."
    },

    // Sprint 4
    "s4-w13-retrospective": {
      canvasId: "588978",
      title: "S4: Three-Sprint Retrospective",
      dueDate: "2026-04-22",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Goal Setting",
      points: 10,
      sprint: 4,
      week: 13,
      htmlFile: "assignments/s4-w13-three-sprint-retrospective.html",
      briefing: "Honestly evaluate your growth across 8 SDL dimensions over Sprints 1-3. No AI — this is your own self-assessment."
    },
    "s4-w13-gap-statement": {
      canvasId: "588979",
      title: "S4: Gap Statement",
      dueDate: "2026-04-26",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Goal Setting",
      points: 10,
      sprint: 4,
      week: 13,
      htmlFile: "assignments/s4-w13-gap-statement.html",
      briefing: "Identify one real gap from Sprints 1-3 that becomes your Sprint 4 focus. Be specific — vague gaps get rejected."
    },
    "s4-lookback-1-five-whys": {
      canvasId: "588980",
      title: "S4: Look-back 1 — 5 Whys (Extra Credit)",
      dueDate: "2026-04-28",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Extra Credit: Look Back",
      points: 5,
      sprint: 4,
      week: 13,
      htmlFile: "assignments/s4-w13-lookback-1-five-whys.html",
      briefing: "Extra credit recovery. Revisit your Sprint 1 5 Whys honestly. Check-in with Prof. Sathya in class to get credit for this submission."
    },
    "s4-w13-engagement": {
      canvasId: "590108",
      title: "S4: In-Class Engagement — Week 13",
      dueDate: "2026-04-22",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Check-in/Engagement",
      points: 5,
      sprint: 4,
      week: 13,
      htmlFile: "assignments/s4-w13-engagement.html",
      briefing: "Attendance and participation in W13 in-class activities. Instructor-assessed — no submission required."
    },
    "s4-w14-engagement": {
      canvasId: "590109",
      title: "S4: In-Class Engagement — Week 14",
      dueDate: "2026-04-29",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Check-in/Engagement",
      points: 5,
      sprint: 4,
      week: 14,
      htmlFile: "assignments/s4-w14-engagement.html",
      briefing: "Attendance and participation in W14 in-class activities. Instructor-assessed — no submission required."
    },
    "s4-w15-engagement": {
      canvasId: "590110",
      title: "S4: In-Class Engagement — Week 15",
      dueDate: "2026-05-06",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Check-in/Engagement",
      points: 5,
      sprint: 4,
      week: 15,
      htmlFile: "assignments/s4-w15-engagement.html",
      briefing: "Attendance and participation in W15 defense + mock practice sessions. Instructor-assessed — no submission required."
    },
    "s4-w16-engagement": {
      canvasId: "590111",
      title: "S4: In-Class Engagement — Week 16",
      dueDate: "2026-05-13",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Check-in/Engagement",
      points: 5,
      sprint: 4,
      week: 16,
      htmlFile: "assignments/s4-w16-engagement.html",
      briefing: "Attendance and participation in W16 defense sessions. Instructor-assessed — no submission required."
    },
    "s4-notebook": {
      canvasId: "590112",
      title: "S4: Notebook Grade",
      dueDate: "2026-05-13",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Final Submission",
      points: 10,
      sprint: 4,
      week: 15,
      htmlFile: "assignments/s4-notebook.html",
      briefing: "Handwritten notebook collected at end of semester. Instructor-assessed — no submission required."
    },
    "s4-defense-presentation": {
      canvasId: "590113",
      title: "S4: Final Defense Presentation",
      dueDate: "2026-05-13",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Demonstration",
      points: 18,
      sprint: 4,
      week: 15,
      htmlFile: "assignments/s4-defense-presentation.html",
      briefing: "PDF of your defense slides (10 pts) + in-class defense presentation (8 pts). Due noon Wed May 13 — before the final class."
    }
  },

  // Class recording Loom videos - ADD URLS AS AVAILABLE
  // Set to null if no recording was made for that week
  loomVideos: {
    1: "https://www.loom.com/share/212ab04d442e4cdf94fadfa026fe9015",  // Week 1
    2: null,  // Week 2
    3: null,  // Week 3
    4: null,  // Week 4
    5: null,  // Week 5
    6: null,  // Week 6
    7: null,  // Week 7
    8: null,  // Week 8
    9: "https://www.loom.com/share/51ff5e025774426a87cdd42a1d5430fc",  // Week 9
    10: null, // Week 10
    11: null, // Week 11
    12: null, // Week 12
    13: null, // Week 13
    14: null, // Week 14
    15: null, // Week 15
    16: null  // Week 16
  },

  // External resource URLs
  resources: {
    umpireGuide: "https://docs.google.com/document/d/UMPIRE_DOC_ID",
    threeCsTemplate: "https://docs.google.com/document/d/3CS_DOC_ID",
    symbioticThinking: "https://symbioticthinking.ai/",
    dojoAccess: "https://dojo.symbioticthinking.ai",
    syllabus: "https://docs.google.com/document/d/SYLLABUS_DOC_ID"
  },

  // Weekly homepage content (narrative zones)
  weeklyContent: {
    1: {
      narrative: "Welcome. This course is about proving you can learn anything you need to learn — with evidence, not just claims.",
      connection: "Technical skills get you hired. Self-Directed Learning keeps you relevant.",
      insight: "Most people overestimate what they know and underestimate what they need to learn. This course is about closing that gap with evidence.",
      employerLink: { text: "You're building the meta-skill underneath everything else employers want.", source: null },
      portfolioConnection: "Sprint 1 establishes your baseline across 8 SDL dimensions."
    },
    2: {
      narrative: "Identify your growth edge — the specific skill gap that will have the biggest impact on your career readiness.",
      connection: "Last week was broad self-assessment. This week you narrow to the thing that matters most.",
      insight: "Students consistently cite networking and time management as their biggest challenges but can't explain WHY or WHAT they've tried. Go deeper than the obvious answer.",
      employerLink: { text: "Self-awareness about your own gaps is Metacognition — the operating system that makes every other skill work.", source: null },
      portfolioConnection: "Your skill selection drives the entire semester. Choose based on evidence, not assumption."
    },
    3: {
      narrative: "Active learning week. Start practicing — not just planning.",
      connection: "You identified the skill. Now actually do something about it and capture what happens.",
      insight: "A plan to improve is not improvement. Evidence of practice — even failed practice — is.",
      employerLink: { text: "Initiative means taking action without waiting for direction. Start now.", source: null },
      portfolioConnection: "Your learning log becomes your evidence trail. Capture what confused you and what clicked."
    },
    4: {
      narrative: "Demo week. Show what changed — with evidence.",
      connection: "Everything converges: self-assessment → skill selection → practice → demonstration.",
      insight: "Your demo isn't about what you did. It's about what you LEARNED and how you know you learned it.",
      employerLink: { text: "Being able to describe what you know and can do is what 22% of employers explicitly expect in behavioral interviews.", source: null },
      portfolioConnection: "Sprint 1 demo is your first evidence artifact. Sprint 2 builds accountability around it."
    },
    5: {
      narrative: "You picked a skill to develop. This week is about designing how you'll PROVE you actually grew — before you start practicing.",
      connection: "Sprint 1 you identified what to work on. Sprint 2 tests whether you can hold yourself accountable to actually doing it — with your triad watching.",
      insight: "Everyone says they want to improve. Evidence Design is what separates 'I plan to get better' from 'here's my baseline, here's my method, here's how you'll see the change.'",
      employerLink: {
        text: "This builds Metacognition and Responsibility — knowing what you don't know and taking ownership of your own development. Employers rated Responsibility as 'extremely important' at nearly 60%.",
        source: null
      },
      portfolioConnection: "Your Evidence Design becomes the structure of your entire Sprint 2 demo. Without a baseline, you can't show growth."
    },
    6: {
      narrative: "Check-in week. Your triad holds you accountable — and you find out whether you've actually started practicing or just planned to.",
      connection: "Last week you designed evidence. This week is the honest moment: have you actually started, or do you just have a plan? Your triad check-in is where you find out.",
      insight: "If you haven't started practicing your skill yet, this is the week to start. Not next week. The networking event is coming and professionals will ask what you're working on — 'I have a plan' is a weaker answer than 'here's what I've tried so far.'",
      employerLink: {
        text: "Coachability — willingness to accept feedback and apply new skills — is the #2 thing employers expect from early-career hires (63.4%). Your triad check-in is where you practice receiving honest feedback.",
        source: {
          title: "Durable Skills, Strong Starts (UpSkill America / WGU, 2025)",
          url: null,
          finding: "63.7% of employers prioritize professionalism and 63.4% prioritize coachability as their top expectations for early-career talent. These aren't about technical skill — they're about how you show up."
        }
      },
      portfolioConnection: "Your Check-in response and Networking Prep feed Demo Slide 3 (evidence of growth). You need real data points, not promises."
    },
    7: {
      narrative: "Networking week. You're about to talk to professionals who do this work every day — they'll tell you things your classmates and your instructor can't.",
      connection: "You've been developing a skill based on your own understanding of it. The networking event tests that understanding against professional reality. Where's the gap?",
      insight: "Don't ask professionals if your skill matters. Ask them HOW it shows up in their work, and where your assumptions about it are wrong. Assumption-testing questions get you 10x more useful information than polite ones.",
      employerLink: {
        text: "You're practicing Communication and Initiative in a real professional context. Tech employers specifically want people who can think independently AND operate within professional norms.",
        source: null
      },
      portfolioConnection: "The Networking Report gives you Demo Slide 4 (external validation). A professional confirming or challenging your approach is stronger evidence than self-assessment."
    },
    8: {
      narrative: "Demo week. You're showing evidence that you actually grew — not just that you did assignments.",
      connection: "Everything converges: baseline → practice → triad accountability → professional validation → demonstration. Your slides tell the story of real growth with real evidence.",
      insight: "Your demo isn't about what you did — it's about what CHANGED. Slide 1 (baseline) and Slide 4 (evidence) should show a visible difference. If they don't, be honest about what you learned from that too.",
      employerLink: {
        text: "This IS a behavioral interview. You're demonstrating Growth Mindset (39.5% 'extremely important'), Self-Direction, and the ability to describe what you know and can do — which 22% of employers explicitly expect in interviews.",
        source: {
          title: "Durable Skills, Strong Starts (UpSkill America / WGU, 2025)",
          url: null,
          finding: "61% of employers believe their early-career workforce has the durable skills needed for the next 5 years. Your demo is your chance to be in that 61% — with evidence, not claims."
        }
      },
      portfolioConnection: "This IS your portfolio evidence for SDL Dimensions 1, 3, 4, and 7. Your slides become artifacts you'll reference in Sprint 4's defense."
    },
    9: {
      narrative: "New sprint, new question: where is your field going? Futures thinking starts with an honest audit of what you actually consume — not what you think you should.",
      connection: "Sprint 1 was about what you need to learn. Sprint 2 was about proving you actually did. Sprint 3 asks whether you can read the direction your field is heading — before someone tells you.",
      insight: "Most information diets are optimized for engagement, not understanding. If you can't name three sources you've read in the last month that shaped how you think about tech, your diet is noise.",
      employerLink: {
        text: "Strategic awareness — understanding industry direction and positioning yourself for it — is what separates people who react to change from people who anticipate it.",
        source: null
      },
      portfolioConnection: "Your Information Diet Audit becomes the honest baseline for your Futures Brief. What you consume shapes what you can see."
    },
    10: {
      narrative: "You've audited what you read. Now learn to see what matters in it. Signals are indicators of directional change. Noise is just news. The difference determines whether your futures claim has substance.",
      connection: "Last week you looked at your inputs. This week you practice reading them differently — asking not 'what happened?' but 'what does this mean for where things are going?'",
      insight: "A signal isn't just interesting news. It's a change that implies a direction. 'Company X launched a product' is noise. 'Three companies in different sectors all shifted to the same approach' might be a signal. The driver underneath is what makes it meaningful.",
      employerLink: {
        text: "Pattern recognition across information sources is what employers mean by Analytical Thinking — not analyzing a dataset, but connecting dots across different inputs to see what others miss.",
        source: null
      },
      portfolioConnection: "Your Signal Log entries feed directly into your Futures Brief. Weak signals produce a weak claim. Specific, sourced signals give your claim substance."
    },
    11: {
      narrative: "You've found signals. Now make a claim — specific enough to be wrong. 'AI will change things' is not a claim. 'Entry-level front-end roles will require prompt engineering fluency within 2 years' is.",
      connection: "Signals without a claim are just a reading list. This week you take a position: given what you've seen, what do you believe about the near future of your focus area? And what would prove you wrong?",
      insight: "Vague claims protect you from being wrong. Specific claims make you useful. In an interview, 'I think AI will be important' says nothing. 'I think X will happen because of Y, and here's what would change my mind' says everything.",
      employerLink: {
        text: "Making and defending specific claims under questioning is the core of technical interviews. This week's practice — drafting a claim, having a partner try to break it — is direct interview preparation.",
        source: null
      },
      portfolioConnection: "Your draft claim becomes the centerpiece of your Futures Brief. Sprint 4 builds on this claim — a vague one gives Sprint 4 nothing to work with."
    },
    12: {
      narrative: "Demo Day. Present your Futures Brief — not just your claim, but the arc of how you got there. What did you start with in Week 9? What changed your mind? What do you believe now and why?",
      connection: "The full arc: information audit → signal finding → driver identification → claim → defense. Your demo tells this story in 4-5 minutes.",
      insight: "The best demos don't just state a conclusion. They show the moments where your thinking shifted — where a signal surprised you, where a driver changed your framing, where peer challenge forced you to sharpen. That's the evidence that you can actually think about the future, not just guess.",
      employerLink: {
        text: "Presenting a well-reasoned position and responding to challenge is what employers evaluate in every senior interview. Your Futures Brief demo practices exactly this — with real content you care about.",
        source: null
      },
      portfolioConnection: "Sprint 3 demo feeds Sprint 4 directly. Your claim becomes the basis for choosing what skill to develop next. The quality of your claim determines the quality of your Sprint 4."
    },
    13: {
      narrative: "Evidence audit. Before you build a defense, take stock of what you actually have across all three sprints.",
      connection: "Sprint 3 ended with a claim about your field's future. Sprint 4 asks: can you prove you've grown across all four sprints?",
      insight: "The gap between what you claim and what you can show is the most useful data in this sprint.",
      employerLink: { text: "Portfolio construction is a skill employers evaluate directly. Can you curate evidence that tells a coherent story?", source: null },
      portfolioConnection: "This week's audit becomes the raw material for your defense."
    },
    14: {
      narrative: "Portfolio construction. Select, organize, and narrate the evidence that tells your growth story.",
      connection: "Last week you inventoried. This week you build the narrative arc.",
      insight: "A portfolio isn't a collection of assignments. It's a curated argument about who you've become.",
      employerLink: { text: "Every hiring manager asks 'tell me about yourself.' Your portfolio IS that answer, backed by evidence.", source: null },
      portfolioConnection: "The portfolio you build this week is what you defend next week."
    },
    15: {
      narrative: "Defense preparation. Practice defending your portfolio against honest challenge.",
      connection: "You've built the portfolio. Now prepare for the questions that test whether you understand your own growth.",
      insight: "The defense isn't about winning. It's about demonstrating that you know what you know and can name what you don't.",
      employerLink: { text: "Defending your work under questioning is the core skill of technical interviews, design reviews, and promotion conversations.", source: null },
      portfolioConnection: "Your defense draft becomes the final version after peer feedback."
    },
    16: {
      narrative: "Final defense. Present your growth arc across all four sprints with evidence.",
      connection: "Everything converges: self-assessment, accountable growth, futures thinking, and now proof.",
      insight: "The best defenses don't claim perfection. They show an honest arc of change with specific evidence at each turn.",
      employerLink: { text: "This IS a behavioral interview. You're proving you can reflect, adapt, and articulate your own development.", source: null },
      portfolioConnection: "This is your portfolio. The defense is the final artifact."
    }
  },

  // Week dates for determining "current week"
  // Each week runs Sunday through Saturday
  // UPDATE EACH SEMESTER
  weekDates: {
    1: { start: "2026-01-18", end: "2026-01-24", sprint: 1, title: "Orientation & Self-Assessment" },
    2: { start: "2026-01-25", end: "2026-01-31", sprint: 1, title: "Identifying Your Growth Edge" },
    3: { start: "2026-02-01", end: "2026-02-07", sprint: 1, title: "Active Learning" },
    4: { start: "2026-02-08", end: "2026-02-14", sprint: 1, title: "Demonstration & Synthesis" },
    5: { start: "2026-02-15", end: "2026-02-21", sprint: 2, title: "Accountability Setup" },
    6: { start: "2026-02-22", end: "2026-02-28", sprint: 2, title: "Evidence & Outreach" },
    7: { start: "2026-03-01", end: "2026-03-07", sprint: 2, title: "Stretch Challenge" },
    8: { start: "2026-03-08", end: "2026-03-14", sprint: 2, title: "Validated Demonstration" },
    9: { start: "2026-03-15", end: "2026-03-28", sprint: 3, title: "You Are What You Read" },
    10: { start: "2026-03-29", end: "2026-04-04", sprint: 3, title: "Finding What Matters" },
    11: { start: "2026-04-05", end: "2026-04-11", sprint: 3, title: "Making a Claim" },
    12: { start: "2026-04-12", end: "2026-04-18", sprint: 3, title: "Demo Day — Your Futures Brief" },
    13: { start: "2026-04-19", end: "2026-04-25", sprint: 4, title: "Diagnose" },
    14: { start: "2026-04-26", end: "2026-05-02", sprint: 4, title: "Close, phase 1" },
    15: { start: "2026-05-03", end: "2026-05-09", sprint: 4, title: "Defense begins" },
    16: { start: "2026-05-10", end: "2026-05-16", sprint: 4, title: "Defense continues" }
  },

  // Sprint info
  sprints: {
    1: { name: "Beyond Technical", theme: "Soft skill gap identification & development", focus: "Goal Setting, Planning", scaffolding: "High" },
    2: { name: "Accountable Growth", theme: "Deepen skill with external accountability", focus: "Ambiguity, Iteration", scaffolding: "Medium" },
    3: { name: "Transfer", theme: "Futures thinking — reading the future of your field", focus: "Evaluation, Collaboration", scaffolding: "Low" },
    4: { name: "Proving It", theme: "Portfolio defense & synthesis", focus: "All dimensions integrated", scaffolding: "Full autonomy" }
  },

  sprintSummaries: {
    1: {
      summary: "You assessed your skills honestly, identified a gap, and made a plan to address it. The key lesson: most people can name what they're bad at but very few can design a path out.",
      capabilities: "SDL dimensions 1\u20134 (Goals, Planning, Ambiguity, Metacognition) were the primary focus."
    },
    2: {
      summary: "You worked on your skill development with external accountability from your group. Networking with professionals tested whether your self-assessment matched industry reality.",
      capabilities: "SDL dimensions 5\u20136 (Iteration, Evaluation) became visible \u2014 could you adjust your plan based on what was actually working?"
    },
    3: {
      summary: "You're auditing your information diet and building the habit of reading broadly about your field. The claim you make at the end becomes the input for Sprint 4.",
      capabilities: "SDL dimensions 6\u20138 (Evaluate, Collaborate, AI Use) \u2014 can you think critically about what you consume and form defensible opinions?"
    },
    4: {
      summary: "Develop one skill to prepare for the future you identified in Sprint 3. Portfolio defense shows the full arc across all four sprints.",
      capabilities: "All 8 SDL dimensions integrated. The portfolio defense is the transfer test."
    }
  },

  weeklyQuestions: {
    1: "How do you know your self-assessment is accurate and not just what you want to believe?",
    2: "If 5 Whys on your skill gap leads to 'I need more practice,' you stopped too early. What's underneath that?",
    3: "Your sprint plan describes what you'll do. Can you explain why this sequence and not a different one?",
    4: "What changed between your Week 1 self-assessment and now \u2014 and what's your evidence?",
    5: "Your group is watching. Does that make you try harder or just perform trying harder?",
    6: "What did the networking event reveal that your self-assessment missed?",
    7: "If someone watched you this week without hearing your explanation, what would they see you actually doing?",
    8: "Your demo shows evidence of growth. Would a skeptic be convinced?",
    9: "What does your actual information diet tell you about what you've been optimizing for \u2014 understanding, or engagement?",
    10: "What did you consume this week that you wouldn't have encountered before this sprint?",
    11: "Has anything you've read or listened to actually changed something you think or do? Name it specifically.",
    12: "What do you believe differently now than you did four weeks ago \u2014 and what would you tell someone who disagrees?",
    13: "What evidence do you actually have \u2014 not what you wish you had, but what exists right now?",
    14: "If someone looked at your portfolio without your narration, what story would it tell?",
    15: "What\u2019s the weakest part of your defense \u2014 and what would you say if someone pointed it out?",
    16: "Four sprints. What changed about how you learn, not just what you learned?"
  },

  // SDL Dimensions
  sdlDimensions: {
    1: { name: "Identify Learning Goals", question: "Can you name what you need to learn?", primarySprints: "Sprint 1" },
    2: { name: "Design Learning Plan", question: "Can you create a path to learning it?", primarySprints: "Sprint 1" },
    3: { name: "Navigate Ambiguity", question: "Can you learn when requirements are unclear?", primarySprints: "Sprints 2-3" },
    4: { name: "Metacognitive Awareness", question: "Do you know what you don't know?", primarySprints: "All Sprints" },
    5: { name: "Learn Through Iteration", question: "Can you improve through failure?", primarySprints: "Sprints 2-4" },
    6: { name: "Evaluate Critically", question: "Can you judge the quality of your learning?", primarySprints: "Sprints 3-4" },
    7: { name: "Collaborate Effectively", question: "Can you learn from and with others?", primarySprints: "Sprint 3" },
    8: { name: "Leverage AI Effectively", question: "Can you use AI without offloading your thinking?", primarySprints: "All Sprints" }
  },

  // Interview skills progression
  interviewSkills: {
    1: { name: "Answer Questions Thoughtfully", description: "Behavioral interview practice: 'Tell me about a time when...'" },
    2: { name: "Ask Good Questions", description: "Informational interview skills: Probe for specifics, challenge without hostility" },
    3: { name: "Explain Technical Concepts", description: "Technical interview practice: Adapt explanations when first attempt doesn't land" },
    4: { name: "Defend Your Work", description: "Portfolio defense: Support claims with evidence, acknowledge weaknesses honestly" }
  },

  // Peer Conversation Settings
  // UPDATE EACH SEMESTER if targets change
  peerConversations: {
    totalConversationsTarget: 16,
    conversationsPerSprint: 4,
    breadthTarget: 12,        // Unique partners
    depthTarget: 4,           // Deep partnerships (3+ conversations)
    depthThreshold: 3,        // Conversations needed to count as "deep"
    formUrl: "https://forms.gle/51Qx66RkuZqyCKj17",             // Peer conversation check-in form

    // Sprint-by-sprint cumulative targets
    sprintTargets: {
      1: { conversations: 4, uniquePartners: 3, deepPartners: 0 },
      2: { conversations: 8, uniquePartners: 6, deepPartners: 1 },
      3: { conversations: 12, uniquePartners: 9, deepPartners: 2 },
      4: { conversations: 16, uniquePartners: 12, deepPartners: 4 }
    },

    // Interview skills by sprint (for display)
    skills: {
      1: { name: "Answer Questions Thoughtfully", desc: "Behavioral interview practice" },
      2: { name: "Ask Good Questions", desc: "Informational interview skills" },
      3: { name: "Explain Technical Concepts", desc: "Technical interview practice" },
      4: { name: "Defend Your Work", desc: "Portfolio defense" }
    },

    // Check-in schedule
    checkIns: {
      1: { required: true, type: "Professor", duration: "5 min" },
      2: { required: true, type: "TA", duration: "10 min" },
      3: { required: true, type: "TA", duration: "10 min" },
      4: { required: false, type: null, duration: null }
    }
  },

  // Instructor info
  instructor: {
    name: "Dr. Sathya Narayanan",
    email: "snarayanan@csumb.edu",
    slack: "@profsathya",
    officeHours: "https://bit.ly/profsathya"
  }
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get Canvas assignment URL
 * @param {string} assignmentKey - Key from assignments object
 * @returns {string} Full Canvas URL or "#" if not found
 */
function getCST349AssignmentUrl(assignmentKey) {
  const assignment = CST349_CONFIG.assignments[assignmentKey];
  if (!assignment) {
    console.warn(`Assignment not found: ${assignmentKey}`);
    return "#";
  }
  return `${CST349_CONFIG.canvasBaseUrl}/assignments/${assignment.canvasId}`;
}

/**
 * Get current week number based on today's date
 * @returns {number|null} Week number (1-16) or null if outside semester
 */
function getCST349CurrentWeek() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const [weekNum, dates] of Object.entries(CST349_CONFIG.weekDates)) {
    // Add time component to ensure local timezone parsing
    const start = new Date(dates.start + 'T00:00:00');
    const end = new Date(dates.end + 'T23:59:59.999');

    if (today >= start && today <= end) {
      return parseInt(weekNum);
    }
  }
  return null;
}

/**
 * Get current sprint based on current week
 * @returns {number|null} Sprint number (1-4) or null
 */
function getCST349CurrentSprint() {
  const week = getCST349CurrentWeek();
  if (!week) return null;
  return CST349_CONFIG.weekDates[week]?.sprint || null;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date like "Wed, Jan 22"
 */
function formatCST349Date(dateString) {
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get assignments due in a specific week
 * @param {number} weekNum - Week number
 * @returns {Array} Array of assignment objects with keys
 */
function getCST349AssignmentsDueInWeek(weekNum) {
  const weekData = CST349_CONFIG.weekDates[weekNum];
  if (!weekData) return [];

  // Add time component to ensure local timezone parsing
  const start = new Date(weekData.start + 'T00:00:00');
  const end = new Date(weekData.end + 'T23:59:59.999');

  const assignments = [];
  for (const [key, assignment] of Object.entries(CST349_CONFIG.assignments)) {
    const dueDate = new Date(assignment.dueDate + 'T12:00:00');
    if (dueDate >= start && dueDate <= end) {
      assignments.push({ key, ...assignment });
    }
  }

  return assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

/**
 * Get Loom video URL for a week
 * @param {number} weekNum - Week number
 * @returns {string|null} Loom URL or null if no recording
 */
function getCST349LoomVideo(weekNum) {
  return CST349_CONFIG.loomVideos[weekNum] || null;
}

// For testing: Override current week (set to null to use real date)
let CST349_TEST_CURRENT_WEEK = null;

function getCST349EffectiveCurrentWeek() {
  return CST349_TEST_CURRENT_WEEK !== null ? CST349_TEST_CURRENT_WEEK : getCST349CurrentWeek();
}
