// AUTO-GENERATED — Do not edit manually
// Source: config/cst395-assignments.csv
// Run: node scripts/canvas-sync.js --action=generate-config --course=cst395
//
// To update assignments: Edit the CSV file, then run the generate-config command above.
// Canvas IDs are synced via GitHub Actions workflow.

/**
 * CST395 Configuration
 * AI-Native Solution Engineering
 */

const CST395_CONFIG = {
  // Semester info
  semester: "Spring 2026",
  courseCode: "CST395-01",
  courseName: "AI-Native Solution Engineering",

  // Canvas base URL - UPDATE EACH SEMESTER
  // Find this in your Canvas URL: https://csumb.instructure.com/courses/XXXXX
  canvasBaseUrl: "https://csumb.instructure.com/courses/33084",

  // Canvas assignment URLs - UPDATE EACH SEMESTER
  // To find assignment IDs: Go to assignment in Canvas, look at URL
  // Example: /courses/12345/assignments/67890 -> canvasId: "67890"
  assignments: {
    // Sprint 1
    "s1-superagency-challenge": {
      canvasId: "564067",
      title: "S1: Superagency Challenge",
      dueDate: "2026-01-21",
      type: "assignment",
      canvasType: "assignment",
      quizType: "textbox",
      assignmentGroup: "Sprint 1: Goal Setting",
      points: 5,
      sprint: 1,
      week: 1,
      htmlFile: "assignments/s1-w1-superagency-challenge.html",
      briefing: "Pick something you've wanted to change but felt was beyond you. This choice drives the entire sprint — the more honest you are here, the more useful every assignment after this becomes."
    },
    "s1-problem-analysis": {
      canvasId: "144732",
      title: "S1: Problem Analysis (5 Whys)",
      dueDate: "2026-01-28",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Goal Setting",
      points: 5,
      sprint: 1,
      week: 2,
      htmlFile: "assignments/s1-w2-five-whys.html",
      briefing: "The first answer to 'why' is almost never the real answer. This analysis changes what you build — students who rush it build solutions to the wrong problem.",
      questions: [
        {
          "type": "essay",
          "text": "Starting Point: 'I struggle with [your challenge] because...' — Write your first answer. What happens when you try to address this challenge?",
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
          "text": "Why #4/5: What's the design opportunity you found? This should be something about your environment, system, or process you could change — not just 'try harder'.",
          "points": 1
        }
      ]
    },
    "s1-solution-architecture": {
      canvasId: "144733",
      title: "S1: Solution Architecture",
      dueDate: "2026-02-02",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 3,
      htmlFile: "assignments/s1-w3-solution-architecture.html",
      briefing: "You're turning your root cause into a design. The key question: what's the human process that needs to change, and where exactly can technology reduce friction?",
      questions: [
        {
          "type": "essay",
          "text": "Human Process: What behavior or habit needs to change for your challenge to be solved? Describe this without mentioning any technology.",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Friction Points: Where in that process do you typically fail or give up? What makes this hard?",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Tech Support: Where specifically could technology help reduce friction? Be specific about which friction points technology addresses.",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Solution Sketch: What will you actually build or create? Describe the simplest version that could test whether your approach works.",
          "points": 1
        },
        {
          "type": "essay",
          "text": "Architectural Choice: What's one key design decision you made and why? What alternatives did you consider?",
          "points": 1
        }
      ]
    },
    "s1-reflection-1": {
      canvasId: "564070",
      title: "S1: Productive Reflection #1",
      dueDate: "2026-01-24",
      type: "reflection",
      canvasType: "assignment",
      quizType: "textbox",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 1,
      htmlFile: "assignments/s1-w1-productive-reflection.html",
      briefing: "Your first reflection captures your starting assumptions. You'll look back at this in Week 4 and see how much your thinking changed — that delta is the point."
    },
    "s1-reflection-2": {
      canvasId: "144734",
      title: "S1: Productive Reflection #2",
      dueDate: "2026-01-30",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 2,
      htmlFile: "assignments/s1-w2-productive-reflection.html",
      briefing: "Handwritten reflection after the 5 Whys session. What shifted? If nothing shifted, that's worth examining too — it might mean you didn't push hard enough.",
      questions: [
        {
          "type": "file_upload",
          "text": "Upload a photo of your handwritten reflection from today's class session. Your reflection should capture your thinking about your challenge, the design opportunity you found through 5 Whys, and what your solution might look like.",
          "points": 5
        }
      ]
    },
    "s1-demo-discussion": {
      canvasId: "582111",
      title: "S1: Sprint 1 Demo Discussion",
      dueDate: "2026-02-11",
      type: "quiz",
      canvasType: "assignment",
      assignmentGroup: "Sprint 1: Demonstration",
      points: 10,
      sprint: 1,
      week: 4,
      htmlFile: "activities/sprint-1-demo.html",
      briefing: "Show the arc: problem → 5 Whys → root cause → solution → what you learned. The demo tells a story about how your thinking changed, not just what you built."
    },
    "s1-w3-design-decision": {
      canvasId: "144806",
      title: "S1: Design Decision Analysis",
      dueDate: "2026-02-07",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Check-in/Engagement",
      points: 5,
      sprint: 1,
      week: 3,
      htmlFile: "activities/design-decision-analysis.html",
      briefing: "Document one key design decision and why you made it. This becomes demo material — employers want to see how you decided, not just what you produced."
    },
    "s1-w3-dojo-depth": {
      canvasId: "144807",
      title: "S1: Dojo Depth Session",
      dueDate: "2026-02-08",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 3,
      htmlFile: "assignments/s1-w3-dojo-depth.html",
      briefing: "Take your solution through the Dojo. The AI pushes on whether your solution addresses the root cause you found or just the surface symptom you started with.",
      questions: [
        {
          "type": "file_upload",
          "text": "Upload your Dojo session JSON file. This should include your Reflector-approved answer demonstrating: (1) a design opportunity (not willpower), (2) stakeholder-informed design, (3) specific rather than generic solution, and (4) progress evidence.",
          "points": 5
        }
      ]
    },
    "s1-w3-reflection": {
      canvasId: "144808",
      title: "S1: Productive Reflection #3",
      dueDate: "2026-02-09",
      type: "quiz",
      canvasType: "quiz",
      quizType: "graded_survey",
      assignmentGroup: "Sprint 1: Productive Reflections",
      points: 5,
      sprint: 1,
      week: 3,
      htmlFile: "assignments/s1-w3-productive-reflection.html",
      briefing: "What's working, what isn't, and what you'd change. The Build Log from this week produces the deepest thinking in the dataset — give it real attention.",
      questions: [
        {
          "type": "file_upload",
          "text": "Upload a clear photo of your handwritten reflection. Make sure all text is legible. Your reflection should include: (1) draft of your demo answer for the required question, (2) your chosen optional question and draft answer, (3) what you know about yourself that a stranger would miss, and (4) what's still weak in your demo preparation.",
          "points": 5
        }
      ]
    },

    // Sprint 2
    "s2-bridge-reflection-1": {
      canvasId: "582112",
      title: "S2: Sprint 1-2 Bridge Reflection",
      dueDate: "2026-02-12",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 4,
      htmlFile: "assignments/s2-w5-bridge-reflection.html",
      briefing: "Sprint 1 was your problem. Sprint 2 is someone else's. This reflection bridges the two — what habit from Sprint 1 do you need to carry forward?"
    },
    "s2-orientation": {
      canvasId: "582113",
      title: "S2: Sprint 2 Orientation",
      dueDate: "2026-02-14",
      type: "quiz",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Goal Setting",
      points: 5,
      sprint: 2,
      week: 4,
      htmlFile: "activities/s2-orientation.html",
      briefing: "Meet your partner and begin understanding their world. The orientation frames what you're trying to do — don't skip it."
    },
    "s2-goal-setting-part1": {
      canvasId: "582114",
      title: "S2: Goal Setting Part I — Preparation",
      dueDate: "2026-02-16",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Goal Setting",
      points: 5,
      sprint: 2,
      week: 4,
      htmlFile: "assignments/s2-w5-goal-setting-part1.html",
      briefing: "What do you want to learn about solving problems for someone else? These goals shape how you approach discovery."
    },
    "s2-goal-setting-part2": {
      canvasId: "582115",
      title: "S2: Goal Setting Part II — Partner Goals",
      dueDate: "2026-02-20",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Goal Setting",
      points: 5,
      sprint: 2,
      week: 5,
      htmlFile: "assignments/s2-w5-goal-setting-part2.html",
      briefing: "Now that you've met your partner, set goals that are specific to what you've learned about their situation."
    },
    "s2-discovery-doc": {
      canvasId: "582875",
      title: "S2: Discovery Deep Dive",
      dueDate: "2026-02-20",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 10,
      sprint: 2,
      week: 5,
      htmlFile: "assignments/s2-w5-discovery-doc.html",
      briefing: "Go deeper than their first answer. What they told you and what they actually need are almost never the same thing — the Discovery Doc is where you find the gap."
    },
    "s2-assumption-audit": {
      canvasId: "582876",
      title: "S2: Assumption Audit",
      dueDate: "2026-02-22",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 6,
      htmlFile: "assignments/s2-w6-assumption-audit.html",
      briefing: "List what you think you know about your partner's problem, then mark each as confirmed, assumed, or unknown. The assumptions you don't examine are the ones that break your solution."
    },
    "s2-reflection-4": {
      canvasId: "582877",
      title: "S2: Productive Reflection #4",
      dueDate: "2026-02-24",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 6,
      htmlFile: "assignments/s2-w6-productive-reflection.html",
      briefing: "What surprised you about your partner's situation? If nothing surprised you, you may not have listened carefully enough."
    },
    "s2-prep-w6": {
      canvasId: "582878",
      title: "S2: Week 6 Preparation",
      dueDate: "2026-02-25",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 6,
      htmlFile: "assignments/s2-w6-prep.html",
      briefing: "Preparation for the narrowing session. Come ready to explain what you've learned and where your understanding is weakest."
    },
    "s2-demo-design": {
      canvasId: "582879",
      title: "S2: Demo Design",
      dueDate: "2026-02-27",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Goal Setting",
      points: 5,
      sprint: 2,
      week: 6,
      htmlFile: "assignments/s2-w6-demo-design.html",
      briefing: "Plan your demo structure. The 5-move demo tells: here's my partner, here's what I learned, here's what I built, here's where I was wrong, here's my human value."
    },
    "s2-domain-learning": {
      canvasId: "582880",
      title: "S2: Domain Learning Plan",
      dueDate: "2026-02-28",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 5,
      sprint: 2,
      week: 7,
      htmlFile: "assignments/s2-w7-domain-learning.html",
      briefing: "Research the science behind your partner's problem. The research changes your solution direction — that change is what makes the demo compelling."
    },
    "s2-prototype": {
      canvasId: "582881",
      title: "S2: Prototype v1 + Build Log",
      dueDate: "2026-03-09",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Check-in/Engagement",
      points: 20,
      sprint: 2,
      week: 7,
      htmlFile: "assignments/s2-w7-prototype.html",
      briefing: "Build v1 and document your reasoning in the Build Log. The log matters more than the prototype — it's evidence of how you think."
    },
    "s2-reflection-5": {
      canvasId: "582882",
      title: "S2: Productive Reflection #5",
      dueDate: "2026-03-06",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 7,
      htmlFile: "assignments/s2-w7-productive-reflection.html",
      briefing: "What's the gap between what you planned and what you built? That gap is your learning — name it honestly."
    },
    "s2-demo-prep": {
      canvasId: "582885",
      title: "S2: Final Prototype + Demo Prep",
      dueDate: "2026-03-08",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Demonstration",
      points: 10,
      sprint: 2,
      week: 8,
      htmlFile: "assignments/s2-w8-demo-prep.html",
      briefing: "Final prototype plus demo preparation. Your partner should have seen this and given you their honest reaction before Demo Day."
    },
    "s2-bridge-reflection-2": {
      canvasId: "582886",
      title: "S2: Sprint 2→3 Bridge Reflection",
      dueDate: "2026-03-13",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Productive Reflections",
      points: 5,
      sprint: 2,
      week: 8,
      htmlFile: "assignments/s2-w8-bridge-reflection.html",
      briefing: "Five foundational claims about this course. Connect each to your actual Sprint 1-2 work — honestly, not optimistically."
    },
    "s2-partner-eval": {
      canvasId: "582887",
      title: "S2: Peer Observation",
      dueDate: "2026-03-11",
      type: "ai-discussion",
      canvasType: "assignment",
      assignmentGroup: "Sprint 2: Demonstration",
      points: 5,
      sprint: 2,
      week: 8,
      htmlFile: "assignments/s2-w8-partner-eval.html",
      briefing: "Observe other demos through the NOTICE/INTERPRET/ASK lens. The gap between what the presenter claims and what you observe is the skill you're developing."
    },

    // Sprint 3
    "s3-claims-dojo": {
      canvasId: "584778",
      title: "S3 Prep: Claims in Practice",
      dueDate: "2026-03-14",
      type: "ai-discussion",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Goal Setting",
      points: 5,
      sprint: 3,
      week: 9,
      htmlFile: "assignments/s3-w9-claims-discussion.html"
    },
    "s3-problem-stake": {
      canvasId: "584779",
      title: "S3: Problem Stake Brief",
      dueDate: "2026-03-23",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Goal Setting",
      points: 10,
      sprint: 3,
      week: 9,
      htmlFile: "assignments/s3-w9-problem-stake.html"
    },
    "s3-reflection-6": {
      canvasId: "584780",
      title: "S3: Weekly Build Reflection #1",
      dueDate: "2026-03-21",
      type: "handwritten-reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Productive Reflections",
      points: 5,
      sprint: 3,
      week: 9,
      htmlFile: "assignments/s3-w9-reflection.html"
    },
    "s3-stake-defense": {
      canvasId: "586678",
      title: "S3: Problem Stake Defense",
      dueDate: "2026-03-24",
      type: "dojo",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 10,
      sprint: 3,
      week: 10,
      htmlFile: "assignments/s3-w10-stake-defense.html"
    },
    "s3-build-plan-v1": {
      canvasId: "586994",
      title: "S3: Build Plan v1",
      dueDate: "2026-03-27",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 10,
      sprint: 3,
      week: 10,
      htmlFile: "assignments/s3-w10-build-plan.html"
    },
    "s3-build-v1": {
      canvasId: "586995",
      title: "S3: Build v1",
      dueDate: "2026-03-27",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 10,
      sprint: 3,
      week: 10,
      htmlFile: "assignments/s3-w10-build-v1.html"
    },
    "s3-build-review": {
      canvasId: "586996",
      title: "S3: Build Review",
      dueDate: "2026-03-31",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Productive Reflections",
      points: 10,
      sprint: 3,
      week: 10,
      htmlFile: "assignments/s3-w10-build-review.html"
    },
    "s3-revised-plan": {
      canvasId: "586997",
      title: "S3: Revised Plan",
      dueDate: "2026-04-05",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 5,
      sprint: 3,
      week: 11,
      htmlFile: "assignments/s3-w11-revised-plan.html"
    },
    "s3-build-v2": {
      canvasId: "586998",
      title: "S3: Build v2",
      dueDate: "2026-04-07",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 10,
      sprint: 3,
      week: 11,
      htmlFile: "assignments/s3-w11-build-v2.html"
    },
    "s3-w11-codesign": {
      canvasId: "588227",
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
    "s3-solution-brief": {
      canvasId: "588228",
      title: "S3: Solution Brief",
      dueDate: "2026-04-14",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 3: Check-in/Engagement",
      points: 10,
      sprint: 3,
      week: 12,
      htmlFile: "assignments/s3-w12-solution-brief.html",
      briefing: "This goes to your stakeholder. Write it for them not for me. If Piranavan reads this can he understand what you built and give you useful feedback in 2 minutes?"
    },
    "s3-demo-discussion": {
      canvasId: "588229",
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
    "s4-goal-statement": {
      canvasId: "588985",
      title: "S4: Sprint 4 Goal Statement",
      dueDate: "2026-04-22",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Goal Setting",
      points: 10,
      sprint: 4,
      week: 13,
      htmlFile: "assignments/s4-w13-goal-statement.html",
      briefing: "Set your Sprint 4 direction. Whether continuing solo or pair-merging with a classmate, ground your next four weeks in what Sprint 3 actually taught you."
    },
    "s4-lookback-1-problem-selection": {
      canvasId: "588986",
      title: "S4: Look-back 1 — Problem Selection (Extra Credit)",
      dueDate: "2026-04-28",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Extra Credit: Look Back",
      points: 5,
      sprint: 4,
      week: 13,
      htmlFile: "assignments/s4-w13-lookback-1-problem-selection.html",
      briefing: "Extra credit recovery. Revisit your Sprint 1 or Sprint 2 problem/partner-need selection as a judgment call. Check-in with Prof. Sathya in class to get credit for this submission."
    },
    "s4-framework-symbiotic-thinking": {
      canvasId: "589782",
      title: "S4: Framework Track — Symbiotic Thinking",
      dueDate: "2026-04-26",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Productive Reflections",
      points: 5,
      sprint: 4,
      week: 13,
      htmlFile: "assignments/s4-w13-framework-symbiotic-thinking.html",
      briefing: "First framework activity in Sprint 4. Name what symbiotic thinking is — and find your own Sprint 1-3 evidence of when it worked and when it didn't."
    },
    "s4-w13-engagement": {
      canvasId: "590154",
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
      canvasId: "590155",
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
      canvasId: "590156",
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
      canvasId: "590157",
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
      canvasId: "590158",
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
      canvasId: "590159",
      title: "S4: Final Defense Presentation",
      dueDate: "2026-05-13",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Final Submission",
      points: 10,
      sprint: 4,
      week: 15,
      htmlFile: "assignments/s4-defense-presentation.html",
      briefing: "PDF of your defense slides (5 pts) + in-class defense presentation (5 pts). Due noon Wed May 13 — before the final class."
    },
    "s4-solution-brief": {
      canvasId: "590160",
      title: "S4: Sprint 4 Solution Brief",
      dueDate: "2026-05-20",
      type: "assignment",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Demonstration",
      points: 10,
      sprint: 4,
      week: 15,
      htmlFile: "assignments/s4-solution-brief.html",
      briefing: "Written solution brief documenting how you addressed your Sprint 4 goal. Due May 20 after finals week — extra time to finish the writing."
    },
    "s4-framework-sdl-is-ab": {
      canvasId: "",
      title: "S4: Framework Track — SDL / IS / AB Mapping",
      dueDate: "2026-05-03",
      type: "reflection",
      canvasType: "assignment",
      assignmentGroup: "Sprint 4: Productive Reflections",
      points: 5,
      sprint: 4,
      week: 14,
      htmlFile: "assignments/s4-w14-framework-sdl-is-ab.html",
      briefing: "Second framework activity. Map your own Sprint 1-3 evidence to the three capabilities: Self-Directed Learner, Integrative Solver, Adaptive Builder. Nine specific moments that become defense material."
    }
  },

  // Class recording Loom videos - ADD URLS AS AVAILABLE
  // Set to null if no recording was made for that week
  loomVideos: {
    1: null,  // Week 1 - no recording yet
    2: null,  // Week 2
    3: null,  // Week 3
    4: null,  // Week 4
    5: null,  // Week 5
    6: null,  // Week 6
    7: null,  // Week 7
    8: null,  // Week 8
    9: 'https://www.loom.com/share/b83a70e9a83d43d59d94b6e7f00f78ff',  // Week 9
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
    myUnderstandingTemplate: "https://docs.google.com/document/d/UNDERSTANDING_DOC_ID",
    syllabus: "https://docs.google.com/document/d/SYLLABUS_DOC_ID"
  },

  // Weekly homepage content (narrative zones)
  weeklyContent: {
    1: {
      narrative: "Welcome. This course is about becoming someone who can solve problems beyond your current reach — using AI as a cognitive partner.",
      connection: "Everything starts with understanding yourself as a learner and problem-solver.",
      insight: "Superagency means attempting problems you wouldn't have tried before. But the human value has to be visible — what would be worse if you just handed it to AI?",
      employerLink: { text: "You're building Self-Directed Learning — the capacity that keeps you relevant after technical skills change.", source: null },
      portfolioConnection: "Sprint 1 establishes your baseline. Every sprint builds on this foundation."
    },
    2: {
      narrative: "Understanding before building. Use 5 Whys to go beneath the surface of your problem.",
      connection: "Last week you identified a problem. This week you figure out if it's the REAL problem.",
      insight: "The first answer to 'why' is almost never the real answer. Keep pushing.",
      employerLink: { text: "Root cause analysis is what employers mean by 'Analytical Thinking' — the #2 skill in tech/professional services.", source: null },
      portfolioConnection: "Your 5 Whys analysis becomes evidence of how you think, not just what you built."
    },
    3: {
      narrative: "Build week. Turn your understanding into a solution — and document why you made the choices you did.",
      connection: "You analyzed the problem. Now solve it. The solution architecture is your plan; the build is your execution.",
      insight: "The solution matters less than your reasoning. Employers want to see HOW you decided, not just what you produced.",
      employerLink: { text: "Creative Problem Solving + Initiative — approaching problems with new perspectives and making decisions without direction.", source: null },
      portfolioConnection: "Your build + rationale become the core of your Sprint 1 demo."
    },
    4: {
      narrative: "Reflection and demo. Show what you built, why it matters, and what you'd do differently.",
      connection: "The full arc: problem → analysis → solution → reflection. Your demo tells this story.",
      insight: "Reflection isn't about what went well. It's about what you LEARNED — especially from what didn't work.",
      employerLink: { text: "Demonstrating your process to others builds Communication and Teamwork skills — the top 2 skills employers rate as 'extremely important.'", source: null },
      portfolioConnection: "Sprint 1 demo is your first portfolio artifact. It establishes the baseline Sprint 2 builds on."
    },
    5: {
      narrative: "You met your partner. This week is about going deeper than their first answer — discovering the problem underneath the problem.",
      connection: "Sprint 1 you solved your own problem. Sprint 2 tests whether you can understand someone else's — that's a fundamentally different skill.",
      insight: "Your partner told you their problem. But what they said and what they actually need are almost never the same thing. The Discovery Deep Dive is where you find the gap.",
      employerLink: {
        text: "This builds what employers call Analytical Thinking and Active Listening — understanding someone's actual needs, not just their stated request.",
        source: null
      },
      portfolioConnection: "Your Discovery Doc becomes Slide 1 of your demo: 'Here's what I learned that they didn't tell me directly.'"
    },
    6: {
      narrative: "You've done the discovery. Now pressure-test what you think you know — before you build something based on wrong assumptions.",
      connection: "Last week you listened. This week you challenge your own understanding. The Assumption Audit and Week 6 Prep are about finding where you're wrong BEFORE your partner tells you.",
      insight: "If your assumptions feel safe and comfortable, you're not being honest enough. The best solutions come from finding and fixing wrong assumptions early, not from protecting them.",
      employerLink: {
        text: "This is Critical Thinking in action — what 45% of employers rate as 'extremely important.' Not analyzing data in a textbook, but testing your own beliefs against evidence.",
        source: {
          title: "Durable Skills, Strong Starts (UpSkill America / WGU, 2025)",
          url: null,
          finding: "Across 550+ employers, skills associated with being ready to execute on day one — including critical thinking and attention to detail — were the most highly valued."
        }
      },
      portfolioConnection: "Your Assumption Audit feeds directly into Demo Slide 3: 'Here's where I was wrong and what I changed.' Employers want to see you caught your own mistakes."
    },
    7: {
      narrative: "Build week. You're turning understanding into something real — and documenting the decisions that matter, not just the output.",
      connection: "You discovered the problem (Week 5), tested your assumptions (Week 6). Now build something and get your partner's honest reaction to it.",
      insight: "The prototype matters less than the Build Log. Anyone can build something. The question is: can you explain WHY you built it this way and what would be worse if you'd just handed the problem to AI?",
      employerLink: {
        text: "This develops Creative Problem Solving and Initiative — approaching problems with new perspectives and making decisions without waiting for direction. Tech employers especially value this combination.",
        source: null
      },
      portfolioConnection: "The Build Log + Partner Feedback become Demo Slide 2 ('key decisions I made') and Slide 3 ('what I changed after feedback'). Your Design Rationale ties it all together."
    },
    8: {
      narrative: "Demo week. You're not presenting a project — you're proving you understood someone deeply enough to build something they couldn't have asked for.",
      connection: "Everything converges: discovery → assumptions → building → feedback → iteration. Your demo tells that story in 5 minutes.",
      insight: "The best demos don't show everything. They show the moments where YOUR judgment mattered — where a human made the difference that AI couldn't.",
      employerLink: {
        text: "Demo day is a behavioral interview in disguise. You're demonstrating Teamwork/Collaboration (55% 'extremely important'), Communication (52%), and Ethical Behavior (56%) — the top-rated skills across 550+ employers.",
        source: {
          title: "Durable Skills, Strong Starts (UpSkill America / WGU, 2025)",
          url: null,
          finding: "85% of employers say durable skills are developed through experience, not formal instruction. Your Sprint 2 demo IS that experience — and the evidence that you have these skills."
        }
      },
      portfolioConnection: "This IS your portfolio piece. Sprint 2's demo answers: 'Can I solve a real problem for a real person and prove the value of my judgment?'"
    },
    9: {
      narrative: "New domain, new stakes. You're entering a problem space you don't own — the Bhutan MDRO guideline. Your job is to find one specific human moment where the guideline fails the person who needs it.",
      connection: "Sprint 1 was your problem. Sprint 2 was your partner's. Sprint 3 is a stranger's — in a clinical domain you have to learn. The distance is the point.",
      insight: "Vague problems produce vague solutions. 'Making the guideline more accessible' is not a stake. 'A ward nurse needs to know X in 4 minutes between handoffs' is.",
      employerLink: {
        text: "Entering unfamiliar domains and quickly identifying actionable problems is what employers mean by Analytical Thinking and Initiative — the ability to make progress without someone telling you where to start.",
        source: null
      },
      portfolioConnection: "Your Problem Stake Brief is the foundation of your Sprint 3 demo. The specificity of your stake determines the quality of everything that follows."
    },
    10: {
      narrative: "Your stake is a first draft. This week you defend it — first against AI, then against a classmate, then against the expert. Each round sharpens what you actually know vs. what you're guessing.",
      sessionDescription: "Piranavan Selvanandan joined class for Session 1. The session ran in four phases: (1) Dojo catch-up for students who hadn't completed the Problem Stake Defense (~20 min), (2) Question Workshop in pairs — Student A presents their stake, Student B writes 2-3 probing questions, then swap (~20 min, observed by Prof. Sathya and Jeremy), (3) Peer Interview + Expert Access running in parallel — students ran full interviews with sharpened questions while rotating through 1-on-1 sessions with Piranavan on Zoom (~5 min each, covering clinical workflow, tech infrastructure in Bhutan, deployment realism), and (4) students began drafting Build Plan v1. No slides — the session was a live working conversation with the stakeholder.",
      connection: "Last week you staked a claim. This week Piranavan tells you what you got wrong about the clinical reality. The gap between your assumption and his correction is where the real design work lives.",
      insight: "If you have no questions for the expert, you haven't thought hard enough about what you don't know. The best stakes come from students who can name their assumptions precisely enough to test them.",
      employerLink: {
        text: "This builds what employers call Critical Thinking and Collaboration — testing your ideas against expert knowledge and adjusting, not defending a position that's already been disproven.",
        source: null
      },
      portfolioConnection: "Your demo will show the delta: what your stake looked like before expert feedback vs. after. That arc — not the final product — is what demonstrates growth."
    },
    11: {
      narrative: "Build week. You've sharpened the problem. Now design the human process first, then touch the computer. Piranavan joins for a second session — this time you demo what you've built.",
      connection: "Week 9 you found the moment. Week 10 you pressure-tested it. Now build something simple enough to test and specific enough to fail in useful ways.",
      insight: "Simplicity is a design decision, not a shortcut. If your solution requires the nurse to learn a new system during a 4-minute handoff, you've designed for yourself, not for her.",
      employerLink: {
        text: "MVP discipline — building the smallest thing that tests your core assumption — is Creative Problem Solving in its most practical form. Employers value people who ship, not people who plan.",
        source: null
      },
      portfolioConnection: "Build v2 shows iteration: what changed from v1, why, and what evidence drove the change. This is the core of your demo arc."
    },
    12: {
      narrative: "Demo Day. Show the arc — where you started in Week 9, what changed your thinking, what exists now, and one known limitation.",
      connection: "The demo isn't a product presentation. It's proof that you can enter an unfamiliar domain, find a specific human moment, and build something that addresses it — while being honest about what you still don't know.",
      insight: "Delta matters more than final state. A student who started with 'make the guideline accessible' and ended with a specific nurse-facing decision tool has a better demo than someone whose polished product never changed from Week 9.",
      employerLink: {
        text: "This is the full stack of professional skills: domain learning, stakeholder engagement, iterative building, and honest self-assessment. Sprint 3's demo answers: 'Can I solve a problem in a domain I had to learn?'",
        source: null
      },
      portfolioConnection: "Sprint 3 demo is your strongest portfolio piece yet — it shows you can operate in ambiguity with real stakes and real constraints."
    },
    13: {
      narrative: "Full autonomy. You find the stakeholder, define the problem, and set the constraints. Nobody hands you the domain.",
      connection: "Sprint 3 gave you a domain, an expert, and a document. Sprint 4 gives you nothing. The question: can you do this without scaffolding?",
      insight: "The hardest part isn't building. It's choosing what to build and for whom \u2014 without someone telling you where to start.",
      employerLink: { text: "Autonomous problem definition is what separates senior from junior. This sprint tests whether you can create the conditions for your own work.", source: null },
      portfolioConnection: "Your stakeholder choice and problem definition become the foundation of your Sprint 4 portfolio piece."
    },
    14: {
      narrative: "Independent execution. You're building without checkpoints. The process you learned in Sprints 1\u20133 is now yours to apply.",
      connection: "Last week you defined the problem. This week you execute on it \u2014 using every method you've practiced, but without someone structuring it for you.",
      insight: "If your process this week looks identical to Sprint 1, you haven't grown. If it looks nothing like it, you may have abandoned what worked.",
      employerLink: { text: "Independent execution with good judgment is the defining trait of people who get promoted.", source: null },
      portfolioConnection: "Document your process decisions. The 'why I did it this way' matters more than the output."
    },
    15: {
      narrative: "Integration and refinement. Connect your Sprint 4 work to the full semester arc.",
      connection: "You've built something independently. Now step back: what does this sprint prove about what you can do that you couldn't before?",
      insight: "The portfolio defense isn't about Sprint 4 alone. It's about the arc from Sprint 1 to now.",
      employerLink: { text: "The ability to synthesize across experiences and articulate your growth trajectory is what makes a portfolio defense compelling.", source: null },
      portfolioConnection: "This week's reflection becomes the narrative thread of your final defense."
    },
    16: {
      narrative: "Demonstration and reflection. Present the full arc: what you attempted, what changed, and what you can do now that you couldn't before.",
      connection: "Everything converges. Four sprints, four stakeholders, one story about becoming someone who can solve problems beyond their reach.",
      insight: "The best demos don't showcase perfection. They show honest growth with evidence at every turn.",
      employerLink: { text: "This IS your portfolio. The defense answers the question every employer asks: 'What can you do, and how do you know?'", source: null },
      portfolioConnection: "This is the capstone. Your defense is the final artifact."
    }
  },

  // Week dates for determining "current week"
  // Each week runs Sunday through Saturday
  // UPDATE EACH SEMESTER
  weekDates: {
    1: { start: "2026-01-18", end: "2026-01-24", sprint: 1, title: "Orientation & Problem Discovery" },
    2: { start: "2026-01-25", end: "2026-01-31", sprint: 1, title: "Understanding Before Building" },
    3: { start: "2026-02-01", end: "2026-02-07", sprint: 1, title: "Strategic Building" },
    4: { start: "2026-02-08", end: "2026-02-14", sprint: 1, title: "Reflection & Human Value" },
    5: { start: "2026-02-15", end: "2026-02-21", sprint: 2, title: "Partner Discovery" },
    6: { start: "2026-02-22", end: "2026-02-28", sprint: 2, title: "Discovery & Domain Learning" },
    7: { start: "2026-03-01", end: "2026-03-07", sprint: 2, title: "Building & Iteration" },
    8: { start: "2026-03-08", end: "2026-03-14", sprint: 2, title: "Value Through Another's Eyes" },
    9: { start: "2026-03-15", end: "2026-03-21", sprint: 3, title: "Entering Unfamiliar Territory" },
    10: { start: "2026-03-22", end: "2026-03-28", sprint: 3, title: "Stakeholder Discovery Without Access" },
    11: { start: "2026-04-05", end: "2026-04-11", sprint: 3, title: "Simple Over Sophisticated" },
    12: { start: "2026-04-12", end: "2026-04-18", sprint: 3, title: "Value at the Intersection" },
    13: { start: "2026-04-19", end: "2026-04-25", sprint: 4, title: "Goal-set + Foundation" },
    14: { start: "2026-04-26", end: "2026-05-02", sprint: 4, title: "Build + SDL" },
    15: { start: "2026-05-03", end: "2026-05-09", sprint: 4, title: "Iterate + Capabilities" },
    16: { start: "2026-05-10", end: "2026-05-16", sprint: 4, title: "Defend" }
  },

  // Sprint info
  sprints: {
    1: { name: "Foundation", theme: "Superagency Over Self", stakeholder: "Yourself", scaffolding: "High" },
    2: { name: "Mirror", theme: "Learning Through Others", stakeholder: "Close acquaintance", scaffolding: "Medium-High" },
    3: { name: "Complexity", theme: "Navigating Ambiguity", stakeholder: "External entity", scaffolding: "Medium" },
    4: { name: "Mastery", theme: "Full Autonomy", stakeholder: "Your choice", scaffolding: "Low" }
  },

  sprintSummaries: {
    1: {
      summary: "You identified a personal challenge, used 5 Whys to find the root cause, and built a solution. The key lesson: the first answer to 'why' is almost never the real problem \u2014 and your solution changes fundamentally when you find the actual root.",
      capabilities: "SDL emerged as the primary capability \u2014 you learned to direct your own problem-solving rather than waiting for instructions."
    },
    2: {
      summary: "You solved a real problem for your partner \u2014 someone whose world you had to learn before you could build anything useful. Discovery, assumption-testing, and iteration replaced guessing.",
      capabilities: "Integrative Solver became visible \u2014 you combined domain knowledge, partner insight, and your own judgment to build something your partner couldn't have specified themselves."
    },
    3: {
      summary: "Bhutan's MDRO clinical guideline \u2014 28 pages that exist but can't be acted on in the moments that matter. You're finding one specific human moment where it fails and designing a solution.",
      capabilities: "All three capabilities converge: SDL (learning an unfamiliar domain), IS (integrating clinical reality with design), AB (iterating based on expert feedback)."
    },
    4: {
      summary: "No curated options. You find the stakeholder, define the problem, and build the solution from scratch. Everything from Sprints 1\u20133 applies \u2014 but nobody sets it up for you.",
      capabilities: "This is the transfer test. Can you do this without scaffolding?"
    }
  },

  weeklyQuestions: {
    1: "What's something you've wanted to change but convinced yourself was 'just the way it is'?",
    2: "If your first answer to 'why' was right, why haven't you solved this already?",
    3: "What would be worse about your solution if you'd handed the whole thing to AI?",
    4: "What changed between Week 1 and now \u2014 and can you prove it?",
    5: "What did your partner tell you that you didn't already expect?",
    6: "Which of your assumptions about your partner's problem would be most dangerous if wrong?",
    7: "If your partner used this without you there to explain it, would it actually help?",
    8: "What would be worse about your demo if AI had done it alone?",
    9: "If you can't describe your user's specific moment in one sentence, you don't have a stake \u2014 you have a topic.",
    10: "If you have no questions for the expert, you haven't thought hard enough about what you don't know.",
    11: "What changed between your plan and your build \u2014 and what does that gap teach you about how you think?",
    12: "What would be worse about your solution if you'd just handed this problem to AI on day one?",
    13: "You chose the stakeholder, defined the problem, and set the constraints. What makes this harder than Sprint 3?",
    14: "If your solution works but you can't explain why your judgment mattered, what have you actually demonstrated?",
    15: "What would break about your solution if someone else tried to use your process without you?",
    16: "Four sprints. What can you attempt now that you couldn't before \u2014 and what's your evidence?"
  },

  // Peer Conversation Settings
  // UPDATE EACH SEMESTER if targets change
  peerConversations: {
    totalConversationsTarget: 16,
    conversationsPerSprint: 4,
    breadthTarget: 9,         // Unique partners (50% of 18-person class)
    depthTarget: 3,           // Deep partnerships (3+ conversations)
    depthThreshold: 3,        // Conversations needed to count as "deep"
    formUrl: "https://forms.gle/Jx2hAnGsxvwRzaZq8",             // Peer conversation check-in form

    // Sprint-by-sprint cumulative targets
    sprintTargets: {
      1: { conversations: 4, uniquePartners: 3, deepPartners: 0 },
      2: { conversations: 8, uniquePartners: 5, deepPartners: 1 },
      3: { conversations: 12, uniquePartners: 7, deepPartners: 2 },
      4: { conversations: 16, uniquePartners: 9, deepPartners: 3 }
    },

    // Professional skills by sprint (for display)
    skills: {
      1: { name: "How to Understand", desc: "Get into someone's perspective, listen before reacting" },
      2: { name: "How to Challenge", desc: "Give direct feedback, receive challenge without defensiveness" },
      3: { name: "How to be a Thought Partner", desc: "Help someone think through a problem" },
      4: { name: "How to Hold Accountable", desc: "Push on quality, mutual ownership of outcomes" }
    },

    // Check-in schedule (CST395: only Sprint 1 required)
    checkIns: {
      1: { required: true, type: "Professor", duration: "5 min" },
      2: { required: false, type: "Optional", duration: null },
      3: { required: false, type: "Optional", duration: null },
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
function getAssignmentUrl(assignmentKey) {
  const assignment = CST395_CONFIG.assignments[assignmentKey];
  if (!assignment) {
    console.warn(`Assignment not found: ${assignmentKey}`);
    return "#";
  }
  return `${CST395_CONFIG.canvasBaseUrl}/assignments/${assignment.canvasId}`;
}

/**
 * Get current week number based on today's date
 * @returns {number|null} Week number (1-16) or null if outside semester
 */
function getCurrentWeek() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  for (const [weekNum, dates] of Object.entries(CST395_CONFIG.weekDates)) {
    // Add time component to ensure local timezone parsing
    const start = new Date(dates.start + 'T00:00:00');
    const end = new Date(dates.end + 'T23:59:59.999');

    if (today >= start && today <= end) {
      return parseInt(weekNum);
    }
  }
  return null; // Outside semester
}

/**
 * Get current sprint based on current week
 * @returns {number|null} Sprint number (1-4) or null
 */
function getCurrentSprint() {
  const week = getCurrentWeek();
  if (!week) return null;
  return CST395_CONFIG.weekDates[week]?.sprint || null;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date like "Wed, Jan 22"
 */
function formatDate(dateString) {
  const date = new Date(dateString + 'T12:00:00'); // Noon to avoid timezone issues
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
function getAssignmentsDueInWeek(weekNum) {
  const weekData = CST395_CONFIG.weekDates[weekNum];
  if (!weekData) return [];

  // Add time component to ensure local timezone parsing
  const start = new Date(weekData.start + 'T00:00:00');
  const end = new Date(weekData.end + 'T23:59:59.999');

  const assignments = [];
  for (const [key, assignment] of Object.entries(CST395_CONFIG.assignments)) {
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
function getLoomVideo(weekNum) {
  return CST395_CONFIG.loomVideos[weekNum] || null;
}

// For testing: Override current week (set to null to use real date)
let TEST_CURRENT_WEEK = null; // Set to null to use real date-based calculation

function getEffectiveCurrentWeek() {
  return TEST_CURRENT_WEEK !== null ? TEST_CURRENT_WEEK : getCurrentWeek();
}
