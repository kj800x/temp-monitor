import DataLoader from "dataloader";
import { JWT_RESULT } from "../schema";
import { DatapointLoaderType } from "./Datapoint";

export type DataLoaders = {
  Datapoint: DataLoader<number, DatapointLoaderType>;
};

export type Context = {
  loaders: DataLoaders;
  auth: JWT_RESULT;
};

export type NoLoaderDomainObject<ObjectType, LoaderType> = {
  resolver: {
    [key in keyof ObjectType]:
      | ((
          loadedObject: LoaderType,
          args: any,
          context: Context
        ) => Promise<ObjectType[key]>)
      | ((
          loadedObject: LoaderType,
          args: any,
          context: Context
        ) => ObjectType[key]);
  };
};

export type DomainObject<ObjectType, LoaderType> = NoLoaderDomainObject<
  ObjectType,
  LoaderType
> & {
  loader: (id: readonly number[]) => Promise<LoaderType[]>;
};
