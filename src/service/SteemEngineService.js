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

export default ssc;
