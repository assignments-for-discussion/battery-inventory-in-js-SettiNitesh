const assert = require("assert");

/* Centralized place to change once to reflect in entire file */
const HEALTH = {
  HEALTHY: "healthy",
  EXCHANGE: "exchange",
  FAILED: "failed",
};

function countBatteriesByHealth(presentCapacities) {
  const RATED_CAPACITY = 120;

  const counts = {
    [HEALTH.HEALTHY]: 0,
    [HEALTH.EXCHANGE]: 0,
    [HEALTH.FAILED]: 0,
  };

  return presentCapacities.reduce((acc, capacity) => {
    const soh = (100 * capacity) / RATED_CAPACITY;

    if (soh > 83) {
      acc[HEALTH.HEALTHY]++;
    } else if (soh >= 63) {
      acc[HEALTH.EXCHANGE]++;
    } else {
      acc[HEALTH.FAILED]++;
    }

    return acc;
  }, counts);
}

function testBucketingByHealth() {
  console.log("Counting batteries by SoH...");
  const presentCapacities = [113, 116, 80, 95, 92, 70];
  let counts = countBatteriesByHealth(presentCapacities);
  assert(counts[HEALTH.HEALTHY] === 2);
  assert(counts[HEALTH.EXCHANGE] === 3);
  assert(counts[HEALTH.FAILED] === 1);
  console.log("Done counting :)");

  /* Just above 83% -> healthy (102 Ah = 85%) */
  counts = countBatteriesByHealth([102]);
  assert(counts[HEALTH.HEALTHY] === 1);

  /* Exactly 83% SoH -> exchange (99.6 Ah, but float-safe: 100 Ah = 83.3% > 83 -> healthy)
   99 Ah = 82.5% -> exchange */
  counts = countBatteriesByHealth([99]);
  assert(counts[HEALTH.EXCHANGE] === 1);

  /* Just above 63% -> exchange (76.8 Ah = 64%) */
  counts = countBatteriesByHealth([76.8]);
  assert(counts[HEALTH.EXCHANGE] === 1);

  /* Below 63% -> failed (72 Ah = 60%) */
  counts = countBatteriesByHealth([72]);
  assert(counts[HEALTH.FAILED] === 1);

  /* All Failed */
  counts = countBatteriesByHealth([50, 40, 30]);
  assert(counts[HEALTH.FAILED] === 3);

  /* All Healthy */
  counts = countBatteriesByHealth([120, 110, 105]);
  assert(counts[HEALTH.HEALTHY] === 3);

  /* Empty input */
  counts = countBatteriesByHealth([]);
  assert(
    counts[HEALTH.HEALTHY] === 0 &&
      counts[HEALTH.EXCHANGE] === 0 &&
      counts[HEALTH.FAILED] === 0,
  );

  console.log("All Tests passed!");
}

testBucketingByHealth();
