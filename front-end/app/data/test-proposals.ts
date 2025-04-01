import { Proposal } from "../interfaces/proposals";

  export async function getProposals(): Promise<Proposal[]> {
    return testProposals;
  }

 const testProposals: Proposal[] = [
    {
        "id": 1,
        "title": "Implement Weekly Meme Contests",
        "description": "Create a weekly meme competition where holders can submit and vote on the best memes. Winners receive 1000 tokens from the community treasury.",
        "proposer": "ALGO123...789",
        "status": "active",
        "startDate": "2024-03-20T00:00:00Z",
        "endDate": "2024-03-27T00:00:00Z",
        "votesFor": 15000,
        "votesAgainst": 5000,
        "quorum": 20000,
        "category": "Community"
      },
      {
        "id": 2,
        "title": "Partner with DogeCoin for Cross-Chain Memes",
        "description": "Establish a partnership with DogeCoin to create cross-chain meme NFTs and shared liquidity pools.",
        "proposer": "ALGO456...012",
        "status": "closed",
        "startDate": "2024-03-25T00:00:00Z",
        "endDate": "2024-04-01T00:00:00Z",
        "votesFor": 0,
        "votesAgainst": 0,
        "quorum": 50000,
        "category": "Partnership"
      },
      {
        "id": 3,
        "title": "Increase Meme Creation Treasury",
        "description": "Allocate additional 100,000 tokens to the meme creation treasury to incentivize high-quality meme generation.",
        "proposer": "ALGO789...345",
        "status": "closed",
        "startDate": "2024-03-10T00:00:00Z",
        "endDate": "2024-03-17T00:00:00Z",
        "votesFor": 75000,
        "votesAgainst": 25000,
        "quorum": 50000,
        "category": "Treasury"
      },
      {
        "id": 4,
        "title": "Launch Meme NFT Marketplace",
        "description": "Develop and launch a dedicated NFT marketplace for meme-based digital collectibles with special benefits for token holders.",
        "proposer": "ALGO234...567",
        "status": "active",
        "startDate": "2024-03-18T00:00:00Z",
        "endDate": "2024-03-25T00:00:00Z",
        "votesFor": 45000,
        "votesAgainst": 15000,
        "quorum": 40000,
        "category": "Development"
      },
      {
        "id": 5,
        "title": "Implement Meme Staking Rewards",
        "description": "Create a staking mechanism where holders earn extra rewards for creating and sharing memes that gain social media traction.",
        "proposer": "ALGO567...890",
        "status": "active",
        "startDate": "2024-03-15T00:00:00Z",
        "endDate": "2024-03-22T00:00:00Z",
        "votesFor": 30000,
        "votesAgainst": 20000,
        "quorum": 30000,
        "category": "Tokenomics"
      },
      {
        "id": 6,
        "title": "Community Meme Education Program",
        "description": "Fund a program to educate new members about meme creation, crypto basics, and responsible social media practices.",
        "proposer": "ALGO890...123",
        "status": "closed",
        "startDate": "2024-03-28T00:00:00Z",
        "endDate": "2024-04-04T00:00:00Z",
        "votesFor": 0,
        "votesAgainst": 0,
        "quorum": 25000,
        "category": "Education"
      },
      {
        "id": 7,
        "title": "Viral Marketing Campaign",
        "description": "Launch a coordinated marketing campaign on TikTok and Twitter to increase brand awareness and community engagement.",
        "proposer": "ALGO345...678",
        "status": "closed",
        "startDate": "2024-03-05T00:00:00Z",
        "endDate": "2024-03-12T00:00:00Z",
        "votesFor": 65000,
        "votesAgainst": 15000,
        "quorum": 50000,
        "category": "Marketing"
      },
      {
        "id": 8,
        "title": "Reduce Meme Submission Fees",
        "description": "Decrease the token requirement for submitting memes to the DAO from 1000 to 500 tokens to encourage more participation.",
        "proposer": "ALGO901...234",
        "status": "active",
        "startDate": "2024-03-19T00:00:00Z",
        "endDate": "2024-03-26T00:00:00Z",
        "votesFor": 25000,
        "votesAgainst": 35000,
        "quorum": 40000,
        "category": "Governance"
      },
      {
        "id": 9,
        "title": "Meme AI Integration",
        "description": "Integrate AI tools to help community members generate and enhance memes while maintaining creative control.",
        "proposer": "ALGO678...901",
        "status": "closed",
        "startDate": "2024-03-30T00:00:00Z",
        "endDate": "2024-04-06T00:00:00Z",
        "votesFor": 0,
        "votesAgainst": 0,
        "quorum": 60000,
        "category": "Technology"
      },
      {
        "id": 10,
        "title": "Monthly Meme Burning Event",
        "description": "Implement monthly token burning events where the community votes on memes, and winning memes trigger token burns.",
        "proposer": "ALGO012...345",
        "status": "active",
        "startDate": "2024-03-17T00:00:00Z",
        "endDate": "2024-03-24T00:00:00Z",
        "votesFor": 55000,
        "votesAgainst": 25000,
        "quorum": 50000,
        "category": "Tokenomics"
      }
]