## Blocked by Legal

[Blocked legal diagram](https://sequencediagram.org/index.html#initialData=IYYwLg9gTgBAqgZwKZQFCoA7CmAliXLAOzHmTSx30OBJgHVoATABSiQQXUrwONJYAbYAE8UMFtDDBBmbLxp0AMhADmuIgyQAjBLjBI5VPrVIBJAIIBZbvOr8YF1eyQBbJCXSIUAWgB8jFCs7JwAXADyGB4MzGwcXIHB8f6WVqEASkgAjgCuHKSCahrw6Uqoqf4q6pr0OnoGGUhMuOzgMJAwhdUwAO51+obeUJVFNf0NZkQYOaQg7EweeDKoVcW1ugM+KdahAMoeTDBzTYu4yxX+iXFhMJlgOVCawDMAFkcQC6hXIQjbaQCiAA8QC9aKokO8Fr19G9IABrDzoC4BWI-UIwIEgsEQkAfCEIHIgEDxL6o5J+VKhADiSAKSFUMhgSEEuHU2lwLLwHHK1i2KKC1wQjXujxgOSIoGJGAMh0E9MZzNZuHZnNw3O+5KEonEkhwMnRmWarVIHQwwjEsAwUkZkog4rA6GcdowEnNOutgi0GwMqC1FokHr+1NpnXlnsVbI5+jVXGRfvdesEwoemnFkqQ0qaoYZ4ZZkdV3KG-njsF10iTFiJGZNKFcMAgADMYOQAG74QwlgOJ-xOFzuEjo-ZEQ7pzOHAxQOuN5soNvE1C9pBuRZ8ztl-WOKvS9q1+tN1vt5uE4mcVBECAGest8QazgAGjXHtCOXInTU4MOxQJVc4DZygkEERUAOVAgA)

![Blocked legal image](https://user-images.githubusercontent.com/66050845/144543685-c1f66dde-9fc0-4263-99f3-66fd032739e3.png)

1. When user login with blocked legal after user login will got user data with blocked legal status then will redirect to Accelbyte Player Portal for accept legal
    - **GET /agreement/public/eligibilities/namespaces/{namespace}** to check whether the account have unaccepted legal eligibilities or not.
2. User redirect to Accelbyte Player Portal for accept legal
3. User accept legal
    - **POST /agreement/public/agreements/policies/** for accept legal.