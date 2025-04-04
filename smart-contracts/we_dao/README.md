# weDAO Smart Contracts

This directory contains the smart contracts for the weDAO platform, implementing decentralized autonomous organization (DAO) functionality on the Algorand blockchain.

## Contract Architecture

The smart contracts are organized into two main components:

```
we_dao/
├── yes_no_dao/              # Basic DAO with Yes/No voting
│   ├── YesNoContract.algo.ts    # Main DAO contract
│   ├── config.algo.ts           # Contract configuration
│   └── contract.e2e.spec.ts     # End-to-end tests
├── yes_no_rewards_dao/      # DAO with rewards functionality
│   ├── YesNoReward.algo.ts      # Rewards DAO contract
│   ├── config.algo.ts           # Contract configuration
│   └── contract.e2e.spec.ts     # End-to-end tests
└── deploy-config.ts         # Deployment configuration
```

## Smart Contract Features

### Yes/No DAO Contract

The basic DAO contract (`YesNoContract.algo.ts`) implements the following features:

1. **Proposal Management**
   - Create proposals with title, description, and expiry time
   - Only manager or authorized users can create proposals (configurable)
   - Proposal tracking with unique IDs

2. **Voting System**
   - Binary (Yes/No) voting mechanism
   - One vote per user per proposal
   - Vote tracking and tallying
   - Prevention of duplicate votes

3. **Asset-Based Voting Power**
   - Minimum token holding requirement for voting
   - Asset ID configuration for governance token
   - Manager cannot participate in voting

4. **State Management**
   - Global state for contract configuration
   - Box storage for proposals and votes
   - Proposal and vote data structures

### Yes/No Rewards DAO Contract

Extended version of the basic DAO with additional rewards functionality (`YesNoReward.algo.ts`).

## Contract States

### Global State Variables
- `manager_address`: Contract administrator address
- `proposal_count`: Total number of proposals
- `anyone_can_create`: Flag for proposal creation permissions
- `asset_id`: Governance token asset ID
- `minimum_holding`: Minimum token requirement for voting

### Box Storage
- Proposal boxes (prefix: '_p')
- Vote boxes (prefix: '_v')

## Key Methods

### YesNoDao Contract

1. **createApplication**
   ```typescript
   createApplication(
     anyone_can_create: boolean,
     minimum_holding: uint64,
     asset_id: uint64
   )
   ```
   Initializes the DAO contract with basic configuration.

2. **createProposal**
   ```typescript
   createProposal(
     proposal_title: string,
     proposal_description: string,
     expires_in: uint64,
     mbr_txn: gtxn.PaymentTxn
   )
   ```
   Creates a new proposal in the DAO.

3. **voteProposal**
   ```typescript
   voteProposal(
     proposal_id: uint64,
     vote: boolean,
     mbr_txn: gtxn.PaymentTxn
   )
   ```
   Allows users to cast votes on proposals.

## Deployment

The contracts can be deployed using the provided deployment configuration in `deploy-config.ts`. The deployment process:

1. Creates the application
2. Funds the application account
3. Initializes the contract state

Example deployment command:
```bash
algokit deploy
```

## Security Considerations

1. **Access Control**
   - Manager-only functions
   - Token holding requirements
   - Vote duplication prevention

2. **Resource Management**
   - MBR (Minimum Balance Requirement) handling
   - Box storage optimization

3. **Time Constraints**
   - Proposal expiration enforcement
   - Timestamp validation

## Testing

Comprehensive end-to-end tests are provided for both contracts:
- `yes_no_dao/contract.e2e.spec.ts`
- `yes_no_rewards_dao/contract.e2e.spec.ts`

Run tests using:
```bash
npm test
```
