// types/council.ts
export interface CouncilDebate {
  id: string;
  dilemma: string;
  createdAt: string;
  mentorResponses: {
    machiavelli: string;
    napoleon: string;
    aurelius: string;
  };
  verdict: string;
}
