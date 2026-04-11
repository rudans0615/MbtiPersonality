
export const calculateMbtiMatchTestTestLevel = (score: number) => {
  // AI-generated scoring threshold placeholder
  if (score < 20) return Object.keys(mbtiMatchTestResults)[0];
  if (score < 40) return Object.keys(mbtiMatchTestResults)[1];
  if (score < 60) return Object.keys(mbtiMatchTestResults)[2];
  return Object.keys(mbtiMatchTestResults)[3] || Object.keys(mbtiMatchTestResults)[0];
};

export const mbtiMatchTestResults: Record<string, any> = {
  "typeA": {
    "code": "INTJ",
    "title": "The Architect",
    "description": "Rational, skeptical, and independent, INTJs are strategic thinkers who know how to transform complex theories into complete plans of action.",
    "qualities": [
      "Analytical",
      "Determined",
      "Independent",
      "Visionary"
    ]
  },
  "typeB": {
    "code": "ENFP",
    "title": "The Campaigner",
    "description": "Enthusiastic, creative, and sociable free spirits, ENFPs can always find a reason to smile and bring excitement into any room.",
    "qualities": [
      "Energetic",
      "Innovative",
      "Friendly",
      "Spontaneous"
    ]
  },
  "typeC": {
    "code": "INFJ",
    "title": "The Advocate",
    "description": "Quiet and mystical, yet very inspiring and tireless idealists, INFJs are always looking for ways to better the world around them.",
    "qualities": [
      "Empathic",
      "Insightful",
      "Idealistic",
      "Altruistic"
    ]
  },
  "typeD": {
    "code": "ESTP",
    "title": "The Entrepreneur",
    "description": "Smart, energetic, and perceptive, ESTPs truly enjoy living on the edge and are great at making things happen.",
    "qualities": [
      "Charismatic",
      "Bold",
      "Perceptive",
      "Direct"
    ]
  }
};
