

# weDAO 🗳️

A lightweight, fully open-source DAO frontend built on **Algorand**, enabling communities to create and vote on proposals with ease. Designed to be fun, bright, and modular, **weDAO** can be used by *any* token project or DAO.

---

## ✨ Features

- ✅ **Vote on Open Proposals**  
  Users can review active proposals and cast their votes directly from the interface using their Algorand wallet.

- 📝 **Create New Proposals**  
  DAO members can submit new proposals, specifying a title, description, and voting period.

- 📜 **View Past Proposals**  
  Explore the history of passed, failed, or expired proposals with full transparency.

- ⚙️ **Project Token Configurable**  
  DAO creators can configure the app to support their own token (meme coins, base assets, or community governance tokens).

---

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS (v3)
- **Blockchain:** Algorand Smart Contracts
- **Wallet Support:** Pera Wallet, Defly and Lute.

---

## In Depth
For in depth information on each part of the project please refer to the individual README.md files within each directory
- **Front-End:** [front-end/README.md](./front-end/README.md)
- **Smart Contracts:** [smart-contracts/we_dao/README.md](./smart-contracts/we_dao/README.md)

---

## 🚀 Getting Started - Front End

Clone the repository and navigate to the front-end directory:

```bash
git clone https://github.com/Algorand-Developer-Retreat/weDAO.git
cd weDAO/front-end
```

### Environment Setup

1. **Create a `.env` file:**  
   Copy details from `env.example` (or `env.nfd.example` / `env.monko.example`) and update the following environment variable keys with your color scheme (all values are hex codes):

   ```env
   VITE_COLOR_BACKGROUND=
   VITE_COLOR_PRIMARY=
   VITE_COLOR_SECONDARY=
   VITE_COLOR_ACCENT=
   VITE_COLOR_YES=
   VITE_COLOR_NO=
   VITE_COLOR_SURFACE=
   VITE_COLOR_TEXT=
   VITE_COLOR_HEADING=
   VITE_COLOR_VOTE=
   ```

   *Tip: You may wish to ask your favorite LLM for help selecting colors!*

2. **Update Project Information:**  
   Modify the environment variables with your project details:

   ```env
   VITE_PROJECT_NAME=
   VITE_PROJECT_DESCRIPTION=
   VITE_PROJECT_DISCORD_URL=
   VITE_PROJECT_TWITTER_URL=
   VITE_PROJECT_GITHUB_URL=
   VITE_DAO_TOKEN_IMAGE_URL=
   ```

*Note: The final part of the setup requires the smart contracts to be deployed. We'll come back to that in a moment.*

---

## Smart Contract Deployment

weDAO uses two smart contracts - a simple poll contract and a reward-backed poll contract. You're free to use one or the other, or both!

### Steps to Deploy:

1. **Go to [lora.algokit.io](https://lora.algokit.io)**  
   Connect your wallet (this will be the manager of the contract and won’t be able to vote on proposals).

2. **Navigate to "App Lab":**  
   - Click **"Create"** on the Create App Interface.
   - Click **"Deploy New"**.

3. **Upload Contract File:**  
   You will be asked to upload the ARC32 or ARC56 JSON file for the contract you wish to deploy. The files are located at:
   
   - **Simple Poll:**  
     `smart-contracts/we_dao/smart_contracts/artifacts/we_dao/yes_no_dao/YesNoDao.arc56.json`
   - **Rewards Poll:**  
     `smart-contracts/we_dao/smart_contracts/artifacts/we_dao/yes_no_rewards_dao/YesNoReward.arc56.json`

4. **Name and Configure the Contract:**  
   - Name the contract (this is for display within LORA so you can easily identify it).
   - Choose a version if desired, then click **"Next"**.

5. **Finalize Deployment:**  
   - Click the **"call()"** button next to **"createApplication"**.
   - A modal will appear where you can input the necessary transaction details.  
     The key selection is **anyone_can_create**:  
     - Set to `true` if any user can create proposals.
     - Set to `false` if only the manager (the account creating the application) can create proposals.  
     This setting can be changed later if needed.
   - Send and sign the transactions.

6. **Record the Application IDs:**  
   Copy the `appId` for each deployed contract into your environment variables:

   - **Simple Polls:**  
     ```env
     VITE_DAO_CONTRACT_APP_ID=
     ```
   - **Reward Polls:**  
     ```env
     VITE_REWARD_CONTRACT_APP_ID=
     ```
  7. **Fund contract**
  We advise funding the contracts with 1 Algo to cover internal balances

---

## Running the Front End Locally

Once the contracts are deployed and your `.env` file is configured, you can run the front end locally:

```bash
cd weDAO/front-end
npm run dev
```

---

Happy building your own DAO!

