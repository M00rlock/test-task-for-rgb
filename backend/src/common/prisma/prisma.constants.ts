export const CLIENT_LIST_ORDER_BY_CREATED_AT_DESC = {
  createdAt: "desc"
} as const;

export const CLIENT_WITH_DEALS_INCLUDE = {
  deals: {
    orderBy: {
      createdAt: "desc"
    }
  }
} as const;

export const DEAL_WITH_CLIENT_INCLUDE = {
  client: true
} as const;
