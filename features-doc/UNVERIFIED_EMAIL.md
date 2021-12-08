## Unverified Email

[Unverified email diagram](https://sequencediagram.org/index.html#initialData=IYYwLg9gTgBAqgZwKZQFCoA7CmAliXLAOzHmTSx30OBJgHVoATABSiQQXUrwONJYAbYAE8UMFtDDBBmbLxp0AMhADmuIgyQAjBLjBI5VPrVIBJAIIBZdKkQoAtAD5GUVu04AuAPIYkm13cOLkC2YOdLK08AJSQARwBXDlJBNQ14aKVUSOcVdQCdPQMYpCZcdnAYSBhU-JgAd0L9Q3soXLSC3WbPGDMiDATSEHYmfzwZVDz0+iaDBwjrTwBlfyYYYdKx3Amc51CPBB7YsASoTWBBgAt1iFHUffCnSM8AUQAPEEvaVSQb0Yb9NdIABrfzoXYuZhhLwwd6fb6-EC3X4IBIgEDBe5Qg4LKIwADiSCGp3YdAS5BgTGA0my1nmkLc0MOx1OmnJ4ip0gBYGuCSIADcULgAGa4UowJAAW2AuFkD04ziEonEkhwMiOpXKSEq1QwwjEsAwUhkMFASL5YHQqigEASGAk+pVxsEWi6BlQSoNEmduJ6hOJUFJpHZsE5wFpVnpnqdasEJROZxgIcp1OA3N5AqFovFUplslaisdsFV0jjGgGpEFUBF+GpuAgmiRd2jxZ9T0WKyIayrNZAdYbf0MEJb3tjngAalna3gB6j0ZiiBADDAIFWGNjggAaEcl9XJ2o-NbpOcYzjChKCQQiVCrVBAA)

![unverified email image](https://user-images.githubusercontent.com/66050845/144539131-72bfc0de-9d84-4c06-a79f-406e07ae4cb6.png)

1. When user login with unverified email after user login will got user data with unverified email status then will redirect to Accelbyte Player Portal for input verification code
    - **GET /iam/v3/public/users/me** to check whether the account have verified email address or not.
2. User redirect to Accelbyte Player Portal for input verification code
3. User input verification code
    - **POST /iam/v3/public/namespaces/{namespace}/users/me/code/verify** for email verification.