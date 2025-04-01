import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { Address } from 'algosdk'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { WeDaoFactory } from '../../artifacts/we_dao/yes_no_dao/WeDaoClient'

describe('WeDao contract', () => {
  const localnet = algorandFixture()
  beforeAll(() => {
    Config.configure({
      debug: true,
      // traceAll: true,
    })
    registerDebugEventHandlers()
  })
  beforeEach(localnet.newScope)

  const deploy = async (account: Address) => {
    const factory = localnet.algorand.client.getTypedAppFactory(WeDaoFactory, {
      defaultSender: account,
    })

    const { appClient } = await factory.send.create.createApplication({ args: [false] })
    return { client: appClient }
  }

  test('Test if apllication got created woth anyone can vote === false', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy(testAccount)
    const result = await client.appClient.getGlobalState()
    console.log('Global State:', result)
  })
})
