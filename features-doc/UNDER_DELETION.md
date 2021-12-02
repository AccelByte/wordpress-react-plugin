## Under Deletion Account

[Under deletion account diagram](https://sequencediagram.org/index.html#initialData=IYYwLg9gTgBAqgZwKZQFCoA7CmAliXLAOzHmTSx30OBJgHVoATABSiQQXUrwONJYAbYAE8UMFtDDBBmbLxp0AMhADmuIgyQAjBLjBI5VPrVIBJAIIBZdKkQoAtAD5GUVu04AuAPIYkm13cOLkC2YOdLK08AJSQARwBXDlJBNQ14aKVUSOcVdQCdPQMYpCZcdnAYSBhU-JgAd0L9Q3soXLSC3WbPMyIMBNIQdiZ-PBlUPPT6JoMHCOtPAGV-Jhgh0tHccZznUI8ETxhYsASoTWABgAs1iBHUPfCnSM8AUQAPEEvaVSQbkYb9NdIABrfzoHYuZhhLwwd6fb6-EC3X4IBIgEDBe5Q-bzKIAcSQpAS5BgTGA0lQeIAIixonNIW5oQdjqdNMTxGTpACwNcEkQRrARoJCbgIJoENITiFsY8hKJxJIcDJDrEyhVSNUMMIxLAMFIZDBQEi+WB0KooBAEhgJNqFfrBFougZUHKdRJ7c5qbTPATSEbLXQhSKxTAJeTiZSaXTnK67UrBCUTmdDeiA6RcAgYHyBaSkMK8GKzRarTAAMJivBEJIwKl54NEOzkGO22CK6QJssVjTVoMFhux1sep4LGDLfk1NSW0jsRLJVBECAGGAQABu4genAANAP3fHPOzYLUfqsp6gVkXLdbS7QMQ7a-nRQ3Ws35YO92Wb3ncw-Czu2zJPSjFV4iSCU1k-B1e0fSNaXpP97WA2cwJACDv3rUM0QxTh50XX5VwVFtd3bQ5FkuCB6hgBc8AAM3wclHzQvsYC+TNtCQfxwKIW9hVWWhViIdjVlqdJqiREhu0MeD41xEiVgnVQpxgGdQNNCEpOImA8kU1F0UxKi8LXWANwQbdCP-BMD3k49lwGM9+TsphUCAA)

![Under deletion account image](https://user-images.githubusercontent.com/66050845/144566512-fbf89385-3989-4a33-8666-7cd8b3c72d24.png)

1. When user login with under deletion account will redirect to Accelbyte Player Portal for cancel deletion or continue.
    - **GET /iam/v3/public/users/me** to check whether the account under deletion or not.
2. User redirect to Accelbyte Player Portal for cancel or continue deletion.
3. If user continue will automatically logout.
4. If cancel will request cancel deletion then user will logout and need login to continue
    - **DELETE /gdpr/public/namespaces/{namespace}/users/{userId}/deletions** for cancel request.