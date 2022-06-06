import { StatsD } from "hot-shots";
import { spy } from "ts-mockito";

import { MetricDecoratorGenerator } from "./metric.decorator.generator";

/**
 * Copy this file in your project and make necessary changes
 */

/**
 * Setup hotshot config as per your environment
 */
const hotShotConfig = {
  host: process.env.DOGSTATSD_SERVER || "localhost",
  port: process.env.DOGSTATSD_PORT ? +process.env.DOGSTATSD_PORT : 8125,
  globalTags: {
    env: process.env.NODE_ENV || "development",
    service: "my-service",
  },
};

export const statsdClient = new StatsD(hotShotConfig);

/**
 * Skip the following line from your setup, this is only for tests.
 */
export const mockedStatsD = spy(statsdClient);
const generator = new MetricDecoratorGenerator(statsdClient);

export const IncrementBefore = generator.incBefore();
export const IncrementAfter = generator.incAfter();
export const IncrementOnError = generator.incOnError();
export const IncrementAround = generator.incAround();

export const HistogramBefore = generator.histogramBefore();
export const HistogramAfter = generator.histogramAfter();
export const HistogramOnError = generator.histogramOnError();
export const HistogramAround = generator.histogramAround();
