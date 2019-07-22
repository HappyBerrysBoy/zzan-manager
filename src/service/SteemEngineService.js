import SSC from "sscjs";

const ssc = new SSC("https://api.steem-engine.com/rpc");

export const findTokenBalance = ({
  query = { symbol: "ZZAN" },
  limit = 1000,
  offset = 0,
  indexes = []
}) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      "tokens",
      "balances",
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

export const findAllTokenBalance = async (symbol="ZZAN") => {
  const query = { symbol };
  let result = [];
  const limit = 1000;
  for (let offset = 0; ; offset = offset + limit) {
    const balances = await findTokenBalance({ query, limit, offset });
    result = result.concat(balances);
    if (balances.length < limit) break;
  }
  return result;
};

export const findBuyBook = ({
  query = { symbol: "ZZAN" },
  limit = 1000,
  offset = 0,
  indexes = []
}) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      "market",
      "buyBook",
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
export const findSellBook = ({
  query = { symbol: "ZZAN" },
  limit = 1000,
  offset = 0,
  indexes = []
}) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      "market",
      "sellBook",
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
export const findTradesHistory = ({
  query = { symbol: "ZZAN" },
  limit = 1000,
  offset = 0,
  indexes = []
}) => {
  return new Promise((resolve, reject) => {
    ssc.find(
      "market",
      "tradesHistory",
      query,
      limit,
      offset,
      indexes,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};


export default ssc;
