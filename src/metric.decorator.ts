import {StatsD} from "hot-shots";
import {spy} from "ts-mockito";
import {MetricDecoratorWrapper} from "./metric.decorator.wrapper";

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
        service: "my-service"
    }
}

export const statsdClient = new StatsD(hotShotConfig);

/**
 * Skip the following line from your setup, this is only for tests.
 */
export const mockedStatsD = spy(statsdClient);
const wrapper = new MetricDecoratorWrapper(statsdClient);

export const IncrementBefore = wrapper.incBefore();
export const IncrementAfter = wrapper.incAfter();
export const IncrementOnError = wrapper.incOnError();
export const IncrementAround = wrapper.incAround();

export const HistogramBefore = wrapper.histogramBefore();
export const HistogramAfter = wrapper.histogramAfter();
export const HistogramOnError = wrapper.histogramOnError();
export const HistogramAround = wrapper.histogramAround();

