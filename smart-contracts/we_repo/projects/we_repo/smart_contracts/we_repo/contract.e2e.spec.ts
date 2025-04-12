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
    projectCreatorAccount = await algorand.account.kmd.getOrCreateWalletAccount('PROJECT-CREATOR')
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
  }, 3000000)

  test('see if test runs', async () => {
    console.log('algorand', algorand)
    const result = await weRepoClient.appClient.getGlobalState()
    console.log('result', result.manager_address)
  })

  test('see if were able to create a new project', async () => {
    const project = await weRepoClient.send.createNewProject({
      args: ['Test project', 'Test project'],
      sender: projectCreatorAccount.addr,
    })

    const dapps = await weRepoClient.send.addNewDappsToProject({
      args: [[1, 2, 3]],
      sender: projectCreatorAccount.addr,
    })

    console.log('dapps', dapps.returns)
  })
})
