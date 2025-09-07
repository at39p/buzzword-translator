// Corporate Buzzword Database
// Comprehensive collection of corporate jargon and their plain English translations

const buzzwords = [
  // A-C
  {
    phrase: "actionable insights",
    translation: "useful information you can act on",
    keywords: ["actionable", "insights", "useful", "information", "act"],
    category: "analysis",
    alternatives: ["useful data", "practical information"],
    context: "Data or analysis that leads to specific actions or decisions"
  },
  {
    phrase: "agile methodology",
    translation: "flexible project management approach",
    keywords: ["agile", "methodology", "flexible", "iterative", "scrum"],
    category: "methodology",
    alternatives: ["flexible approach", "iterative development"],
    context: "A project management approach that emphasizes flexibility and collaboration"
  },
  {
    phrase: "alignment",
    translation: "agreement on goals and direction",
    keywords: ["alignment", "agreement", "goals", "direction", "sync"],
    category: "collaboration",
    alternatives: ["agreement", "coordination"],
    context: "Ensuring everyone is working toward the same objectives"
  },
  {
    phrase: "at the end of the day",
    translation: "ultimately or when everything is considered",
    keywords: ["end", "day", "ultimately", "final", "conclusion"],
    category: "summary",
    alternatives: ["ultimately", "in the end"],
    context: "Used to introduce a final point or conclusion"
  },
  {
    phrase: "bandwidth",
    translation: "available time or capacity",
    keywords: ["bandwidth", "time", "capacity", "availability"],
    category: "resources",
    alternatives: ["capacity", "availability"],
    context: "Refers to someone's ability to take on additional work or responsibilities",
    multipleMeanings: [
      {
        translation: "data transmission capacity",
        context: "In technology, the maximum rate of data transfer across a network"
      }
    ]
  },
  {
    phrase: "best practice",
    translation: "the most effective way to do something",
    keywords: ["best", "practice", "effective", "standard", "optimal"],
    category: "methodology",
    alternatives: ["standard approach", "proven method"],
    context: "Methods or techniques that have proven to be most effective"
  },
  {
    phrase: "big picture",
    translation: "overall view or long-term perspective",
    keywords: ["big", "picture", "overall", "perspective", "strategic"],
    category: "perspective",
    alternatives: ["overall view", "strategic perspective"],
    context: "Looking at the broader context rather than focusing on details"
  },
  {
    phrase: "bleeding edge",
    translation: "the very latest technology or innovation",
    keywords: ["bleeding", "edge", "latest", "technology", "cutting"],
    category: "innovation",
    alternatives: ["cutting edge", "latest technology"],
    context: "Technology or methods that are so new they may still have problems"
  },
  {
    phrase: "blue sky thinking",
    translation: "creative thinking without constraints",
    keywords: ["blue", "sky", "thinking", "creative", "unconstrained"],
    category: "innovation",
    alternatives: ["creative brainstorming", "unconstrained thinking"],
    context: "Brainstorming without worrying about practical limitations"
  },
  {
    phrase: "boil the ocean",
    translation: "attempt an impossible or overly complex task",
    keywords: ["boil", "ocean", "impossible", "complex", "overwhelming"],
    category: "scope",
    alternatives: ["overreach", "bite off more than you can chew"],
    context: "Taking on a task that's far too large or complex to be practical"
  },
  {
    phrase: "buy-in",
    translation: "agreement and support from others",
    keywords: ["buy", "in", "agreement", "support", "approval"],
    category: "approval",
    alternatives: ["support", "agreement"],
    context: "Getting others to agree with and support a decision or plan"
  },
  {
    phrase: "circle back",
    translation: "discuss this later",
    keywords: ["circle", "back", "later", "discuss", "return"],
    category: "communication",
    alternatives: ["follow up", "revisit"],
    context: "Used to postpone a discussion or decision to a future time"
  },
  {
    phrase: "circle the wagons",
    translation: "defend against criticism or attack",
    keywords: ["circle", "wagons", "defend", "protect", "criticism"],
    category: "defense",
    alternatives: ["defend", "protect"],
    context: "Taking a defensive position when facing external pressure"
  },
  {
    phrase: "core competency",
    translation: "main strength or expertise",
    keywords: ["core", "competency", "strength", "expertise", "skill"],
    category: "capability",
    alternatives: ["main strength", "key skill"],
    context: "The primary area where an organization or person excels"
  },
  {
    phrase: "customer-centric",
    translation: "focused on customer needs",
    keywords: ["customer", "centric", "focused", "needs", "oriented"],
    category: "strategy",
    alternatives: ["customer-focused", "customer-oriented"],
    context: "Putting customer needs at the center of business decisions"
  },
  // D-F
  {
    phrase: "data-driven",
    translation: "making decisions based on data analysis",
    keywords: ["data", "driven", "analysis", "metrics", "evidence"],
    category: "methodology",
    alternatives: ["evidence-based", "metrics-driven"],
    context: "Using data and analytics to guide decision-making"
  },
  {
    phrase: "deep dive",
    translation: "thorough analysis or investigation",
    keywords: ["deep", "dive", "analysis", "thorough", "investigate"],
    category: "analysis",
    alternatives: ["detailed analysis", "comprehensive review"],
    context: "An in-depth examination of a topic or problem"
  },
  {
    phrase: "deliverable",
    translation: "something that must be completed or provided",
    keywords: ["deliverable", "completed", "provided", "output"],
    category: "output",
    alternatives: ["output", "result"],
    context: "A specific item or result that needs to be produced"
  },
  {
    phrase: "digital transformation",
    translation: "adopting digital technology across business",
    keywords: ["digital", "transformation", "technology", "modernization"],
    category: "technology",
    alternatives: ["digitization", "tech modernization"],
    context: "The process of integrating digital technology into all business areas"
  },
  {
    phrase: "disruptive innovation",
    translation: "innovation that creates new markets",
    keywords: ["disruptive", "innovation", "breakthrough", "revolutionary"],
    category: "innovation",
    alternatives: ["breakthrough innovation", "game-changing technology"],
    context: "Innovation that significantly alters or creates entirely new markets"
  },
  {
    phrase: "double-click",
    translation: "examine something more closely",
    keywords: ["double", "click", "examine", "closer", "detail"],
    category: "analysis",
    alternatives: ["look closer", "examine in detail"],
    context: "Taking a closer look at a specific issue or topic"
  },
  {
    phrase: "drinking the Kool-Aid",
    translation: "blindly accepting company beliefs",
    keywords: ["drinking", "kool", "aid", "accepting", "beliefs"],
    category: "culture",
    alternatives: ["buying in completely", "accepting blindly"],
    context: "Accepting corporate culture or decisions without question"
  },
  {
    phrase: "drill down",
    translation: "examine something in more detail",
    keywords: ["drill", "down", "detail", "examine", "analyze"],
    category: "analysis",
    alternatives: ["dig deeper", "examine closely"],
    context: "Looking at information at a more granular or detailed level"
  },
  {
    phrase: "ecosystem",
    translation: "interconnected network of related things",
    keywords: ["ecosystem", "network", "connected", "related"],
    category: "system",
    alternatives: ["network", "environment"],
    context: "A complex network of interconnected elements working together"
  },
  {
    phrase: "elephant in the room",
    translation: "obvious problem everyone ignores",
    keywords: ["elephant", "room", "obvious", "problem", "ignore"],
    category: "problems",
    alternatives: ["obvious issue", "ignored problem"],
    context: "A major issue that everyone knows about but no one wants to discuss"
  },
  {
    phrase: "empower",
    translation: "give authority or confidence to act",
    keywords: ["empower", "authority", "confidence", "enable", "authorize"],
    category: "leadership",
    alternatives: ["enable", "authorize"],
    context: "Giving people the authority and confidence to make decisions"
  },
  {
    phrase: "enabler",
    translation: "something/someone that makes other things possible",
    keywords: ["enabler", "facilitator", "catalyst", "support", "foundation"],
    category: "support",
    alternatives: ["facilitator", "catalyst"],
    context: "A tool, process, or resource that helps achieve other goals"
  },
  {
    phrase: "end-to-end",
    translation: "covering the complete process",
    keywords: ["end", "to", "end", "complete", "comprehensive", "full"],
    category: "scope",
    alternatives: ["complete", "comprehensive"],
    context: "Covering every aspect of a process from start to finish"
  },
  {
    phrase: "evangelize",
    translation: "promote enthusiastically",
    keywords: ["evangelize", "promote", "advocate", "champion", "spread"],
    category: "promotion",
    alternatives: ["champion", "advocate for"],
    context: "Enthusiastically promoting an idea, product, or approach"
  },
  {
    phrase: "facilitate",
    translation: "help make something happen or easier",
    keywords: ["facilitate", "help", "enable", "assist"],
    category: "support",
    alternatives: ["help", "enable"],
    context: "Making a process or activity easier or more achievable"
  },
  {
    phrase: "fire drill",
    translation: "urgent but unnecessary activity",
    keywords: ["fire", "drill", "urgent", "unnecessary", "panic"],
    category: "urgency",
    alternatives: ["false alarm", "unnecessary rush"],
    context: "A situation that seems urgent but is actually not important"
  },
  // G-I
  {
    phrase: "game changer",
    translation: "something that significantly alters the situation",
    keywords: ["game", "changer", "significant", "alter", "transform"],
    category: "impact",
    alternatives: ["breakthrough", "revolutionary"],
    context: "An innovation or development that fundamentally changes how things are done"
  },
  {
    phrase: "get our ducks in a row",
    translation: "organize and prepare properly",
    keywords: ["ducks", "row", "organize", "prepare", "ready"],
    category: "preparation",
    alternatives: ["get organized", "prepare properly"],
    context: "Making sure everything is properly organized before proceeding"
  },
  {
    phrase: "granular",
    translation: "very detailed or specific",
    keywords: ["granular", "detailed", "specific", "fine"],
    category: "detail",
    alternatives: ["detailed", "specific"],
    context: "Breaking something down into very small, specific parts"
  },
  {
    phrase: "growth hacking",
    translation: "creative marketing for rapid growth",
    keywords: ["growth", "hacking", "marketing", "rapid", "creative"],
    category: "marketing",
    alternatives: ["rapid growth strategies", "creative marketing"],
    context: "Using creative, low-cost strategies to help businesses acquire customers"
  },
  {
    phrase: "hard stop",
    translation: "absolute deadline or end time",
    keywords: ["hard", "stop", "deadline", "absolute", "firm"],
    category: "time",
    alternatives: ["firm deadline", "absolute limit"],
    context: "A non-negotiable end time or deadline"
  },
  {
    phrase: "herding cats",
    translation: "managing difficult or uncooperative people",
    keywords: ["herding", "cats", "difficult", "manage", "chaos"],
    category: "management",
    alternatives: ["managing chaos", "difficult coordination"],
    context: "Trying to coordinate people who don't want to be coordinated"
  },
  {
    phrase: "hit the ground running",
    translation: "start working effectively immediately",
    keywords: ["hit", "ground", "running", "start", "immediately"],
    category: "productivity",
    alternatives: ["start strong", "begin effectively"],
    context: "Being able to work productively from the very beginning"
  },
  {
    phrase: "holistic",
    translation: "considering the whole picture",
    keywords: ["holistic", "whole", "complete", "comprehensive"],
    category: "perspective",
    alternatives: ["comprehensive", "complete view"],
    context: "Taking into account all aspects of a situation"
  },
  {
    phrase: "ideate",
    translation: "brainstorm or generate ideas",
    keywords: ["ideate", "brainstorm", "generate", "ideas", "create"],
    category: "innovation",
    alternatives: ["brainstorm", "think creatively"],
    context: "The process of forming and developing new ideas"
  },
  {
    phrase: "impactful",
    translation: "having a strong effect or influence",
    keywords: ["impactful", "effective", "influential", "powerful"],
    category: "impact",
    alternatives: ["effective", "influential"],
    context: "Something that creates significant positive change or results"
  },
  {
    phrase: "in the weeds",
    translation: "lost in too much detail",
    keywords: ["weeds", "detail", "lost", "overwhelmed"],
    category: "focus",
    alternatives: ["too detailed", "lost in details"],
    context: "Being so focused on small details that you lose sight of the big picture"
  },
  {
    phrase: "iterate",
    translation: "repeat and improve gradually",
    keywords: ["iterate", "repeat", "improve", "refine"],
    category: "process",
    alternatives: ["refine", "improve gradually"],
    context: "Making repeated improvements through cycles of development"
  },
  // J-L
  {
    phrase: "jump the shark",
    translation: "decline in quality after peak success",
    keywords: ["jump", "shark", "decline", "quality", "peak"],
    category: "decline",
    alternatives: ["past its prime", "declining quality"],
    context: "When something that was once good starts to decline in quality"
  },
  {
    phrase: "keep me in the loop",
    translation: "keep me informed",
    keywords: ["keep", "loop", "informed", "updated", "communication"],
    category: "communication",
    alternatives: ["keep me updated", "keep me informed"],
    context: "Asking to be included in ongoing communications about a topic"
  },
  {
    phrase: "key performance indicator",
    translation: "metric used to measure success",
    keywords: ["key", "performance", "indicator", "kpi", "metric", "measure"],
    category: "metrics",
    alternatives: ["success metric", "performance measure"],
    context: "A measurable value that demonstrates how effectively objectives are achieved"
  },
  {
    phrase: "key stakeholder",
    translation: "important person affected by decisions",
    keywords: ["key", "stakeholder", "important", "affected"],
    category: "people",
    alternatives: ["important person", "key player"],
    context: "Someone who has significant interest or influence in a project"
  },
  {
    phrase: "lean methodology",
    translation: "eliminating waste to improve efficiency",
    keywords: ["lean", "methodology", "waste", "efficiency", "streamline"],
    category: "methodology",
    alternatives: ["waste elimination", "efficiency improvement"],
    context: "A systematic method for eliminating waste and improving processes"
  },
  {
    phrase: "let's take this offline",
    translation: "discuss this privately or later",
    keywords: ["take", "offline", "private", "later", "separate"],
    category: "communication",
    alternatives: ["discuss privately", "talk separately"],
    context: "Moving a conversation away from a group setting"
  },
  {
    phrase: "leverage",
    translation: "use or take advantage of",
    keywords: ["leverage", "use", "advantage", "utilize"],
    category: "strategy",
    alternatives: ["use", "utilize"],
    context: "Making the most of available resources or opportunities",
    multipleMeanings: [
      {
        translation: "borrow money to invest",
        context: "In finance, using borrowed capital to increase potential returns"
      },
      {
        translation: "mechanical advantage using a lever",
        context: "The original meaning referring to physical leverage with tools"
      }
    ]
  },
  {
    phrase: "low hanging fruit",
    translation: "easy tasks or obvious opportunities",
    keywords: ["low", "hanging", "fruit", "easy", "obvious", "simple"],
    category: "productivity",
    alternatives: ["quick wins", "easy pickings"],
    context: "Often used to describe tasks that require minimal effort for maximum impact"
   },
   {
     phrase: "must win battle",
     translation: "critical initiative that cannot be allowed to fail",
     keywords: ["must", "win", "battle", "critical", "essential", "priority"],
     category: "strategy",
     alternatives: ["critical initiative", "high-stakes priority"],
     context: "A strategic effort so important that failure would have severe consequences"
   },
   // M-O
   {
     phrase: "mindshare",
    translation: "how much people think about your brand",
    keywords: ["mindshare", "awareness", "attention", "brand"],
    category: "marketing",
    alternatives: ["brand awareness", "mental space"],
    context: "The amount of consumer awareness or popularity a brand has"
  },
  {
    phrase: "minimum viable product",
    translation: "basic version with core features",
    keywords: ["minimum", "viable", "product", "mvp", "basic", "core"],
    category: "development",
    alternatives: ["basic version", "prototype"],
    context: "A product with just enough features to satisfy early customers"
  },
  {
    phrase: "move the needle",
    translation: "make a significant impact",
    keywords: ["move", "needle", "impact", "significant", "change"],
    category: "impact",
    alternatives: ["make a difference", "create impact"],
    context: "Refers to actions that create measurable, meaningful change"
  },
  {
    phrase: "net-net",
    translation: "the bottom line or final result",
    keywords: ["net", "bottom", "line", "result", "conclusion"],
    category: "summary",
    alternatives: ["bottom line", "end result"],
    context: "The final outcome after considering all factors"
  },
  {
    phrase: "north star",
    translation: "guiding principle or ultimate goal",
    keywords: ["north", "star", "guiding", "principle", "goal"],
    category: "strategy",
    alternatives: ["guiding principle", "ultimate goal"],
    context: "A fixed point of reference that guides decisions and actions"
  },
  {
    phrase: "on my radar",
    translation: "something I'm aware of or monitoring",
    keywords: ["radar", "aware", "monitoring", "tracking"],
    category: "awareness",
    alternatives: ["on my mind", "I'm tracking"],
    context: "Something that's being watched or considered"
  },
  {
    phrase: "optimize",
    translation: "make as effective as possible",
    keywords: ["optimize", "effective", "improve", "enhance"],
    category: "improvement",
    alternatives: ["improve", "enhance"],
    context: "Making something work as well as it possibly can"
  },
  {
    phrase: "out of pocket",
    translation: "unavailable or unreachable",
    keywords: ["out", "pocket", "unavailable", "unreachable", "away"],
    category: "availability",
    alternatives: ["unavailable", "away"],
    context: "Being temporarily unavailable or unreachable"
  },
  // P-R
  {
    phrase: "paradigm shift",
    translation: "fundamental change in approach",
    keywords: ["paradigm", "shift", "fundamental", "change"],
    category: "change",
    alternatives: ["major change", "new approach"],
    context: "A complete change in the way something is understood or done"
  },
  {
    phrase: "pivot",
    translation: "change direction or strategy",
    keywords: ["pivot", "change", "direction", "strategy", "shift"],
    category: "strategy",
    alternatives: ["change course", "shift strategy"],
    context: "A strategic change in approach, often in response to new information"
  },
  {
    phrase: "proof of concept",
    translation: "demonstration that an idea works",
    keywords: ["proof", "concept", "demonstration", "feasibility", "test"],
    category: "validation",
    alternatives: ["feasibility test", "prototype"],
    context: "A demonstration to verify that certain concepts have potential"
  },
  {
    phrase: "push the envelope",
    translation: "test limits or try something new",
    keywords: ["push", "envelope", "limits", "test", "boundaries"],
    category: "innovation",
    alternatives: ["test boundaries", "be bold"],
    context: "Going beyond conventional limits to achieve something new"
  },
  {
    phrase: "quick win",
    translation: "easy achievement with immediate results",
    keywords: ["quick", "win", "easy", "immediate", "fast"],
    category: "productivity",
    alternatives: ["easy victory", "fast result"],
    context: "Something that can be accomplished quickly with visible benefits"
  },
  {
    phrase: "rightsizing",
    translation: "adjusting to the appropriate size",
    keywords: ["rightsizing", "adjusting", "appropriate", "size"],
    category: "adjustment",
    alternatives: ["resizing", "adjusting size"],
    context: "Making something the correct size for its purpose or situation"
  },
  {
    phrase: "run it up the flagpole",
    translation: "test an idea with others",
    keywords: ["run", "flagpole", "test", "idea", "feedback"],
    category: "validation",
    alternatives: ["test the idea", "get feedback"],
    context: "Presenting an idea to see how others react to it"
  },
  // S-T
  {
    phrase: "scalable",
    translation: "able to grow or expand easily",
    keywords: ["scalable", "grow", "expand", "flexible"],
    category: "growth",
    alternatives: ["expandable", "growth-ready"],
    context: "Something designed to handle increased size or volume"
  },
  {
    phrase: "seamless",
    translation: "smooth and without problems",
    keywords: ["seamless", "smooth", "problems", "easy"],
    category: "quality",
    alternatives: ["smooth", "effortless"],
    context: "Working perfectly without any noticeable issues or interruptions"
  },
  {
    phrase: "solutioning",
    translation: "developing solutions",
    keywords: ["solutioning", "developing", "solutions", "problem", "solving"],
    category: "problem-solving",
    alternatives: ["problem-solving", "developing solutions"],
    context: "The process of creating solutions to problems"
  },
  {
    phrase: "streamline",
    translation: "make more efficient or simpler",
    keywords: ["streamline", "efficient", "simpler", "optimize"],
    category: "efficiency",
    alternatives: ["simplify", "optimize"],
    context: "Removing unnecessary steps or complexity to improve efficiency"
  },
  {
    phrase: "synergy",
    translation: "working together effectively",
    keywords: ["synergy", "together", "collaboration", "teamwork"],
    category: "collaboration",
    alternatives: ["collaboration", "teamwork"],
    context: "The idea that combined efforts produce better results than individual work"
  },
  {
    phrase: "table this",
    translation: "postpone or set aside for later",
    keywords: ["table", "postpone", "later", "delay"],
    category: "planning",
    alternatives: ["postpone", "defer"],
    context: "Deciding to address something at a future time"
  },
  {
    phrase: "take ownership",
    translation: "accept responsibility",
    keywords: ["take", "ownership", "responsibility", "accountable"],
    category: "responsibility",
    alternatives: ["be responsible", "take charge"],
    context: "Accepting full responsibility for something and its outcomes"
  },
  {
    phrase: "think outside the box",
    translation: "be creative or innovative",
    keywords: ["think", "outside", "box", "creative", "innovative"],
    category: "innovation",
    alternatives: ["be creative", "innovate"],
    context: "Encourages unconventional thinking and creative problem-solving"
  },
  {
    phrase: "thought leadership",
    translation: "being recognized as an expert",
    keywords: ["thought", "leadership", "expert", "authority", "influence"],
    category: "expertise",
    alternatives: ["expertise", "industry authority"],
    context: "Being recognized as an authoritative source of innovative ideas"
  },
  {
    phrase: "touch base",
    translation: "check in or communicate briefly",
    keywords: ["touch", "base", "check", "communicate", "brief"],
    category: "communication",
    alternatives: ["check in", "connect"],
    context: "A quick conversation to stay updated or aligned"
  },
  // U-Z
  {
    phrase: "unpack",
    translation: "analyze or examine in detail",
    keywords: ["unpack", "analyze", "examine", "detail"],
    category: "analysis",
    alternatives: ["break down", "analyze"],
    context: "Taking apart complex ideas to understand them better"
  },
  {
    phrase: "user experience",
    translation: "how people interact with a product",
    keywords: ["user", "experience", "ux", "interaction", "usability"],
    category: "design",
    alternatives: ["usability", "user interaction"],
    context: "The overall experience a person has when using a product or service"
  },
  {
    phrase: "value-add",
    translation: "something that provides additional benefit",
    keywords: ["value", "add", "benefit", "additional", "extra"],
    category: "value",
    alternatives: ["added benefit", "extra value"],
    context: "Features or services that provide extra worth beyond the basic offering"
  },
  {
    phrase: "value proposition",
    translation: "the benefit you offer to customers",
    keywords: ["value", "proposition", "benefit", "offer"],
    category: "value",
    alternatives: ["main benefit", "selling point"],
    context: "The primary reason why customers should choose your product or service"
  },
  {
    phrase: "viral coefficient",
    translation: "rate at which users invite others",
    keywords: ["viral", "coefficient", "growth", "referral", "sharing"],
    category: "marketing",
    alternatives: ["referral rate", "sharing rate"],
    context: "A metric measuring how many new users each existing user brings"
  },
  {
    phrase: "wheelhouse",
    translation: "area of expertise or strength",
    keywords: ["wheelhouse", "expertise", "strength", "skill"],
    category: "capability",
    alternatives: ["area of expertise", "strong suit"],
    context: "The area where someone has the most knowledge or skill"
  },
  {
    phrase: "win-win",
    translation: "beneficial for everyone involved",
    keywords: ["win", "beneficial", "everyone", "mutual"],
    category: "collaboration",
    alternatives: ["mutually beneficial", "good for all"],
    context: "A situation where all parties benefit from the outcome"
  },
  {
    phrase: "x-factor",
    translation: "special quality that makes something successful",
    keywords: ["x", "factor", "special", "quality", "success"],
    category: "quality",
    alternatives: ["special quality", "secret ingredient"],
    context: "An indefinable quality that makes someone or something successful"
  },
  {
    phrase: "zero in on",
    translation: "focus specifically on something",
    keywords: ["zero", "in", "focus", "specific", "target"],
    category: "focus",
    alternatives: ["focus on", "target"],
    context: "Directing attention to a specific target or goal"
  } 
];

// Export the buzzwords array for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = buzzwords;
} else if (typeof window !== 'undefined') {
  window.buzzwords = buzzwords;
}

// Make buzzwords available globally for the search engine
if (typeof window !== 'undefined') {
  window.buzzwords = buzzwords;
}
