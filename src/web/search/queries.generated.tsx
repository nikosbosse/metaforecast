import * as Types from '../../graphql/types.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type QuestionFragment = { __typename?: 'Question', id: string, url: string, title: string, description: string, timestamp: number, visualization?: string | null, options: Array<{ __typename?: 'ProbabilityOption', name?: string | null, probability?: number | null }>, platform: { __typename?: 'Platform', id: string, label: string }, qualityIndicators: { __typename?: 'QualityIndicators', stars: number, numForecasts?: number | null, numForecasters?: number | null, volume?: number | null, spread?: number | null, sharesVolume?: number | null, openInterest?: number | null, liquidity?: number | null, tradeVolume?: number | null } };

export type FrontpageQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FrontpageQuery = { __typename?: 'Query', result: Array<{ __typename?: 'Question', id: string, url: string, title: string, description: string, timestamp: number, visualization?: string | null, options: Array<{ __typename?: 'ProbabilityOption', name?: string | null, probability?: number | null }>, platform: { __typename?: 'Platform', id: string, label: string }, qualityIndicators: { __typename?: 'QualityIndicators', stars: number, numForecasts?: number | null, numForecasters?: number | null, volume?: number | null, spread?: number | null, sharesVolume?: number | null, openInterest?: number | null, liquidity?: number | null, tradeVolume?: number | null } }> };

export type SearchQueryVariables = Types.Exact<{
  input: Types.SearchInput;
}>;


export type SearchQuery = { __typename?: 'Query', result: Array<{ __typename?: 'Question', id: string, url: string, title: string, description: string, timestamp: number, visualization?: string | null, options: Array<{ __typename?: 'ProbabilityOption', name?: string | null, probability?: number | null }>, platform: { __typename?: 'Platform', id: string, label: string }, qualityIndicators: { __typename?: 'QualityIndicators', stars: number, numForecasts?: number | null, numForecasters?: number | null, volume?: number | null, spread?: number | null, sharesVolume?: number | null, openInterest?: number | null, liquidity?: number | null, tradeVolume?: number | null } }> };

export const QuestionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Question"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Question"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"probability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"platform"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"qualityIndicators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stars"}},{"kind":"Field","name":{"kind":"Name","value":"numForecasts"}},{"kind":"Field","name":{"kind":"Name","value":"numForecasters"}},{"kind":"Field","name":{"kind":"Name","value":"volume"}},{"kind":"Field","name":{"kind":"Name","value":"spread"}},{"kind":"Field","name":{"kind":"Name","value":"sharesVolume"}},{"kind":"Field","name":{"kind":"Name","value":"openInterest"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"}},{"kind":"Field","name":{"kind":"Name","value":"tradeVolume"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visualization"}}]}}]} as unknown as DocumentNode<QuestionFragment, unknown>;
export const FrontpageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Frontpage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"result"},"name":{"kind":"Name","value":"frontpage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}},...QuestionFragmentDoc.definitions]} as unknown as DocumentNode<FrontpageQuery, FrontpageQueryVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"result"},"name":{"kind":"Name","value":"searchQuestions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Question"}}]}}]}},...QuestionFragmentDoc.definitions]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;