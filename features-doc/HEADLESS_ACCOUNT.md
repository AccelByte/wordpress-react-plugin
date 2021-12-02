## Headless Account

[Headless account diagram](https://sequencediagram.org/index.html#initialData=IYYwLg9gTgBAqgZwKZQFCoA7CmAliXLAOzHmTSx30OBJgHVoATABSiQQXUrwONJYAbYAE8UMFtDDBBmbLxp0AMhADmuIgyQAjBLjBI5VPrVIBJAIIBZbvOr8YAIWB6QRhQ4ur2SALZISdEQUAFoAPkYoVnZOAC4AeQwAhmY2Di5I6PTwyytYgCUkAEcAVw5SQTUNeHylVFzwlXVNeh09AwKkJlx2cBhIGErmmAB3Nv1DYKhGqpbxjqbqkf0ACxgAZiiYHhEYFaRgJkF0mFAQCBLAxbndCZCc61iAZQCmGBB2JgC8GXrre4iqRiCFiMEKYBKUE0wBKYDW5y+qEyaU4DzyAFEAB4gFa0VRId4QL6jVb9CAAawC6Aa4WRwNBWJxeIJCIJCBKIBA6SRQOyYVyoIA4khSCBIew6CVyDAmMBpH8rAC6elQeDIZopeJZdISXC9gcjiczhdAsrUWEhKJxJIcDJVV0ekg+gMMMIxLAMFIZKdOSawOhvBcMBI3davYItLcDKhLe6JOG0UKRe9xd8YJrYNrgAqAbGw7bBPaIVD09Ks7q1vtDsdOD7zpd-VNwnnYDbpIWNBhYTA-MBcBHDkxgTHQ62E-zHmDimUEKQAG4oXAAM3wctwEE0rJzzdH8YLoIAaouVyA1xvCcT2ZzuS29+3ws5XEmKrhZ4SG1BcBxUI-8Lnd22dowMKL5vvWJCfhwMBXlynCoE2FoAeGoLIMcfTgWAUAiCOVpjgW4ReD4-gkM+2wQII1BQdouwYVhqCEUgfjfP+uF3kBIFkRRBBUTRfpYdBHKwVwCG3oBHZEF287HqueDnqyAA0MAACIQI4indAgrqiDARDAP4ilYJwIzMIptBvGcSAYKQBhQL4MAQEu0EoHO+CGKJ44CjALxEG8C6fieZ6bkSSCKSpakyq+Wm7Lp+nbC4CDGVEpk+e+EHYe5+FhAxTEkV5rx1pZBhvDZdkOU5UAuVy26IaxYmgnAGDeIcBJVoatbGg2AnXnB2XEWALFxnVMAWNeVn9CgpWOeQlVsoJ3JEBABj2X5KRRCiCDyRl7axBmgxqPibzVDB6RLiUgiCNhryoEAA)

![headless account image](https://user-images.githubusercontent.com/66050845/144535127-9357a992-e30a-4f10-8272-816a495c380e.png)

1. When user login with 3rd party account for the first time, after user login will got user data without email address then will redirect to Accelbyte Player Portal for upgrade headless account
    - **GET /iam/v3/public/users/me** to check whether the account has email address and verified or not. If user has email and verified then it is not headless and continue to login.
2. User input email and request verification code
    - **POST /iam/v3/public/namespaces/{namespace}/users/me/code/request** to get verification code. The context should be upgradeHeadlessAccount.
3. User input verification code, date of birth, display name, password, country, and accept term of service
    - **POST /iam/v3/public/namespaces/{namespace}/users/me/headless/code/verify** to email verification and upgrade Headless account.
    - **POST /agreements/public/agreements/policies/** to accept term of service.