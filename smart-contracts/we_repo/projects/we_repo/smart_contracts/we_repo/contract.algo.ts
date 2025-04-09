import {
  Account,
  arc4,
  assert,
  BoxMap,
  Contract,
  GlobalState,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { ProjectDataType, ProjectIdType } from './config.algo'

export class WeRepo extends Contract {
  // Set global state to trakck manager, total projects and total reputation - total reputation is a gamefied points system for this contract
  manager_address = GlobalState<Account>()
  total_projects = GlobalState<uint64>()
  total_reputation = GlobalState<uint64>()
  total_contribution = GlobalState<uint64>()

  project = BoxMap<ProjectIdType, ProjectDataType>({ keyPrefix: '_p' })

  public createApplication(): void {
    this.manager_address.value = Txn.sender
    this.total_projects.value = 0
    this.total_reputation.value = 0
    this.total_contribution.value = 0
  }

  public createNewProject(projectData: ProjectDataType): void {
    const creatorAddress: Account = Txn.sender

    //Get the box of the current project
    const currentProjectInstance = this.project(new arc4.Address(creatorAddress))

    //Ensure that its one project per address
    assert(!currentProjectInstance.exists, 'Project already exists for this address')

    //Create the project object
    const project: ProjectDataType = new ProjectDataType({
      project_name: projectData.project_name,
      project_description: projectData.project_description,
      project_contribution: new arc4.UintN64(0),
    })

    this.project(new arc4.Address(creatorAddress)).value = project.copy()
  }
}
