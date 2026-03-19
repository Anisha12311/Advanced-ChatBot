const SnowflakeId = require("snowflake-id").default;

const snowflake = new SnowflakeId({
  mid: 42,
  offset: (2019 - 1970) * 31536000 * 1000,
});

function generateSnowflakeId() {
  return snowflake.generate().toString();
}

module.exports = { generateSnowflakeId };
