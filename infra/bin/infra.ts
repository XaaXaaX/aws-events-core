#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

cdk.Tags.of(app).add('application', "testapp");
cdk.Tags.of(app).add('team', "myteam");
cdk.Tags.of(app).add('environment', "dev");
cdk.Tags.of(app).add('dataClassification', 'internal');

new InfraStack(app, 'InfraStack');
