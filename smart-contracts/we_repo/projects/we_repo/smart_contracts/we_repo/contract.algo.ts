import {
  Account,
  arc4,
  assert,
  BoxMap,
  Contract,
  GlobalState,
  Txn,
  Uint64,
  uint64,
} from '@algorandfoundation/algorand-typescript'

import { abimethod } from '@algorandfoundation/algorand-typescript/arc4'

import { ProjectDataType, ProjectIdType } from './config.algo'

export class WeRepo extends Contract {
  // Set global state to trakck manager, total projects and total reputation - total reputation is a gamefied points system for this contract
  manager_address = GlobalState<Account>()
  total_projects = GlobalState<uint64>()
  total_reputation = GlobalState<uint64>()
  total_contribution = GlobalState<uint64>()
  pong = GlobalState<string>()

  project = BoxMap<ProjectIdType, ProjectDataType>({ keyPrefix: '_p' })

  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {
    this.manager_address.value = Txn.sender
    this.total_projects.value = 0
    this.total_reputation.value = 0
    this.total_contribution.value = 0
    this.pong.value = ''
  }

  public ping(ping: string): void {
    this.pong.value = ping
  }

  public createNewProject(projectName: string, projectDescription: string): void {
    const creatorAddress: Account = Txn.sender

    // Get the box of the current project
    const currentProjectInstance = this.project(new arc4.Address(creatorAddress))

    // Ensure that its one project per address
    assert(!currentProjectInstance.exists, 'Project already exists for this address')

    // Create the project object
    const project: ProjectDataType = new ProjectDataType({
      project_name_and_description: new arc4.Str(`${projectName};${projectDescription}`),
      project_contribution: new arc4.UintN64(0),
      project_dapps: new arc4.DynamicArray<arc4.UintN64>(),
    })

    this.total_projects.value = Uint64(this.total_projects.value + 1)

    this.project(new arc4.Address(creatorAddress)).value = project.copy()
  }

  public addNewDappsToProject(dappIds: uint64[], creatorAddress: string): void {
    const currentProjectInstance = this.project(new arc4.Address(creatorAddress))

    //Is the sender the project manager? - Yes for the current project INSTANCE
    assert(currentProjectInstance.exists, 'Project does not exist for this address')

    // Create the project object
    const project: ProjectDataType = new ProjectDataType({
      project_name_and_description: currentProjectInstance.value.project_name_and_description,
      project_contribution: currentProjectInstance.value.project_contribution,
      project_dapps: currentProjectInstance.value.project_dapps.copy(), // Add .copy() here
    })

    // Add the dapp ids to the project using for...of loop
    for (const dappId of dappIds) {
      project.project_dapps.push(new arc4.UintN64(dappId))
    }

    this.project(new arc4.Address(Txn.sender)).value = project.copy()
  }
}
