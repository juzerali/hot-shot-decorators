import {StatsD} from "hot-shots";
import {spy} from "ts-mockito";
import {
    IncrementAfterWrapper,
    IncrementAroundWrapper,
    IncrementBeforeWrapper,
    IncrementOnErrorWrapper
} from "./counter";
import {
    HistogramAfterWrapper,
    HistogramAroundWrapper,
    HistogramBeforeWrapper,
    HistogramOnErrorWrapper
} from "./histogram";

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

export const IncrementBefore = IncrementBeforeWrapper(statsdClient);
export const IncrementAfter = IncrementAfterWrapper(statsdClient);
export const IncrementOnError = IncrementOnErrorWrapper(statsdClient);
export const IncrementAround = IncrementAroundWrapper(statsdClient);

export const HistogramBefore = HistogramBeforeWrapper(statsdClient);
export const HistogramAfter = HistogramAfterWrapper(statsdClient);
export const HistogramOnError = HistogramOnErrorWrapper(statsdClient);
export const HistogramAround = HistogramAroundWrapper(statsdClient);

