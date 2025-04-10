import { AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { beforeAll, beforeEach, describe, test } from 'vitest'
import { WeRepoClient, WeRepoFactory } from '../artifacts/we_repo/WeRepoClient'

const fixture = algorandFixture()

let algorand: AlgorandClient
let managerAccount: TransactionSignerAccount
let projectCreatorAccount: TransactionSignerAccount
let weRepoClient: WeRepoClient
describe('WeRepo contract', async () => {
  beforeEach(fixture.newScope)
  beforeAll(async () => {
    await fixture.newScope()
    algorand = AlgorandClient.fromEnvironment()

    managerAccount = await algorand.account.kmd.getOrCreateWalletAccount('MANAGER-ACCOUNT')
    projectCreatorAccount = await algorand.account.kmd.getOrCreateWalletAccount('PROJECT-CREATOR-ACCOUNT')
    algorand.setSignerFromAccount(managerAccount)
    algorand.setSignerFromAccount(projectCreatorAccount)
    algorand.account.ensureFundedFromEnvironment(managerAccount.addr, microAlgo(10000000000))

    await algorand.send.payment({
      sender: managerAccount.addr,
      receiver: projectCreatorAccount.addr,
      amount: microAlgo(1000000),
    })

    const factory = algorand.client.getTypedAppFactory(WeRepoFactory, { defaultSender: managerAccount.addr })

    const { appClient } = await factory.send.create.createApplication({ args: [], sender: managerAccount.addr })
    weRepoClient = appClient

    await algorand.send.payment({
      sender: managerAccount.addr,
      receiver: appClient.appAddress,
      amount: microAlgo(1000000), // Send 1 Algo to the new wallet
    })
  })

  test('see if test runs', async () => {
    console.log('algorand', algorand)
    const result = await weRepoClient.appClient.getGlobalState()
    console.log('result', result.manager_address)
  })

  test('see if were able to create a new project', async () => {
    await weRepoClient.send.createNewProject({
      args: [{ projectName: 'Test project', projectContribution: BigInt(0), projectDescription: 'some fuck' }],
      sender: projectCreatorAccount.addr,
    })
  })
})
