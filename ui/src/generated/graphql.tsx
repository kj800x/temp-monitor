import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Blob buffer */
  Blob: any;
  /** Date */
  Date: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Datapoint = {
  __typename?: 'Datapoint';
  date: Scalars['Date'];
  humidity?: Maybe<Scalars['Float']>;
  id: Scalars['Int'];
  temperature: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  record?: Maybe<Datapoint>;
};


export type MutationRecordArgs = {
  date: Scalars['Date'];
  humidity?: Maybe<Scalars['Float']>;
  temperature?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  data: Array<Datapoint>;
  historicalData: Array<Datapoint>;
};


export type QueryHistoricalDataArgs = {
  date: Scalars['Date'];
};

export type Subscription = {
  __typename?: 'Subscription';
  liveTemperature?: Maybe<Datapoint>;
};

export type RecentDataQueryVariables = Exact<{ [key: string]: never; }>;


export type RecentDataQuery = { __typename?: 'Query', data: Array<{ __typename?: 'Datapoint', id: number, date: any, temperature: number, humidity?: Maybe<number> }> };

export type LiveTemperatureSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LiveTemperatureSubscription = { __typename?: 'Subscription', liveTemperature?: Maybe<{ __typename?: 'Datapoint', id: number, date: any, temperature: number, humidity?: Maybe<number> }> };

export type ReferenceDataQueryVariables = Exact<{
  date: Scalars['Date'];
}>;


export type ReferenceDataQuery = { __typename?: 'Query', historicalData: Array<{ __typename?: 'Datapoint', id: number, date: any, temperature: number, humidity?: Maybe<number> }> };


export const RecentDataDocument = gql`
    query recentData {
  data {
    id
    date
    temperature
    humidity
  }
}
    `;

/**
 * __useRecentDataQuery__
 *
 * To run a query within a React component, call `useRecentDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useRecentDataQuery(baseOptions?: Apollo.QueryHookOptions<RecentDataQuery, RecentDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentDataQuery, RecentDataQueryVariables>(RecentDataDocument, options);
      }
export function useRecentDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentDataQuery, RecentDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentDataQuery, RecentDataQueryVariables>(RecentDataDocument, options);
        }
export type RecentDataQueryHookResult = ReturnType<typeof useRecentDataQuery>;
export type RecentDataLazyQueryHookResult = ReturnType<typeof useRecentDataLazyQuery>;
export type RecentDataQueryResult = Apollo.QueryResult<RecentDataQuery, RecentDataQueryVariables>;
export const LiveTemperatureDocument = gql`
    subscription liveTemperature {
  liveTemperature {
    id
    date
    temperature
    humidity
  }
}
    `;

/**
 * __useLiveTemperatureSubscription__
 *
 * To run a query within a React component, call `useLiveTemperatureSubscription` and pass it any options that fit your needs.
 * When your component renders, `useLiveTemperatureSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLiveTemperatureSubscription({
 *   variables: {
 *   },
 * });
 */
export function useLiveTemperatureSubscription(baseOptions?: Apollo.SubscriptionHookOptions<LiveTemperatureSubscription, LiveTemperatureSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<LiveTemperatureSubscription, LiveTemperatureSubscriptionVariables>(LiveTemperatureDocument, options);
      }
export type LiveTemperatureSubscriptionHookResult = ReturnType<typeof useLiveTemperatureSubscription>;
export type LiveTemperatureSubscriptionResult = Apollo.SubscriptionResult<LiveTemperatureSubscription>;
export const ReferenceDataDocument = gql`
    query referenceData($date: Date!) {
  historicalData(date: $date) {
    id
    date
    temperature
    humidity
  }
}
    `;

/**
 * __useReferenceDataQuery__
 *
 * To run a query within a React component, call `useReferenceDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useReferenceDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReferenceDataQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useReferenceDataQuery(baseOptions: Apollo.QueryHookOptions<ReferenceDataQuery, ReferenceDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReferenceDataQuery, ReferenceDataQueryVariables>(ReferenceDataDocument, options);
      }
export function useReferenceDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReferenceDataQuery, ReferenceDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReferenceDataQuery, ReferenceDataQueryVariables>(ReferenceDataDocument, options);
        }
export type ReferenceDataQueryHookResult = ReturnType<typeof useReferenceDataQuery>;
export type ReferenceDataLazyQueryHookResult = ReturnType<typeof useReferenceDataLazyQuery>;
export type ReferenceDataQueryResult = Apollo.QueryResult<ReferenceDataQuery, ReferenceDataQueryVariables>;