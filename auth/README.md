#### Copyright (c) 2020, 2021, Oracle and/or its affiliates.
#### Contributor: Trong Nhan Mai
---

**How to use the authentication script**

```
[replayer]$ ./bin/replay --log <application_name>/loginSpec.js --config <application_name>/config.js --port <the_app_exposed_port> --store <directory_to_store_tokens>
```

**Optional parameter**

- `store` : Define the directory to store the auth tokens acquired (default set to `"./"`).
- `port` : Define the exposed port of the application (default set to `3000`).