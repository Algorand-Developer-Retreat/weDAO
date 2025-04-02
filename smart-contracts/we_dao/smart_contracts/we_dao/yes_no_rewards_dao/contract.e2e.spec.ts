import { AlgorandClient, algos, Config, microAlgo, microAlgos } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, beforeEach, describe, test } from 'vitest'
import { YesNoRewardClient, YesNoRewardFactory } from '../../artifacts/we_dao/yes_no_rewards_dao/YesNoRewardClient'

const fixture = algorandFixture()
Config.configure({ populateAppCallResources: true })

const createProposalMbrValue = 154500

// App clients -------------------------------------------
let daoAppClient: YesNoRewardClient
//--------------------------------------------------------

// Environment clients ------------------------------------
let algorand: AlgorandClient
//--------------------------------------------------------

// Relevant user accounts ------------------------------------
let managerAccount: TransactionSignerAccount
let voterAccount: TransactionSignerAccount
let proposerAccount: TransactionSignerAccount
let voterOneAccount: TransactionSignerAccount
let voterTwoAccount: TransactionSignerAccount
const votingPowerOne = 42000
const votingPowerTwo = 30000
//--------------------------------------------------------

// Proposal data -----------------------------------------
const poolProposalTitle = 'Pool proposal title'
const poolProposalDescription = 'This is the pool proposal description'
const regularProposalTitle = 'Regular proposal title'
const regularProposalDescription = 'This is the regular proposal description'
const expiresIn = 1000n
//--------------------------------------------------------

describe('WeDao contract', () => {
  beforeEach(fixture.newScope)
  beforeAll(async () => {
    await fixture.newScope()

    algorand = AlgorandClient.fromEnvironment()

    managerAccount = await algorand.account.kmd.getOrCreateWalletAccount('manager-account', algos(100))
    voterAccount = await algorand.account.kmd.getOrCreateWalletAccount('voter-account', algos(100))
    algorand.setSignerFromAccount(managerAccount)
    algorand.setSignerFromAccount(voterAccount)

    await algorand.account.ensureFundedFromEnvironment(managerAccount.addr, microAlgo(1000000))

    await algorand.send.payment({
      sender: managerAccount.addr,
      receiver: voterAccount.addr,
      amount: microAlgo(100001), // Send 1 Algo to the new wallet
    })

    const factory = algorand.client.getTypedAppFactory(YesNoRewardFactory, { defaultSender: managerAccount.addr })

    const { appClient } = await factory.send.create.createApplication({ args: [false], sender: managerAccount.addr })

    daoAppClient = appClient
  }, 300000)

  test('Test if manager can create a proposal', async () => {
    const mbrTxn = algorand.createTransaction.payment({
      sender: managerAccount.addr,
      amount: microAlgos(createProposalMbrValue),
      receiver: daoAppClient.appAddress,
      extraFee: microAlgos(1000n),
    })

    const result = await daoAppClient.send.createProposal({
      args: {
        proposalTitle: poolProposalTitle,
        proposalDescription: poolProposalDescription,
        expiresIn: expiresIn,
        mbrTxn: mbrTxn,
      },
      sender: managerAccount.addr,
    })
  })

  test('Test if apllication with rewards got created with anyone can create reward proposal === false', async () => {
    const result = await daoAppClient.appClient.getGlobalState()
    console.log('Global State rewards:', result)
  })

  test('Test if voter can vote on a rewards created proposal', async () => {
    const mbrTxn = algorand.createTransaction.payment({
      sender: voterAccount.addr,
      amount: microAlgos(144900),
      receiver: daoAppClient.appAddress,
      extraFee: microAlgos(1000n),
    })

    await daoAppClient.send.voteProposal({
      args: { proposalId: 1, vote: false, mbrTxn: mbrTxn },
      sender: voterAccount.addr,
    })
  })

  test('get all proposals', async () => {
    const proposalsCount = await daoAppClient.state.global.proposalCount()

    const allProposals = []
    for (let i = 1; i <= proposalsCount!; i++) {
      allProposals.push(await daoAppClient.send.getProposal({ args: { proposalId: i } }))
    }

    console.log('All proposals:', allProposals)
  })
})
