# SAP Application Frontend - Vibe Coding Examples

Two examples demonstrating deployment to [SAP Application Frontend](https://help.sap.com/docs/application-frontend) service.

## 01-simple-deploy

Minimal static HTML app deployed directly via the `afctl` CLI.

```bash
cd 01-simple-deploy
afctl init webapp --name my-app --version v1 -f
afctl login --service-key service-key.json -a <API_URL>
afctl push webapp --activate
```

## 02-mta-deploy

SAPUI5 application packaged as an MTA (Multi-Target Application) and deployed via Cloud Foundry.

Uses the Northwind OData service to display a product list.

```bash
cd 02-mta-deploy
mbt build
cf deploy mta_archives/*.mtar
```

## Prerequisites

- SAP BTP subaccount with Application Frontend service subscription
- Cloud Foundry CLI (`cf`)
- MTA Build Tool (`mbt`)
- Application Frontend CLI (`afctl`): `npm install -g @sap/appfront-cli`
