# hot-shots-decorators

Provides decorators for reporting metrics using statsd.

## Build
```shell script
npm install
npm test
```

## Usage guide
#### Add dependency
```shell script
npm install --save hot-shots-decorators
```

#### Create decorators
`metrics.decorators.ts`

```typescript
import { StatsD } from 'hot-shots';
import {
  IncrementAfterWrapper,
  IncrementAroundWrapper,
  IncrementBeforeWrapper,
  IncrementOnErrorWrapper,
} from './counter';

const hotShotConfig = {
    host: process.env.DOGSTATSD_SERVER || "localhost",
    port: process.env.DOGSTATSD_PORT || 8125,
    globalTags: {
        env: process.env.NODE_ENV,
        service: "my-service"
    }
}

const client = new StatsD(hotShotConfig);

export const IncrementBefore = IncrementBeforeWrapper(client);
export const IncrementAfter = IncrementAfterWrapper(client);
export const IncrementOnError = IncrementOnErrorWrapper(client);
export const IncrementAround = IncrementAroundWrapper(client);
```
*NOTE: The decorators will never throw any error and fail silently, in most cases defaulting to value 1*
#### Add decorators to methods

```typescript
import {
    IncrementBefore,
    IncrementAfter,
    IncrementOnError,
    IncrementAround,
} from './metrics.decorators'

class MyService {

    @IncrementBefore()
    public incrementBeforeDefaults() {
        // increments MyService.incrementBeforeDefaults with value 1 before the method is executed
    }

    @IncrementAfter("my.metric", 2, {type: "Payout", gateway: "Stripe"})
    public incrementAfterCustom() {
        // increments "my.metric" with value 2 and tags 'type:Payout' and 'gateway:Stripe' after method is 
        // successfully executed
    }
    
    @IncrementOnError("arg.metric", "1.a.deeply.nested.property")
    public incrementOnErrorWithArgs(arg1, arg2, arg3) {
        // increments "arg.metric" when the method throws
        // value is derived from path a.deeply.nested.path from arg2 
        // The prefix `1` in "1.a.deeply.nested.property" is index of argument in target method, which in this case is arg2.
    }
    
    @IncrementAround("around", "1.a.deeply.nested.property")
    public incrementOnErrorWithArgs(arg1, arg2, arg3) {
        // increments "around.attempted" metric with value derived from path a.deeply.nested.path from arg2
        // If the method call is successful, "around.success" is incremented with the same value
        // If the method call throws, "around.failure" is incremented with the same value
    }

    @IncrementAfter("payment_failed", (payment: PaymentDto) => payment.amount)
    public incrementOnErrorWithArgs(payment: PaymentDto) {
        // increments "payment_done" metric after the method call completes successfully 
        // value derived from lambda function passed as value. 
        // The lambda function receives same arguments as the target method
    }

}
```

## Derived values
Values can be following

#### Constant number
Examples: `1`, `2`, `100`, `-20`
The value will be used literally to increment the counter, or decrement it in case of negative value

#### Argument Path
Examples: `0.a.deeply.nested.path`, `1` (second argument), `0.some.array.5` (5th element in some.array object of first arg)
The value will be resolved as per [path-value](https://www.npmjs.com/package/path-value)
The first item in the path is argument index (0-based)

#### Function
Example `(arg1, arg2, arg3, returnValueOrError) => arg2.deeply.nested.path`
The function will be called for getting the value

If all attempts to number resolution fail, it will default to 1. An error will be printed to console.

For detailed usage, see specs
