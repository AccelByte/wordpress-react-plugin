## Item purchase button

[Item purchase diagram](https://sequencediagram.org/index.html#initialData=IYYwLg9gTgBAqgZwKZQFCoA7CmAliXLAOzHmTSx30OBJgHVoATABSiQQU2zwONJYAbYAE8UMFtDDBB3Kn1oDhYAGbQAtnN406AURK4wgpOqQkt1fhNGm6bCADdcTFOkQoAtAD5GUVu04ALgBhQXwAaxgMAFcoEAALYGQYACNosEgiVF9-DgRvIVFxSRwZQIAlJCZcdnAYSCjhMVgMKRlUQuaJNsFvfTwjEzMwQJhg+KQQSOHDY1swVH7ZoZIPAqbintGlwfmYAOjBBc7N0t6vQtUNQIBlMyYYEHZgMCQYZldLtSh1NYuN2AlaSCELPV7vPziBDREAgPKodxQdZFQFbACSRBipCwIj2uCIag6AO6ZwKNmGEigjmcKFu9yi5Lo+MJLEZAipThcSORXSBZVZuIpRAgeBU+BeuAgWROqNJXh2c2G2wMuwpAHMoIpFirFaseadgcqBrrSDcYXDOESUSTgd4cmw8qNKmBYkR6hAYIYTDAXNJcIIGWqkKggA)

![Item purchase image](https://user-images.githubusercontent.com/66050845/144790292-1f38ade2-cf45-4726-abc5-53292c85298e.png)

1. When user click purchase button user will redirect to Player Portal create order page
    - **POST /platform/public/namespaces/{namespace}/users/{userId}/orders** to create order.
2. User redirect to Accelbyte Player Portal for input payment information
3. After successful payment user returns to wordpress item detail page