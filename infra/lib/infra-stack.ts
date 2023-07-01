import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as cfOrigin from 'aws-cdk-lib/aws-cloudfront-origins';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const sourcebucket = new s3.Bucket(this, "SharedStreamDocumentationBucket", {
      bucketName: "stream-documentation-source-bucket",
      accessControl: s3.BucketAccessControl.PRIVATE,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    const cloudfrontOAI = new cf.OriginAccessIdentity(
      this, 'CloudFrontOriginAccessIdentity');
  
    sourcebucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject',
        's3:ListObjects'
      ],
      resources: [
        sourcebucket.bucketArn,
        sourcebucket.arnForObjects('*')
      ],
      principals: [new iam.CanonicalUserPrincipal(
          cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    new cf.Distribution(this, 'StreamDocumentationDistribution', {
      defaultBehavior: {
        origin: new cfOrigin.S3Origin(sourcebucket, {
            originAccessIdentity: cloudfrontOAI
        }),
        allowedMethods: cf.AllowedMethods.ALLOW_ALL
      }
    });
  }
}
