import type { CourseLevel, LessonType } from "@/types";
import type { CurriculumLesson, CurriculumLevel, VerbalyxCurriculum } from "@/lib/curriculum/types";

interface LessonSeed {
  title: string;
  pattern: string;
  outcome: string;
  scenario: string;
  exampleContext: string;
  challenge: string;
  mistake: [wrong: string, correct: string, why: string];
  drill: string;
  type?: LessonType;
}

const methodology = [
  "80% speaking practice and 20% simple theory.",
  "Teach repeatable sentence patterns instead of textbook grammar rules.",
  "Use Indian real-life contexts: college, office, family, travel, interviews, calls, shops, and meetings.",
  "Every lesson ends with a recorded speaking task, AI conversation, and daily confidence challenge.",
  "Mistakes are corrected immediately using: what you said, mistake, correct version, why, try again."
];

const beginnerSeeds: LessonSeed[] = [
  {
    title: "Start Speaking Without Fear",
    pattern: "I am + name / I am from + place / I want to + goal",
    outcome: "speak a simple self-introduction without freezing",
    scenario: "meeting a new classmate or colleague",
    exampleContext: "Hi, I am Kishore. I am from Chennai. I want to improve my English for my career.",
    challenge: "Record your introduction 3 times and make the third version slower and clearer.",
    mistake: ["Myself Kishore", "I am Kishore / My name is Kishore", "English introductions sound more natural with 'I am' or 'My name is'."],
    drill: "Repeat: name, native, need, new, now. Keep the tongue light for /n/."
  },
  {
    title: "Talk About Your Daily Routine",
    pattern: "I usually + action / I go to + place / I come back at + time",
    outcome: "describe your day in 6 clear sentences",
    scenario: "telling a friend how your weekday goes",
    exampleContext: "I usually wake up at 6:30. I go to office by bus. I come back at 7.",
    challenge: "Tell your full day from morning to night using 8 sentences.",
    mistake: ["I am go to office", "I go to office / I am going to office now", "Use 'I go' for routine and 'I am going' for right now."],
    drill: "Repeat: wake, work, walk, week. Do not add a vowel before /w/."
  },
  {
    title: "Ask Simple Questions Confidently",
    pattern: "Can you + action? / Where is + place? / What time is + event?",
    outcome: "ask for help without translating from your mother tongue",
    scenario: "asking a security guard, shopkeeper, or office receptionist",
    exampleContext: "Can you help me? Where is the billing counter? What time is the meeting?",
    challenge: "Ask 5 real questions aloud using polite voice and eye contact.",
    mistake: ["Where you are going?", "Where are you going?", "In questions, put 'are/is/do' before the person."],
    drill: "Repeat: can, counter, call, coffee. Keep /k/ crisp."
  },
  {
    title: "Speak About Likes And Dislikes",
    pattern: "I like + noun/verb-ing / I don't like + noun/verb-ing / I prefer + option",
    outcome: "share preferences in natural English",
    scenario: "discussing food, movies, classes, or work style",
    exampleContext: "I like filter coffee. I don't like waiting in long queues. I prefer morning classes.",
    challenge: "Say 5 likes and 5 dislikes without stopping.",
    mistake: ["I like to cricket", "I like cricket / I like playing cricket", "Use a noun or verb-ing after 'like'."],
    drill: "Repeat: like, light, local, lunch. Open the mouth for /l/."
  },
  {
    title: "Make Small Talk",
    pattern: "How was + event? / It was + feeling / Did you + action?",
    outcome: "start short friendly conversations",
    scenario: "talking to a neighbour, coworker, or classmate",
    exampleContext: "How was your weekend? It was relaxing. Did you watch the match?",
    challenge: "Have a 2-minute small-talk conversation with the AI tutor.",
    mistake: ["What about your weekend was?", "How was your weekend?", "Use fixed small-talk patterns instead of word-by-word translation."],
    drill: "Repeat: was, weekend, weather, watch. Keep /v/ and /w/ different."
  },
  {
    title: "Describe People Politely",
    pattern: "He/She is + quality / He/She has + feature / They are good at + skill",
    outcome: "describe people without sounding rude",
    scenario: "introducing a friend or teammate",
    exampleContext: "She is patient. She has strong communication skills. She is good at explaining ideas.",
    challenge: "Describe 3 people in your life with 4 positive sentences each.",
    mistake: ["He have good knowledge", "He has good knowledge", "Use 'has' with he/she/it."],
    drill: "Repeat: she, skill, strong, smart. Smile slightly for clear /s/."
  },
  {
    title: "Describe Places Around You",
    pattern: "There is + one thing / There are + many things / It is near + place",
    outcome: "describe your home, street, college, or office",
    scenario: "guiding a visitor around your area",
    exampleContext: "There is a tea shop near my office. There are two ATMs on this road.",
    challenge: "Describe your street for 90 seconds.",
    mistake: ["There is many people", "There are many people", "Use 'are' for many things."],
    drill: "Repeat: there, this, that, those. Keep the tongue between teeth gently for /th/."
  },
  {
    title: "Talk About Family",
    pattern: "I live with + people / My father works as + job / We usually + action",
    outcome: "speak naturally about family background",
    scenario: "intro conversation in class, hostel, or workplace",
    exampleContext: "I live with my parents. My mother runs a small business. We usually eat dinner together.",
    challenge: "Record a warm 1-minute family introduction.",
    mistake: ["My father is doing job", "My father works as an engineer", "Use 'works as' to talk about someone's job."],
    drill: "Repeat: father, mother, brother, together. Do not over-stress every syllable."
  },
  {
    title: "Order Food In English",
    pattern: "I would like + item / Can I get + item? / Please make it + preference",
    outcome: "order food politely at a cafe or restaurant",
    scenario: "ordering at a dosa shop, cafe, or food court",
    exampleContext: "I would like one masala dosa. Can I get extra chutney? Please make it less spicy.",
    challenge: "Role-play ordering food and asking one follow-up question.",
    mistake: ["Give me one coffee", "Can I get one coffee, please?", "Polite ordering sounds better with 'Can I get' or 'I would like'."],
    drill: "Repeat: please, spicy, rice, dosa. Keep final sounds clear."
  },
  {
    title: "Ask For Directions",
    pattern: "How do I get to + place? / Go straight / Turn left/right",
    outcome: "ask and understand simple directions",
    scenario: "finding a metro station, office block, or classroom",
    exampleContext: "How do I get to the metro station? Go straight and turn left after the signal.",
    challenge: "Explain the route from your home to the nearest bus stop.",
    mistake: ["How to go railway station?", "How do I get to the railway station?", "Use a full question pattern for clarity."],
    drill: "Repeat: straight, street, station, signal. Avoid adding extra vowel before /st/."
  },
  {
    title: "Talk On The Phone",
    pattern: "May I speak to + person? / Could you repeat that? / I will call back",
    outcome: "handle basic phone calls clearly",
    scenario: "calling an office, delivery person, or customer support",
    exampleContext: "May I speak to Mr Kumar? Could you repeat that number? I will call back in 10 minutes.",
    challenge: "Practice a 90-second phone call without using hand gestures.",
    mistake: ["Tell again", "Could you repeat that, please?", "Phone English needs extra politeness and clarity."],
    drill: "Repeat: call, could, clear, customer. Keep pace slow on calls."
  },
  {
    title: "Explain A Problem",
    pattern: "I have a problem with + thing / It is not working / I need help with + issue",
    outcome: "explain simple problems without panic",
    scenario: "reporting a phone, internet, bank, or app issue",
    exampleContext: "I have a problem with my internet. It is not working since morning. I need help with the connection.",
    challenge: "Explain one real problem in 5 sentences.",
    mistake: ["My internet not working", "My internet is not working", "Add 'is' before not working."],
    drill: "Repeat: problem, payment, password, pending. Pop /p/ gently."
  },
  {
    title: "Say Past Events Simply",
    pattern: "Yesterday I + past action / Last week I + past action / I went to + place",
    outcome: "talk about yesterday and last week",
    scenario: "telling a friend what happened",
    exampleContext: "Yesterday I visited my cousin. Last week I attended an interview. I went to Bangalore.",
    challenge: "Tell yesterday's story in 8 sentences.",
    mistake: ["Yesterday I go to market", "Yesterday I went to the market", "Use past action words after yesterday/last week."],
    drill: "Repeat: went, sent, spent, attended. Keep /t/ endings light but audible."
  },
  {
    title: "Say Future Plans",
    pattern: "I am going to + action / I will + action / My plan is to + action",
    outcome: "speak about plans and intentions",
    scenario: "planning weekend, studies, or career steps",
    exampleContext: "I am going to finish my course. I will practice daily. My plan is to apply for better jobs.",
    challenge: "Share 3 plans for this week and 3 plans for this year.",
    mistake: ["I will going", "I will go / I am going to go", "Do not mix 'will' and 'going'."],
    drill: "Repeat: will, year, career, clear. Keep /y/ soft."
  },
  {
    title: "Give Your Opinion",
    pattern: "I think + idea / In my opinion + idea / I feel + reason",
    outcome: "share opinions politely",
    scenario: "discussing movies, work-from-home, exams, or traffic",
    exampleContext: "I think work from home saves time. In my opinion, traffic is the biggest issue in the city.",
    challenge: "Give opinions on 5 everyday topics with one reason each.",
    mistake: ["According to me", "In my opinion / I think", "'According to me' sounds unnatural in many spoken situations."],
    drill: "Repeat: think, thing, opinion, reason. Practice /th/ slowly."
  },
  {
    title: "Give Reasons With Because",
    pattern: "I like it because + reason / I chose this because + reason",
    outcome: "extend short answers with reasons",
    scenario: "explaining choices in class, shop, or office",
    exampleContext: "I chose this phone because the camera is good. I like this restaurant because the service is fast.",
    challenge: "Answer 10 questions using 'because'.",
    mistake: ["Because price is less, I bought", "I bought it because the price was low", "Spoken English is clearer when reason comes after the main idea."],
    drill: "Repeat: because, cause, choice, choose. Keep /z/ sound in because."
  },
  {
    title: "Compare Two Things",
    pattern: "A is better than B for + reason / I prefer A because + reason",
    outcome: "compare options confidently",
    scenario: "choosing phone, course, city, college, or job",
    exampleContext: "Online classes are better for revision. Offline classes are better for discipline.",
    challenge: "Compare two phones, two cities, and two foods.",
    mistake: ["This is more better", "This is better", "Do not use 'more' before 'better'."],
    drill: "Repeat: better, butter, battery, Bengaluru. Use a soft Indian-neutral /t/."
  },
  {
    title: "Speak In Longer Sentences",
    pattern: "Idea + because + reason + example",
    outcome: "stop giving one-word answers",
    scenario: "answering teacher, manager, or interviewer questions",
    exampleContext: "I prefer morning study because my mind is fresh. For example, I remember vocabulary faster.",
    challenge: "Turn 5 short answers into 3-part answers.",
    mistake: ["Yes good", "Yes, it is good because it saves time", "A complete answer sounds more confident."],
    drill: "Repeat: example, explain, extra, exactly. Do not say 'egg-jample'."
  },
  {
    title: "Tell A Simple Story",
    pattern: "First + action / Then + action / Finally + result",
    outcome: "tell a small incident in sequence",
    scenario: "sharing a travel, shopping, or college incident",
    exampleContext: "First, I booked the ticket. Then, I reached the station late. Finally, I caught the train.",
    challenge: "Tell a 1-minute story using first, then, finally.",
    mistake: ["Then after I went", "Then I went / After that I went", "Use one connector at a time."],
    drill: "Repeat: first, finally, found, friend. Avoid adding vowel before /fr/."
  },
  {
    title: "Handle Basic Customer Support",
    pattern: "I ordered + item / I received + issue / Please help me with + request",
    outcome: "raise a support issue calmly",
    scenario: "calling Swiggy, Amazon, bank, or telecom support",
    exampleContext: "I ordered a charger yesterday. I received the wrong item. Please help me with a replacement.",
    challenge: "Role-play one complaint and one polite request.",
    mistake: ["I didn't got", "I didn't get", "After didn't, use base action: get, go, receive."],
    drill: "Repeat: received, replacement, request, wrong. Keep /r/ clear but not rolled."
  },
  {
    title: "Speak About Money And Prices",
    pattern: "It costs + amount / The price is + amount / Is there any discount?",
    outcome: "talk about price, budget, and payment",
    scenario: "shopping, bargaining, or discussing subscription fees",
    exampleContext: "It costs 500 rupees. The price is a little high. Is there any discount?",
    challenge: "Ask about price and negotiate politely in 5 lines.",
    mistake: ["How much rate?", "What is the price? / How much does it cost?", "Use natural price questions."],
    drill: "Repeat: price, prize, pay, UPI. Separate price and prize."
  },
  {
    title: "Apologize And Respond",
    pattern: "I am sorry for + issue / That's okay / I will fix it",
    outcome: "handle small mistakes politely",
    scenario: "late submission, missed call, or small office mistake",
    exampleContext: "I am sorry for the delay. That's okay. I will fix it by evening.",
    challenge: "Practice 3 apology situations without over-explaining.",
    mistake: ["Sorry for late", "Sorry for the delay / Sorry I am late", "Use a full phrase after sorry."],
    drill: "Repeat: sorry, delay, mistake, fix. Keep tone sincere, not weak."
  },
  {
    title: "Invite Someone",
    pattern: "Would you like to + action? / Are you free on + day? / Let's + action",
    outcome: "invite friends or colleagues naturally",
    scenario: "asking someone for tea, lunch, event, or study session",
    exampleContext: "Would you like to join us for lunch? Are you free on Saturday? Let's meet at 5.",
    challenge: "Make 5 invitations: casual, polite, office, family, and event.",
    mistake: ["You come lunch?", "Would you like to come for lunch?", "Invitations need a polite question pattern."],
    drill: "Repeat: would, you, join, lunch. Link 'would you' smoothly."
  },
  {
    title: "Accept And Refuse Politely",
    pattern: "Sure, I would love to / Sorry, I can't because + reason / Maybe next time",
    outcome: "say yes/no without sounding rude",
    scenario: "responding to invitations and requests",
    exampleContext: "Sure, I would love to. Sorry, I can't today because I have work. Maybe next time.",
    challenge: "Refuse 5 requests politely with a short reason.",
    mistake: ["No, I am busy", "Sorry, I can't today because I am busy", "A soft refusal protects relationships."],
    drill: "Repeat: sure, sorry, reason, busy. Keep voice warm."
  },
  {
    title: "Speak At A Clinic Or Pharmacy",
    pattern: "I have + symptom / Since + time / Do I need + medicine?",
    outcome: "explain basic health issues",
    scenario: "visiting a clinic or buying medicine",
    exampleContext: "I have a headache since morning. Do I need this medicine after food?",
    challenge: "Explain one health issue clearly in 6 sentences.",
    mistake: ["I am having fever", "I have a fever", "For illness, 'I have' is simpler and natural."],
    drill: "Repeat: fever, food, pharmacy, throat. Practice /f/ with teeth on lip."
  },
  {
    title: "Speak In Public For 30 Seconds",
    pattern: "Greeting + topic + 2 points + closing",
    outcome: "deliver a short talk without panic",
    scenario: "class presentation, team intro, or community event",
    exampleContext: "Good morning. Today I will speak about time management. First, plan your day. Second, avoid distractions. Thank you.",
    challenge: "Record a 30-second talk standing up.",
    mistake: ["Today myself speaking about", "Today I will speak about", "Use 'I will speak about' for a talk opening."],
    drill: "Repeat: good morning, topic, point, thank you. Pause after each section."
  },
  {
    title: "Revision: Daily Life Speaking Test",
    pattern: "Use any 5 patterns from the last 25 days",
    outcome: "combine daily English patterns in one conversation",
    scenario: "AI coach asks mixed daily-life questions",
    exampleContext: "I usually study at night because it is quiet. Yesterday I practiced speaking for 20 minutes.",
    challenge: "Complete a 5-minute mixed conversation with the AI tutor.",
    mistake: ["I no understand", "I don't understand", "Use 'don't' for simple negative sentences."],
    drill: "Repeat all difficult words from your last 5 recordings."
  },
  {
    title: "Build A 60-Second Self Introduction",
    pattern: "Name + background + current work/study + goal + personal detail",
    outcome: "give a strong 60-second introduction",
    scenario: "first day at class, office, or interview",
    exampleContext: "My name is Kishore. I am from Tamil Nadu. I am learning web development, and my goal is to speak confidently with clients.",
    challenge: "Record your final introduction and compare it with Day 1.",
    mistake: ["I am coming from Chennai", "I am from Chennai", "Use 'from' for hometown, not 'coming from'."],
    drill: "Repeat your name, city, role, goal 5 times with a steady smile."
  },
  {
    title: "Beginner Interview Basics",
    pattern: "I completed + course / I know + skill / I am interested in + role",
    outcome: "answer beginner interview questions",
    scenario: "first internship, fresher interview, or training admission",
    exampleContext: "I completed a web development course. I know HTML and JavaScript basics. I am interested in frontend development.",
    challenge: "Answer: Tell me about yourself, Why this role, What are your strengths?",
    mistake: ["I passed out college", "I graduated from college", "Use 'graduated' for completing college."],
    drill: "Repeat: role, goal, skill, strength. Keep consonant endings clear."
  },
  {
    title: "Final Beginner Fluency Challenge",
    pattern: "Question + answer + reason + example + closing",
    outcome: "speak for 3 minutes using beginner patterns",
    scenario: "complete AI mock conversation across daily life topics",
    exampleContext: "I prefer online learning because I can revise anytime. For example, I watch lessons after dinner.",
    challenge: "Complete a 3-minute recording without switching to your mother tongue.",
    mistake: ["I know English but I can't able to speak", "I know English, but I am not able to speak fluently yet", "Use one helping phrase, not two together."],
    drill: "Repeat your top 10 corrected sentences from this level."
  }
];

const intermediateSeeds: LessonSeed[] = [
  {
    title: "Upgrade Short Answers",
    pattern: "Answer + reason + example + result",
    outcome: "turn basic replies into confident 45-second answers",
    scenario: "manager asks about your work or studies",
    exampleContext: "I prefer morning study because my focus is better. For example, I finish difficult topics before 9 AM.",
    challenge: "Give 5 answers using the 4-part structure.",
    mistake: ["I am agree", "I agree", "Agree is already an action; do not add 'am'."],
    drill: "Repeat: agree, example, result, reason. Keep rhythm even."
  },
  {
    title: "Explain Your Work Clearly",
    pattern: "I work on + area / My role is to + action / I coordinate with + team",
    outcome: "describe your job or project professionally",
    scenario: "office intro or client call",
    exampleContext: "I work on frontend development. My role is to build user interfaces. I coordinate with the backend team.",
    challenge: "Explain your work to a non-technical person.",
    mistake: ["I am working as frontend", "I work as a frontend developer", "Use role nouns after 'work as'."],
    drill: "Repeat: work, role, coordinate, client. Avoid rushing technical words."
  },
  {
    title: "Use Past Experience In Stories",
    pattern: "Situation + action + result + learning",
    outcome: "tell experience-based stories",
    scenario: "interview or team discussion",
    exampleContext: "In my last project, the page was slow. I optimized images, and the load time improved. I learned to test performance early.",
    challenge: "Tell one mistake story and one success story.",
    mistake: ["I have did", "I have done / I did", "Do not use past verb after 'have'."],
    drill: "Repeat: project, performance, improved, learned."
  },
  {
    title: "Participate In Meetings",
    pattern: "I have one point / Can I add something? / I suggest that + idea",
    outcome: "speak up in meetings without interrupting rudely",
    scenario: "team meeting or stand-up",
    exampleContext: "I have one point. Can I add something? I suggest that we test this before Friday.",
    challenge: "Add 3 useful points in an AI meeting simulation.",
    mistake: ["I want to tell one thing", "I would like to add one point", "Meeting English needs polished entry phrases."],
    drill: "Repeat: suggest, schedule, status, stand-up."
  },
  {
    title: "Handle Follow-Up Questions",
    pattern: "That's a good question / Let me explain / The main reason is + reason",
    outcome: "respond when someone asks 'why' or 'how'",
    scenario: "teacher, interviewer, or manager asks for details",
    exampleContext: "That's a good question. Let me explain. The main reason is the timeline was too short.",
    challenge: "Answer 5 follow-up questions without saying 'I don't know' immediately.",
    mistake: ["What to say means", "What I mean is", "Use a clean clarification phrase."],
    drill: "Repeat: explain, main, reason, detail."
  },
  {
    title: "Make Professional Requests",
    pattern: "Could you please + action? / Would it be possible to + action?",
    outcome: "ask politely in workplace English",
    scenario: "requesting leave, deadline extension, or document",
    exampleContext: "Could you please share the file? Would it be possible to extend the deadline by one day?",
    challenge: "Make 5 polite requests with reasons.",
    mistake: ["Please do the needful", "Could you please help me with this?", "'Do the needful' sounds outdated."],
    drill: "Repeat: could, would, please, possible."
  },
  {
    title: "Explain Delays And Updates",
    pattern: "The task is delayed because + reason / I will complete it by + time",
    outcome: "give honest updates without sounding careless",
    scenario: "project status update",
    exampleContext: "The task is delayed because the API changed. I will complete it by tomorrow evening.",
    challenge: "Give 3 status updates: on track, blocked, delayed.",
    mistake: ["Work is pending from my side", "I still need to finish this task", "Use active responsibility language."],
    drill: "Repeat: delayed, blocked, complete, update."
  },
  {
    title: "Disagree Politely",
    pattern: "I see your point, but + opinion / I have a slightly different view",
    outcome: "disagree without sounding aggressive",
    scenario: "office discussion or group project",
    exampleContext: "I see your point, but I think this design may confuse new users.",
    challenge: "Disagree with 5 ideas politely and give a reason.",
    mistake: ["You are wrong", "I see it differently", "Professional disagreement focuses on the idea, not the person."],
    drill: "Repeat: different, design, decision, discuss."
  },
  {
    title: "Speak About Strengths",
    pattern: "One of my strengths is + skill / This helps me to + result",
    outcome: "present strengths with evidence",
    scenario: "interview or performance review",
    exampleContext: "One of my strengths is patience. This helps me explain technical issues clearly to users.",
    challenge: "Prepare 3 strengths with examples.",
    mistake: ["My strength is I am hard work", "One of my strengths is that I am hardworking", "Use a noun or full clause after strength."],
    drill: "Repeat: strength, patience, hardworking, clearly."
  },
  {
    title: "Speak About Weaknesses Smartly",
    pattern: "I am improving + area / I handle it by + method",
    outcome: "answer weakness questions without damaging confidence",
    scenario: "job interview",
    exampleContext: "I am improving my public speaking. I handle it by practicing short presentations every week.",
    challenge: "Give 2 weaknesses with improvement actions.",
    mistake: ["My weakness is English only", "I am working on improving my spoken English", "Frame weakness as progress."],
    drill: "Repeat: weakness, improving, practicing, progress."
  },
  {
    title: "Interview: Tell Me About Yourself",
    pattern: "Present + past + skill + goal",
    outcome: "deliver a strong interview introduction",
    scenario: "HR interview",
    exampleContext: "I am a frontend developer. I completed two React projects. I enjoy building clean user experiences, and I want to grow in product engineering.",
    challenge: "Record a 75-second interview introduction.",
    mistake: ["Myself completed", "I completed", "Use 'I' for actions, not 'myself'."],
    drill: "Repeat your role and top skills with confident pauses."
  },
  {
    title: "Interview: Project Explanation",
    pattern: "Problem + solution + my contribution + impact",
    outcome: "explain projects with clarity",
    scenario: "technical interview",
    exampleContext: "The problem was slow onboarding. We built a guided dashboard. I handled the frontend flow, and users completed setup faster.",
    challenge: "Explain one project in 90 seconds.",
    mistake: ["I only done frontend", "I handled the frontend part", "Use 'handled' or 'worked on' for contribution."],
    drill: "Repeat: problem, solution, contribution, impact."
  },
  {
    title: "Phone Interview Confidence",
    pattern: "Could you please repeat? / Let me think for a moment / My answer is + point",
    outcome: "stay calm in phone interviews",
    scenario: "HR screening call",
    exampleContext: "Could you please repeat the question? Let me think for a moment. My answer is yes, I can relocate.",
    challenge: "Complete a mock phone interview without visual cues.",
    mistake: ["Wait wait", "Could you give me a moment?", "Use controlled pause language."],
    drill: "Practice answers with phone held away from your mouth."
  },
  {
    title: "Group Discussion Basics",
    pattern: "I would like to start / Building on that point / To conclude",
    outcome: "enter, continue, and close group discussions",
    scenario: "campus placement GD",
    exampleContext: "I would like to start with the impact of social media. Building on that point, privacy is also important.",
    challenge: "Speak 4 times in an AI group discussion.",
    mistake: ["I am telling", "I would like to say", "Use GD entry phrases."],
    drill: "Repeat: discussion, conclude, building, important."
  },
  {
    title: "Narrate Data Simply",
    pattern: "The number increased/decreased from X to Y / This shows + insight",
    outcome: "talk about simple numbers and charts",
    scenario: "presentation or project review",
    exampleContext: "The number increased from 20 to 35. This shows that the new campaign worked.",
    challenge: "Explain 3 numbers from your life: expenses, marks, time, or sales.",
    mistake: ["It got increased", "It increased", "Use 'increased' directly."],
    drill: "Repeat: increased, decreased, number, percentage."
  },
  {
    title: "Explain Opinions With Balance",
    pattern: "On one hand + point / On the other hand + point / Overall + opinion",
    outcome: "give balanced answers",
    scenario: "interview or debate",
    exampleContext: "On one hand, online learning is flexible. On the other hand, it needs discipline. Overall, it works well for self-motivated learners.",
    challenge: "Give balanced answers on 3 topics.",
    mistake: ["One side... another side...", "On one hand... on the other hand...", "Use standard contrast phrases."],
    drill: "Repeat: overall, flexible, discipline, motivated."
  },
  {
    title: "Sound Natural With Fillers",
    pattern: "Well... / Actually... / Let me think... / What I mean is...",
    outcome: "use natural fillers without overusing 'uh'",
    scenario: "real-time conversation",
    exampleContext: "Well, I think the idea is useful. What I mean is, it saves time for beginners.",
    challenge: "Answer 10 questions using only controlled fillers.",
    mistake: ["Actually actually actually", "Actually, I think...", "Use one filler, then continue."],
    drill: "Practice 2-second silent pause instead of filler."
  },
  {
    title: "Improve Pronunciation: V/W",
    pattern: "vibration for V / rounded lips for W",
    outcome: "reduce common Indian V/W confusion",
    scenario: "workplace words: very, well, value, vendor",
    exampleContext: "This vendor gives very good value. We will verify it next week.",
    challenge: "Record 20 V/W words and compare clarity.",
    mistake: ["wery good", "very good", "Lower lip touches upper teeth for V."],
    drill: "very/wary, vest/west, vine/wine, verse/worse."
  },
  {
    title: "Improve Pronunciation: T/D Endings",
    pattern: "finish the final sound softly",
    outcome: "make past tense and endings clearer",
    scenario: "project updates and stories",
    exampleContext: "I completed the task, updated the file, and shared it with the team.",
    challenge: "Read 15 past-tense sentences with clear endings.",
    mistake: ["I complete yesterday", "I completed it yesterday", "Past actions often need final -ed sound."],
    drill: "worked, planned, started, completed, shared."
  },
  {
    title: "Confidence Under Pressure",
    pattern: "Pause + breathe + answer in structure",
    outcome: "avoid panic when English pressure increases",
    scenario: "sudden question in meeting or interview",
    exampleContext: "Let me think for a moment. My first point is timeline. My second point is quality.",
    challenge: "Answer 5 surprise questions using a pause first.",
    mistake: ["I don't know English", "Let me try to explain", "A confident attempt is better than self-rejection."],
    drill: "Breathe in 3 seconds, answer first sentence slowly."
  },
  {
    title: "Persuade Someone",
    pattern: "Problem + benefit + proof + action",
    outcome: "convince politely with structure",
    scenario: "convincing manager, client, or friend",
    exampleContext: "The current process takes time. This tool can reduce manual work. We tested it yesterday. Let's try it for one week.",
    challenge: "Persuade the AI to approve one idea.",
    mistake: ["You must accept", "I recommend we try this", "Persuasion should sound respectful."],
    drill: "Repeat: recommend, benefit, proof, process."
  },
  {
    title: "Handle Conflict Calmly",
    pattern: "I understand + concern / My concern is + issue / Let's + solution",
    outcome: "speak during disagreement without anger",
    scenario: "deadline conflict or team misunderstanding",
    exampleContext: "I understand your concern. My concern is the testing time. Let's split the task and finish by evening.",
    challenge: "Role-play one conflict and end with a solution.",
    mistake: ["You didn't understand me", "Let me clarify my point", "Use clarification, not blame."],
    drill: "Repeat: concern, clarify, solution, deadline."
  },
  {
    title: "Customer-Facing English",
    pattern: "I understand the issue / Let me check / Here is what we can do",
    outcome: "support customers professionally",
    scenario: "client support or service desk",
    exampleContext: "I understand the issue. Let me check the order status. Here is what we can do next.",
    challenge: "Handle an angry customer in AI simulation.",
    mistake: ["Calm down first", "I understand this is frustrating", "Acknowledge emotion before solution."],
    drill: "Repeat: issue, status, frustrating, solution."
  },
  {
    title: "Presentation Opening",
    pattern: "Hook + topic + agenda + benefit",
    outcome: "open presentations strongly",
    scenario: "college seminar or office demo",
    exampleContext: "Have you ever wasted time searching for files? Today I will explain our document system. I will cover problem, solution, and demo.",
    challenge: "Record a 45-second opening.",
    mistake: ["My topic is about", "Today I will talk about", "Use a direct presentation opening."],
    drill: "Practice hook with a pause after the first question."
  },
  {
    title: "Presentation Closing",
    pattern: "Summary + final message + call to action",
    outcome: "end talks memorably",
    scenario: "presentation, demo, or pitch",
    exampleContext: "To summarize, the tool saves time, reduces errors, and improves tracking. My suggestion is to pilot it next week.",
    challenge: "Close a presentation in 30 seconds.",
    mistake: ["That's all", "Thank you. I am happy to take questions", "End with confidence, not sudden stop."],
    drill: "Repeat: summarize, suggestion, questions, thank you."
  },
  {
    title: "Intermediate Fluency Test",
    pattern: "Use story, reason, example, opinion, and question structures",
    outcome: "sustain a 7-minute AI conversation",
    scenario: "mixed work and daily life conversation",
    exampleContext: "I agree partly because the idea is useful, but the timeline needs adjustment.",
    challenge: "Complete a 7-minute conversation and note 5 corrected sentences.",
    mistake: ["I can able to manage", "I can manage / I am able to manage", "Use either 'can' or 'am able to'."],
    drill: "Repeat all corrected sentences from this level."
  },
  {
    title: "Mock Interview Round 1",
    pattern: "Question + structured answer + example",
    outcome: "answer HR questions with confidence",
    scenario: "complete HR mock interview",
    exampleContext: "My strength is consistency. For example, I practiced English daily for 30 days and improved my fluency.",
    challenge: "Answer 8 HR questions in one sitting.",
    mistake: ["I am a quick learner person", "I am a quick learner", "Avoid unnecessary extra nouns."],
    drill: "Practice confident endings: role, goal, learn, grow."
  },
  {
    title: "Mock Interview Round 2",
    pattern: "Problem + action + measurable result",
    outcome: "answer behavioural questions",
    scenario: "STAR-style interview",
    exampleContext: "A teammate was blocked. I explained the API flow and created notes. As a result, the task finished on time.",
    challenge: "Answer 5 behavioural questions with examples.",
    mistake: ["I explained him", "I explained it to him", "Use 'explain something to someone'."],
    drill: "Repeat: behaviour, result, teammate, explained."
  },
  {
    title: "Workplace Storytelling For Trust",
    pattern: "Context + decision + action + result + next step",
    outcome: "explain workplace incidents in a way that builds trust",
    scenario: "manager asks why a task succeeded, failed, or changed",
    exampleContext: "The original plan had a risk. I discussed it with the team, changed the flow, and reduced confusion for users.",
    challenge: "Tell 3 workplace stories: one success, one delay, one learning.",
    mistake: ["I done mistake so project late", "I made a mistake, corrected it, and shared the learning with the team", "Own the issue and show the fix."],
    drill: "Repeat: context, decision, action, result, learning."
  },
  {
    title: "Final Intermediate Challenge",
    pattern: "Professional conversation with structure and confidence",
    outcome: "speak for 10 minutes across work, interview, and daily topics",
    scenario: "AI acts as interviewer, manager, and friend",
    exampleContext: "I would like to add one point. The main benefit is speed, but we should also consider quality.",
    challenge: "Complete final speaking test and score yourself on clarity, pace, confidence.",
    mistake: ["I didn't knew", "I didn't know", "After didn't, use base verb."],
    drill: "Repeat your 10 most important professional sentences."
  }
];

const advancedSeeds: LessonSeed[] = [
  {
    title: "Executive Self Introduction",
    pattern: "Identity + expertise + impact + current focus",
    outcome: "introduce yourself with senior-level clarity",
    scenario: "networking event or client meeting",
    exampleContext: "I am a product-focused developer with experience building learning platforms. My work helps users complete tasks faster, and I am currently focused on AI-driven education.",
    challenge: "Record a 90-second executive intro with no filler words.",
    mistake: ["I am basically working on many things", "I work on AI-driven education products", "Specific language sounds more credible."],
    drill: "Practice stress on key words: product, impact, users, growth."
  },
  {
    title: "Strategic Storytelling",
    pattern: "Context + tension + decision + outcome + lesson",
    outcome: "tell stories that influence decisions",
    scenario: "leadership meeting or investor pitch",
    exampleContext: "The team was moving fast, but quality was dropping. We paused, created a review checklist, and reduced rework.",
    challenge: "Tell one leadership story in 2 minutes.",
    mistake: ["Then only we understood", "That is when we understood", "Use polished transition phrases."],
    drill: "Practice pausing before the outcome sentence."
  },
  {
    title: "Client Discovery Questions",
    pattern: "Could you walk me through + process? / What is the biggest challenge with + area?",
    outcome: "ask high-value client questions",
    scenario: "sales or product discovery call",
    exampleContext: "Could you walk me through your onboarding process? What is the biggest challenge with learner retention?",
    challenge: "Ask 10 discovery questions without pitching.",
    mistake: ["What is your problem?", "What challenge are you trying to solve?", "Client language should sound consultative."],
    drill: "Repeat: discovery, challenge, process, retention."
  },
  {
    title: "Consultative Recommendations",
    pattern: "Based on + observation, I recommend + action because + reason",
    outcome: "give advice like a consultant",
    scenario: "client recommendation or internal strategy",
    exampleContext: "Based on the completion data, I recommend adding reminders because learners drop after Day 3.",
    challenge: "Give 5 recommendations with evidence.",
    mistake: ["You should do this only", "I recommend this approach because...", "Recommendations need evidence and respect."],
    drill: "Repeat: recommend, observation, evidence, approach."
  },
  {
    title: "Advanced Meeting Leadership",
    pattern: "Purpose + agenda + decision needed + next steps",
    outcome: "lead meetings with control",
    scenario: "project review or stakeholder meeting",
    exampleContext: "The purpose of this meeting is to finalize launch scope. We will review blockers, decide priorities, and assign next steps.",
    challenge: "Run a 5-minute AI meeting as the leader.",
    mistake: ["We will discuss about", "We will discuss", "Do not use 'about' after discuss."],
    drill: "Practice agenda lines with strong downward intonation."
  },
  {
    title: "Handling Objections",
    pattern: "Acknowledge + clarify + reframe + next step",
    outcome: "respond to disagreement like a professional",
    scenario: "client doubts price, timeline, or value",
    exampleContext: "I understand the cost concern. May I clarify the expected usage? If adoption is high, the cost per learner becomes much lower.",
    challenge: "Handle 5 objections without becoming defensive.",
    mistake: ["No no, you are not understanding", "I understand the concern. Let me clarify", "Defensive language reduces trust."],
    drill: "Repeat: concern, clarify, reframe, value."
  },
  {
    title: "Negotiation English",
    pattern: "If we + concession, could you + request?",
    outcome: "negotiate scope, price, or deadline politely",
    scenario: "freelance, client, or vendor negotiation",
    exampleContext: "If we include two extra revisions, could you confirm the payment by Friday?",
    challenge: "Negotiate a project timeline with the AI.",
    mistake: ["You give discount, I buy", "If you can offer a discount, we can move ahead", "Negotiation needs conditional language."],
    drill: "Repeat: negotiate, concession, confirm, deadline."
  },
  {
    title: "Persuasive Presentations",
    pattern: "Problem + stakes + solution + proof + ask",
    outcome: "deliver persuasive business presentations",
    scenario: "pitching a new feature or business idea",
    exampleContext: "Learners drop because practice feels lonely. If we add guided AI role-play, they get feedback instantly. Our pilot data can validate this.",
    challenge: "Give a 3-minute persuasive pitch.",
    mistake: ["This feature is very very useful", "This feature improves retention by making practice immediate", "Specific benefit beats repeated adjectives."],
    drill: "Stress numbers and benefits clearly."
  },
  {
    title: "Data-Driven Speaking",
    pattern: "Data point + interpretation + implication + action",
    outcome: "explain metrics like a leader",
    scenario: "analytics review",
    exampleContext: "Completion dropped from 62% to 48%. This suggests Day 5 is too difficult. We should add a recap activity.",
    challenge: "Explain 5 metrics with action steps.",
    mistake: ["Data is saying", "The data suggests", "Use professional data verbs."],
    drill: "Repeat: metric, suggests, implication, retention."
  },
  {
    title: "Crisis Communication",
    pattern: "Issue + ownership + immediate action + prevention",
    outcome: "communicate during problems calmly",
    scenario: "server issue, missed deadline, or customer escalation",
    exampleContext: "We found an issue in the login flow. We are fixing it now, and we will add monitoring to prevent repeat failures.",
    challenge: "Give a crisis update in 60 seconds.",
    mistake: ["Mistake happened by team", "We found an issue and we are fixing it", "Take ownership without panic."],
    drill: "Practice calm pace under time pressure."
  },
  {
    title: "Advanced Interview: Leadership",
    pattern: "Challenge + decision + collaboration + impact",
    outcome: "answer leadership questions with maturity",
    scenario: "senior role interview",
    exampleContext: "When priorities conflicted, I aligned the team around user impact and delivery risk.",
    challenge: "Answer 5 leadership interview questions.",
    mistake: ["I managed them strictly", "I aligned the team with clear expectations", "Leadership language should show clarity, not control."],
    drill: "Repeat: aligned, expectations, ownership, impact."
  },
  {
    title: "Advanced Interview: Salary And Notice Period",
    pattern: "Expectation + flexibility + value",
    outcome: "handle sensitive interview questions professionally",
    scenario: "HR negotiation",
    exampleContext: "Based on my skills and market range, I am expecting a fair offer. I am flexible if the role has strong growth opportunities.",
    challenge: "Practice salary, notice period, relocation answers.",
    mistake: ["Anything is okay", "I am open to a fair discussion", "Confident flexibility sounds stronger."],
    drill: "Repeat: expectation, flexible, opportunity, fair."
  },
  {
    title: "Networking With Senior People",
    pattern: "Appreciation + relevance + question",
    outcome: "speak to mentors, founders, or leaders",
    scenario: "LinkedIn, event, or conference",
    exampleContext: "I liked your point about AI in education. I am building in that space too. May I ask how you think about retention?",
    challenge: "Start 5 networking conversations.",
    mistake: ["Give me opportunity", "I would appreciate your guidance", "Networking starts with relevance, not demand."],
    drill: "Practice warm, concise openings."
  },
  {
    title: "Cross-Cultural Communication",
    pattern: "Clear context + direct ask + polite tone",
    outcome: "communicate with global teams",
    scenario: "US/UK client call",
    exampleContext: "For context, we completed the API integration. Could you confirm whether the staging data is final?",
    challenge: "Rewrite 5 vague messages into global-friendly English.",
    mistake: ["Kindly revert back", "Please reply / Could you confirm?", "Avoid outdated Indian office phrases."],
    drill: "Repeat: context, confirm, staging, integration."
  },
  {
    title: "Advanced Pronunciation: Word Stress",
    pattern: "stress one main syllable per important word",
    outcome: "sound clearer and less flat",
    scenario: "presentations and interviews",
    exampleContext: "COMmunication, deVELopment, opporTUnity, reSPONsibility.",
    challenge: "Mark stress in 20 professional words and record them.",
    mistake: ["Equal stress on every syllable", "Strong stress on one syllable", "English rhythm depends on stress."],
    drill: "communication, development, opportunity, responsibility."
  },
  {
    title: "Advanced Pronunciation: Sentence Rhythm",
    pattern: "stress content words, reduce small words",
    outcome: "sound more natural in long sentences",
    scenario: "client explanation",
    exampleContext: "We NEED to FIX the LOGIN issue BEFORE the DEMO.",
    challenge: "Record 10 sentences with stressed keywords.",
    mistake: ["Robotic equal pacing", "Natural keyword stress", "Listeners follow stressed meaning words."],
    drill: "Say 5 project updates with keyword stress."
  },
  {
    title: "Story-Based Personal Branding",
    pattern: "Origin + skill + proof + mission",
    outcome: "present your professional identity memorably",
    scenario: "portfolio, interview, or networking",
    exampleContext: "I started by building small websites, then moved into learning platforms. Now I focus on products that improve real communication skills.",
    challenge: "Create a 2-minute personal brand story.",
    mistake: ["I am normal developer", "I build learning products that solve communication problems", "Branding needs specificity."],
    drill: "Repeat your mission sentence 10 times."
  },
  {
    title: "Facilitate Brainstorming",
    pattern: "Let's explore + idea / What if + option / The trade-off is + risk",
    outcome: "guide creative discussions",
    scenario: "product or startup brainstorming",
    exampleContext: "Let's explore a voice-first challenge. What if learners unlock lessons by speaking? The trade-off is onboarding complexity.",
    challenge: "Facilitate an AI brainstorming session.",
    mistake: ["Tell ideas", "Let's explore a few ideas", "Facilitation invites participation."],
    drill: "Repeat: explore, trade-off, option, complexity."
  },
  {
    title: "Explain Technical Ideas Simply",
    pattern: "Simple analogy + benefit + example",
    outcome: "make complex ideas easy for anyone",
    scenario: "explaining AI, code, or product to non-technical users",
    exampleContext: "Think of Firebase Auth like a secure gate. It checks the user's identity before they enter the app.",
    challenge: "Explain 3 technical topics to a beginner.",
    mistake: ["Using only jargon", "Use analogy before technical terms", "Simple explanations build trust."],
    drill: "Practice slow delivery of technical words."
  },
  {
    title: "Difficult Feedback Conversations",
    pattern: "Observation + impact + expectation + support",
    outcome: "give feedback respectfully",
    scenario: "team lead or peer feedback",
    exampleContext: "I noticed the updates were delayed. It affected testing time. Going forward, please flag blockers earlier. I can help you plan the next task.",
    challenge: "Give feedback in 3 scenarios without blaming.",
    mistake: ["You always delay", "I noticed this was delayed", "Feedback should be specific, not attacking."],
    drill: "Repeat: noticed, impact, expectation, support."
  },
  {
    title: "Advanced Debate",
    pattern: "Position + evidence + counterpoint + conclusion",
    outcome: "defend opinions under challenge",
    scenario: "panel, GD, or leadership discussion",
    exampleContext: "I support AI in education because feedback becomes immediate. A concern is dependency, but guided practice can reduce that risk.",
    challenge: "Debate AI in education for 5 minutes.",
    mistake: ["I only correct", "I partly agree, but...", "Advanced debate allows nuance."],
    drill: "Repeat: evidence, counterpoint, conclusion, nuance."
  },
  {
    title: "Host A Webinar",
    pattern: "Welcome + agenda + interaction + transition + close",
    outcome: "host live sessions confidently",
    scenario: "online class or product demo",
    exampleContext: "Welcome everyone. Today we will cover three speaking frameworks. Please type your questions in chat. Let's begin with introductions.",
    challenge: "Host a 4-minute mini webinar.",
    mistake: ["Hello all, myself host", "Welcome everyone, I am your host", "Use polished hosting phrases."],
    drill: "Practice transitions: next, now, before we move on."
  },
  {
    title: "Podcast-Style Conversation",
    pattern: "Question + follow-up + reflection + transition",
    outcome: "hold deep conversations naturally",
    scenario: "interviewing a guest or mentor",
    exampleContext: "What inspired you to start? That's interesting. How did that experience change your approach?",
    challenge: "Interview the AI for 6 minutes.",
    mistake: ["Asking unrelated questions", "Use follow-ups from the previous answer", "Good conversation listens and builds."],
    drill: "Practice curious tone with falling-rising intonation."
  },
  {
    title: "Final Presentation Rehearsal",
    pattern: "Hook + narrative + evidence + recommendation + close",
    outcome: "deliver a complete professional presentation",
    scenario: "capstone presentation",
    exampleContext: "Most learners don't fail because of grammar; they fail because practice feels unsafe. Verbalyx solves that with guided speaking loops.",
    challenge: "Record a 5-minute presentation and review clarity, pace, impact.",
    mistake: ["Too many points", "One main message with supporting points", "Strong presentations are selective."],
    drill: "Rehearse with timed pauses."
  },
  {
    title: "Boardroom Q&A Handling",
    pattern: "Acknowledge + answer directly + support + check alignment",
    outcome: "answer tough questions without losing control",
    scenario: "senior stakeholder questions your plan",
    exampleContext: "That's a fair concern. The short answer is yes, we can deliver by Friday if scope stays fixed. The main dependency is QA availability.",
    challenge: "Answer 8 rapid-fire stakeholder questions in under 90 seconds each.",
    mistake: ["As I already told", "To clarify, my recommendation is...", "Never sound irritated in high-stakes Q&A."],
    drill: "Practice short answers with firm endings."
  },
  {
    title: "Thought Leadership Speaking",
    pattern: "Trend + point of view + implication + recommendation",
    outcome: "sound like an expert, not just a participant",
    scenario: "panel discussion, LinkedIn video, or team learning session",
    exampleContext: "AI coaching is moving from passive content to active practice. My view is that feedback loops will matter more than video lessons alone.",
    challenge: "Record a 2-minute opinion on the future of English learning.",
    mistake: ["Nowadays all are using AI", "AI adoption is increasing across learning products", "Thought leadership needs precise, non-generic statements."],
    drill: "Stress: trend, viewpoint, implication, recommendation."
  },
  {
    title: "Mentoring And Coaching English",
    pattern: "Encourage + diagnose + suggest + accountability",
    outcome: "coach juniors or peers with clarity and kindness",
    scenario: "helping a teammate improve communication",
    exampleContext: "You explained the idea well. The main improvement is structure. Try starting with the result, then explain the reason. Send me one revised version today.",
    challenge: "Coach the AI learner through 3 communication mistakes.",
    mistake: ["Your English is bad", "Your idea is good; let's improve the structure", "Good coaching protects confidence while correcting clearly."],
    drill: "Practice warm tone with direct feedback."
  },
  {
    title: "Advanced Mock Interview",
    pattern: "Concise answer + proof + reflection",
    outcome: "perform in senior-level interviews",
    scenario: "final interview with founder or director",
    exampleContext: "I handled ambiguity by converting the broad goal into weekly milestones and aligning stakeholders early.",
    challenge: "Complete a 12-question senior mock interview.",
    mistake: ["Giving long unfocused answers", "Answer first, then support with proof", "Senior answers need structure and judgment."],
    drill: "Practice 60-second answer limits."
  },
  {
    title: "Capstone: Real-World Fluency Simulation",
    pattern: "Switch between friend, customer, interviewer, and leader modes",
    outcome: "prove flexible real-world English fluency",
    scenario: "AI switches roles every 2 minutes",
    exampleContext: "With a friend: casual. With a client: clear and polite. With an interviewer: structured. With a team: decisive.",
    challenge: "Complete a 15-minute multi-role fluency simulation.",
    mistake: ["Same tone everywhere", "Adjust tone to audience", "Fluency means adapting, not just speaking fast."],
    drill: "Record one sentence in casual, professional, and leadership tone."
  },
  {
    title: "Final Advanced Transformation Review",
    pattern: "Before + growth + proof + next goal",
    outcome: "summarize your communication transformation",
    scenario: "final coaching review",
    exampleContext: "Before this program, I hesitated to speak. Now I can handle interviews, meetings, and presentations with structure.",
    challenge: "Record your final 3-minute transformation story.",
    mistake: ["I improved little bit", "I have improved significantly in clarity and confidence", "Own your progress with specific language."],
    drill: "Repeat your final confidence statement daily for one week."
  }
];

function promptsFor(seed: LessonSeed, level: CourseLevel) {
  const levelPush =
    level === "BEGINNER"
      ? "Use simple sentences. Speak slowly."
      : level === "INTERMEDIATE"
        ? "Use structure: answer, reason, example."
        : "Use concise, audience-aware professional language.";

  return [
    `Speak for 45 seconds about: ${seed.scenario}. ${levelPush}`,
    `Use this pattern in 5 different sentences: ${seed.pattern}.`,
    `Answer this naturally: Why is "${seed.title}" useful in your real life?`,
    `Role-play the situation: ${seed.scenario}. Ask one question and answer one question.`,
    `Correct yourself aloud: say the wrong sentence "${seed.mistake[0]}", then the correct sentence "${seed.mistake[1]}".`
  ];
}

function lessonFromSeed(seed: LessonSeed, index: number, level: CourseLevel): CurriculumLesson {
  const day = index + 1;

  return {
    id: `${level.toLowerCase()}-day-${day}`,
    day,
    title: seed.title,
    type: seed.type || (day % 7 === 0 ? "QUIZ" : day % 5 === 0 ? "SPEAKING" : "GRAMMAR"),
    durationMinutes: day % 3 === 0 ? 30 : 25,
    objective: `By the end of this lesson, you will ${seed.outcome}.`,
    explanation: `Today, do not worry about grammar names. Use this speaking pattern: ${seed.pattern}. First say the main idea. Then add one reason or example. If you get stuck, pause for two seconds and restart from the pattern.`,
    examples: [
      seed.exampleContext,
      `Indian context example: Use this when ${seed.scenario}, especially when you need clear English without sounding too formal.`,
      `Hinglish support: Think the idea in your language, but speak using the fixed English pattern: ${seed.pattern}.`
    ],
    speakingTask: `Record yourself for 2 minutes on "${seed.title}". Use the pattern at least 5 times and do not delete the first attempt.`,
    practiceExercise: `Write 5 sentences using "${seed.pattern}". Then speak them aloud twice: first slowly, then at normal speed.`,
    speakingPrompts: promptsFor(seed, level),
    realLifeScenario: seed.scenario,
    aiScenario: {
      role: level === "ADVANCED" ? "senior communication coach" : level === "INTERMEDIATE" ? "strict interview and workplace coach" : "friendly daily-English coach",
      situation: seed.scenario,
      openingLine: `Let's practice "${seed.title}". Start with one sentence using: ${seed.pattern}.`,
      coachInstructions: [
        "Correct mistakes instantly using the Verbalyx feedback format.",
        "Ask one follow-up question after every student answer.",
        "Push the learner to speak again with a clearer version.",
        "Keep feedback friendly, direct, and practical."
      ]
    },
    dailyChallenge: seed.challenge,
    pronunciationDrill: seed.drill,
    commonMistake: {
      wrong: seed.mistake[0],
      correct: seed.mistake[1],
      why: seed.mistake[2]
    },
    confidenceBooster: `Stand up, smile lightly, and say the corrected version 5 times. Your goal is progress, not perfect English.`
  };
}

function makeLevel({
  id,
  title,
  level,
  promise,
  seeds
}: {
  id: string;
  title: string;
  level: CourseLevel;
  promise: string;
  seeds: LessonSeed[];
}): CurriculumLevel {
  return {
    id,
    title,
    level,
    promise,
    methodology,
    lessons: seeds.map((seed, index) => lessonFromSeed(seed, index, level))
  };
}

export const verbalyxCurriculum: VerbalyxCurriculum = {
  program: "Verbalyx 90-Day Spoken English Transformation System",
  version: "2026.04",
  levels: [
    makeLevel({
      id: "foundation-builder",
      title: "Beginner: Foundation Builder",
      level: "BEGINNER",
      promise: "Build speaking habit, basic sentence confidence, and daily-life English without fear.",
      seeds: beginnerSeeds
    }),
    makeLevel({
      id: "confidence-builder",
      title: "Intermediate: Confidence Builder",
      level: "INTERMEDIATE",
      promise: "Move from short answers to structured workplace, interview, and social communication.",
      seeds: intermediateSeeds
    }),
    makeLevel({
      id: "fluency-professional-communication",
      title: "Advanced: Fluency & Professional Communication",
      level: "ADVANCED",
      promise: "Speak with influence in interviews, meetings, presentations, clients, leadership, and global teams.",
      seeds: advancedSeeds
    })
  ]
};

export const detailedSampleLessons = [
  verbalyxCurriculum.levels[0].lessons[0],
  verbalyxCurriculum.levels[0].lessons[8],
  verbalyxCurriculum.levels[1].lessons[10],
  verbalyxCurriculum.levels[1].lessons[18],
  verbalyxCurriculum.levels[2].lessons[7]
];

export function getCurriculumLevel(levelId: string) {
  return verbalyxCurriculum.levels.find((level) => level.id === levelId || level.level.toLowerCase() === levelId.toLowerCase());
}
