## Document Policy Link

[Document Policy Link diagram](https://sequencediagram.org/index.html#initialData=IYYwLg9gTgBAqgZwKZQFCoA7CmAliXLAOzHmTSx30OBJgHVoATABSiQQU2zwONIAySAObAANgyQAjBLjBJuVPrVIBBYeyQBbJCXSIUAWgB8jKK3acAXDADyGXQ2ZsOXMxdcn1mnSRsAlJABHAFcOUgwIMWoOVG8kbV0wQxN3F2sYQKDwmEjogg4YBBCQEFdUAyhU50sEGwBhfIBrGCYIEBDfCKj8AE8YaKIm1DTakyFRCXppWXkApCZcdnAYSAGRcRgAdxm5JCA)

![Document Policy Link image](https://user-images.githubusercontent.com/66050845/144806772-6b8ffd86-819a-422d-b367-f0fc135bdfb3.png)

1. WordPress will request policies by country and show policies on Element ID `ab-wpr-footer-privacy-link`.
    - **GET /agreement/public/policies/namespaces/{namespace}/countries/{country}?defaultOnEmpty=true&policyType=LEGAL_DOCUMENT_TYPE&tags=FOOTER**
        - `defaultOnEmpty` if it true will get default legal when legal in that country is empty
        - `policyType` can be filled with `LEGAL_DOCUMENT_TYPE` or `MARKETING_PREFERENCE_TYPE`
        - `tags` get legal by specific tag
2. When user click policy link will redirect to legal website