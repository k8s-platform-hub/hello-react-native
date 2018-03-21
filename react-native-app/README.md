React Native Auth Kit

This is a React Native Auth Kit that is equipped with the following authentication methods:
- Username/Password
- Email
- Mobile with OTP
- Google
- Facebook

This auth kit uses Hasura for the auth APIs. To configure login methods. Follow these steps.

1. [Install the Hasura CLI](https://docs.hasura.io/0.15/manual/install-hasura-cli.html)

2. Clone a base Hasura project
```
$ hasura quickstart base hasura
```

3. Apply the auth configuration

```
$ cd hasura && hasura conf apply
```

Readme TODO
