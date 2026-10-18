import type { ApiClient, ApiQueryValue } from './requestClient';

export interface LeaderboardEntry {
  readonly id: string;
  readonly playerName: string;
  readonly score: number;
  readonly rank: number;
  readonly createdAt?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface LeaderboardQuery {
  readonly competition?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface LeaderboardService {
  getLeaderboard(query?: LeaderboardQuery): Promise<readonly LeaderboardEntry[]>;
}

export interface LeaderboardDataSource {
  getLeaderboard(query?: LeaderboardQuery): Promise<readonly LeaderboardEntry[]>;
}

/**
 * Create a service around a future Supabase or HTTP data source.
 * Without a data source this is an intentional, local empty implementation;
 * constructing or importing the default service never performs I/O.
 */
export const createLeaderboardService = (
  dataSource?: LeaderboardDataSource,
): LeaderboardService => {
  if (dataSource) {
    return {
      getLeaderboard: (query) => dataSource.getLeaderboard(query),
    };
  }

  return {
    getLeaderboard: async () => [],
  };
};

const toQuery = (query: LeaderboardQuery | undefined): Readonly<Record<string, ApiQueryValue>> => {
  if (!query) {
    return {};
  }

  return {
    competition: query.competition,
    limit: query.limit,
    offset: query.offset,
  };
};

/**
 * Optional HTTP adapter kept behind the same typed service boundary. It only
 * calls the supplied client when getLeaderboard is explicitly invoked.
 */
export const createHttpLeaderboardService = (
  client: ApiClient,
  endpoint = '/leaderboard',
): LeaderboardService => ({
  getLeaderboard: (query) =>
    client.get<readonly LeaderboardEntry[]>(endpoint, {
      query: toQuery(query),
    }),
});

/** Safe default for the current app until a real data source is selected. */
export const leaderboardService = createLeaderboardService();
