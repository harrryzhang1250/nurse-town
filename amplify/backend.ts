import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { preSurveyFunction } from "./functions/pre-survey-function/resource";
import { postSurveyFunction } from "./functions/post-survey-function/resource";
import { chatHistoryFunction } from "./functions/chat-history-function/resource";
import { debriefFunction } from "./functions/debrief-function/resource";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
  preSurveyFunction,
  postSurveyFunction,
  chatHistoryFunction,
  debriefFunction,
});

// Function wrapper list
const fns = [
  backend.preSurveyFunction,
  backend.postSurveyFunction,
  backend.chatHistoryFunction,
  backend.debriefFunction,
];

// Tables to inject
const tableMap = [
  backend.data.resources.tables["PreSurveyAnswers"],
  backend.data.resources.tables["PostSurveyAnswers"],
  backend.data.resources.tables["ChatHistory"],
  backend.data.resources.tables["DebriefAnswers"],
];

// Assign table permissions and environment variables to each function
for (let i = 0; i < fns.length; i++) {
  tableMap[i].grantReadWriteData(fns[i].resources.lambda);
  fns[i].addEnvironment("TABLE_NAME", tableMap[i].tableName);
}

// create a new API stack
const apiStack = backend.createStack("api-stack");

// create a new REST API with CORS enabled
const myRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "NurseTownAPI",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

// create Lambda integrations
const preSurveyLambdaIntegration = new LambdaIntegration(
  backend.preSurveyFunction.resources.lambda
);

const postSurveyLambdaIntegration = new LambdaIntegration(
  backend.postSurveyFunction.resources.lambda
);

const chatHistoryLambdaIntegration = new LambdaIntegration(
  backend.chatHistoryFunction.resources.lambda
);

const debriefLambdaIntegration = new LambdaIntegration(
  backend.debriefFunction.resources.lambda
);

// create a new resource path with no authorization for pre-survey
const preSurveyPath = myRestApi.root.addResource("pre-survey");
preSurveyPath.addMethod("GET", preSurveyLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});
preSurveyPath.addMethod("POST", preSurveyLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// create a new resource path with no authorization for post-survey
const postSurveyPath = myRestApi.root.addResource("post-survey");
postSurveyPath.addMethod("GET", postSurveyLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});
postSurveyPath.addMethod("POST", postSurveyLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// create a new resource path with no authorization for chat-history
const chatHistoryPath = myRestApi.root.addResource("chat-history");
chatHistoryPath.addMethod("GET", chatHistoryLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});
chatHistoryPath.addMethod("POST", chatHistoryLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// create a new resource path with no authorization for debrief
const debriefPath = myRestApi.root.addResource("debrief");
debriefPath.addMethod("GET", debriefLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});
debriefPath.addMethod("POST", debriefLambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
});

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },
  },
});
