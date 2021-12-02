## Login

[Login diagram](https://sequencediagram.org/index.html#initialData=IYYwLg9gTgBAqgZwKZQFCoA7CmAliXLAOzHmTSx30OBJgHVoATABSiQQU2zwONIAyEAOa4iDJACMEuMEm5U+tUgEkAggFl0iFAFoAfIyit2nAFwB5DEnFGTHLnbYOD6jWYBKSAI4BXDqQANiJi8B4CqG4GQqK2UjJynkhMuOzgMJAwwbEwAO7xsvI6UNEhcdKFZgDKvpIAtrJZZTAg7Ew2eMCBqDGh9AVyrprVNkwtbR24XZGaugZOpghmMF5gvlDiwL5gABYtEO2oCy76bmYAogAeIDu0wkj77Xmye5AA1jYzGnOGzM7mMCuNzuDxABweCF8IBADlQRAgchgEAAbigGH9FmZfOQmsJ7mNQpDoQ4AGa+QKBACeqCAA)

![Login image](https://user-images.githubusercontent.com/66050845/144534901-7cbc2198-63c9-4b94-aa8f-32b5d5d0e9da.png)

1. When user click login button client will call the **GET /iam/v3/oauth/authorize** endpoint on IAM, the endpoint will generate request_id for this request and redirect the app to AB's login website serving login form
    - Login website URL format:  https://{baseUrl}/auth/login?client_id={clientId}&redirect_uri={redirectUri}&request_id={requestId}
    - URL example: https://demo.accelbyte.io/auth/login?client_id=8925bdce941c499b8817a8d1e2feab50&redirect_uri=https%3A%2F%2Fdemo.accelbyte.io&request_id=50f5839674004017878733ac742196d5    
2. User input and submit login credential in login website
3. Login website will call **POST /iam/v3/authenticate endpoint**, and if the user credentials are valid, IAM will redirect the user back to the Redirect_URI of the Client.
    - Redirection URL format: {clientRedirectUri}/?code={code}&state={state}
    - URL example:  https://demo.accelbyte.io/admin/?code=8a12aabbe99947628acb773f9abdc47d&state=a580b5fb964a4e53b3fcb45dffd47e45
4. The Client will have to exchange the code retrieved from the IAM redirection from step 3 to POST /iam/v3/oauth/token endpoint.
