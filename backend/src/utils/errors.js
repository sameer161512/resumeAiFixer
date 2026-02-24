function isMongoDuplicateKeyError(err) {
  return err?.code === 11000;
}

module.exports = { isMongoDuplicateKeyError };