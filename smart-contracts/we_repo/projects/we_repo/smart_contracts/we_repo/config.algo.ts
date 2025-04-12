import { arc4 } from '@algorandfoundation/algorand-typescript'

export class ProjectDataType extends arc4.Struct<{
  project_contribution: arc4.UintN64
  project_dapps: arc4.DynamicArray<arc4.UintN64>
  project_name_and_description: arc4.Str
}> {}

// I will use the address as the key here to enable only One project per address into the registry
export type ProjectIdType = arc4.Address
