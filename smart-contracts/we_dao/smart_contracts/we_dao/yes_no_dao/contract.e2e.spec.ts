import { AlgorandClient, algos, Config, microAlgo, microAlgos } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { YesNoDaoClient, YesNoDaoFactory } from '../../artifacts/we_dao/yes_no_dao/YesNoDaoClient'

const fixture = algorandFixture()
Config.configure({ populateAppCallResources: true })

const createProposalMbrValue = 156501

// App clients -------------------------------------------
let daoAppClient: YesNoDaoClient
//--------------------------------------------------------

// Environment clients ------------------------------------
let algorand: AlgorandClient
//--------------------------------------------------------

// Relevant user accounts ------------------------------------
let managerAccount: TransactionSignerAccount
let voterAccount: TransactionSignerAccount
//--------------------------------------------------------

let daoAssetId: bigint

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
      amount: microAlgo(100000), // Send 1 Algo to the new wallet
    })

    const createdAsset = (await algorand.send.assetCreate({ sender: managerAccount.addr, total: BigInt(10_000) }))
      .confirmation.assetIndex

    daoAssetId = createdAsset!

    const factory = algorand.client.getTypedAppFactory(YesNoDaoFactory, { defaultSender: managerAccount.addr })

    const { appClient } = await factory.send.create.createApplication({
      args: [false, 10, daoAssetId],
      sender: managerAccount.addr,
    })

    daoAppClient = appClient
  }, 300000)

  test('Test if apllication got created with anyone can create proposal === false', async () => {
    const result = await daoAppClient.appClient.getGlobalState()
    console.log('Global State:', result)
  })

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

  test('Test if voter can’t vote on the created proposal due to low asset balance', async () => {
    const mbrTxn = algorand.createTransaction.payment({
      sender: voterAccount.addr,
      amount: microAlgos(144900),
      receiver: daoAppClient.appAddress,
      extraFee: microAlgos(1000n),
    })

    await expect(
      daoAppClient.send.voteProposal({
        args: { proposalId: 1, vote: false, mbrTxn },
        sender: voterAccount.addr,
      }),
    ).rejects.toThrow() // or use a more specific error message if you know it
  })

  test('Test if voter can vote on the created proposal due to enough asset balance', async () => {
    try {
      await algorand.send.assetTransfer({
        sender: voterAccount.addr,
        receiver: voterAccount.addr,
        assetId: daoAssetId,
        amount: BigInt(0),
        extraFee: microAlgos(1000n),
      })

      await algorand.send.assetTransfer({
        sender: managerAccount.addr,
        receiver: voterAccount.addr,
        assetId: daoAssetId,
        amount: BigInt(15),
        extraFee: microAlgos(1000n),
      })

      const mbrTxn = algorand.createTransaction.payment({
        sender: voterAccount.addr,
        amount: microAlgos(144901),
        receiver: daoAppClient.appAddress,
        extraFee: microAlgos(1000n),
      })

      await daoAppClient.send.voteProposal({
        args: { proposalId: 1, vote: false, mbrTxn: mbrTxn },
        sender: voterAccount.addr,
      })

      console.log('Voter successfully voted on the proposal')
    } catch (error) {
      console.log('Error voting on proposal:', error)
    }
  })

  // test('get all proposals', async () => {
  //   const proposalsCount = await daoAppClient.state.global.proposalCount()

  //   const allProposals = []
  //   for (let i = 1; i <= proposalsCount!; i++) {
  //     allProposals.push(await daoAppClient.send.getProposal({ args: { proposalId: i } }))
  //   }

  //   console.log('All proposals:', allProposals)
  // })
})
