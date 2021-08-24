## Automatic bills in Spreeadsheet

This repository aims to automate the process of fetching data related to consumer accounts and saving it in Google Spreadsheets spreadsheets.

## Init the project

Install the dependencies:

```shell
yarn
```
ou
```shell
npm install
```

And run the internal dependencies of the services.

```shell
yarn update:services
```
ou
```shell
npm run update:services
```

## Configure o ambiente

```
SPREADSHEET_ID= ## Spreedsheat ID. The value can be obtained from the content url.
RANGE_SEARCH= ## Range of the content to search
SERVICES_UPDATE= ## JSON of the services and yours ranges

## The service environments can also be placed here
```

## Services supporteds

* [webscap-energisa](https://github.com/nathanfeitoza/webscrap-energisa)
* [webscap-deso](https://github.com/nathanfeitoza/webscrap-deso)
