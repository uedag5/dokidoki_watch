#!/usr/bin/env node
'use strict'

const fs = require('fs')
const exec = require('child_process').exec
const args = process.argv.slice(2)
const accountId = args[0]
const bucketName = args[1]
const region = args[2] || 'us-east-1'
const availableRegions = ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2']

if (!accountId || accountId.length !== 12) {
    console.error('You must supply a 12 digit account id as the first argument')
    return
}

if (!bucketName) {
    console.error('You must supply a bucket name as the second argument')
    return
}

if (availableRegions.indexOf(region) === -1) {
    console.error(`Amazon API Gateway and Lambda are not available in the ${region} region. Available regions: us-east-1, us-west-2, eu-west-1, eu-central-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2`)
    return
}

modifySimpleProxyFile()
createEnvConfigFile()

function modifySimpleProxyFile() {
    const simpleProxyApiTemplatePath = './bin/fixtures/simple-proxy-api.yaml'
    const simpleProxyApiWritePath = './config/cloudformation/simple-proxy-api.yaml'
    const simpleProxyApi = fs.readFileSync(simpleProxyApiTemplatePath, 'utf8')
    const simpleProxyApiModified = simpleProxyApi
        .replace(/YOUR_ACCOUNT_ID/g, accountId)
        .replace(/YOUR_AWS_REGION/g, region)

    fs.writeFileSync(simpleProxyApiWritePath, simpleProxyApiModified, 'utf8')
}

function createEnvConfigFile() {
    const configDefaultPath = './config/default.json'
    const configWritePath = './config/development.json'
    const configJson = fs.readFileSync(configDefaultPath, 'utf8')
    const configJsonModified = configJson
        .replace(/YOUR_UNIQUE_BUCKET_NAME/g, bucketName)
        .replace(/YOUR_AWS_REGION/g, region)

    fs.writeFileSync(configWritePath, configJsonModified, 'utf8')
}
