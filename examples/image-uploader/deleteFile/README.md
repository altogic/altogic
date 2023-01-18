# Full-code functions

Altogic provides developers with the option to develop their application business logic either using the no-code drag & drop service designer or coding it for the supported runtimes.

With full-code functions (aka cloud functions, lambdas, serverless functions), you can develop your complex business logic, which might not be possible to model using the no-code service designer. We strongly suggest creating your services using the no-code designer and switching to full-code services for your specific & complex requirements (e.g., you may need to use/import a particular package of library)

With full-code services, you can deploy serverless functions to execute custom code. Each serverless function can be used to handle requests triggered from the below channels:

- **Endpoints:** You can direct RESTful API requests of an endpoint to your function
- **Message queues:** You can direct the processing of each message submitted to a queue to your function
- **Cron jobs:** You can schedule tasks that run at specific times or periods and direct the processing of these tasks to your function

## Writing Your Function

Before writing your function, you need to create your starter project. To create the starter project, you need to use [Altogic CLI](https://www.altogic.com/docs/category/altogic-cli-guides ). Please make sure you have installed Altogic CLI, and that you have successfully logged into your Altogic account. Run `altogic create function` to crate your starter project. 

When writing your Altogic serverless function, you must export the code in specific ways. The following is an example code for a function written for Node.js runtime.

```javascript
const ENV_URL = 'https://c1-na.altogic.com/e:6124d1becc2932001a1afc9a';
const CLIENT_KEY = 'd123da292bc5450e9a6fb810ed30f8c2';

module.exports = async function (req, res) {
  // Create a client for interacting with your backend app
  // You need to provide environment url and client key as input parameters
  let altogic;

  if (!ENV_URL || !CLIENT_KEY) {
    console.warn(
      "Client library environment URL and/or client key variables are not set. Unless these variables are set, the cloud function cannot use Altogic Client Library."
    );
  } else altogic = createClient(ENV_URL, CLIENT_KEY);

  res.json({
    quote: "Hello world!",
  });
};
```

You can also include a **package.json** file along with your function code.

When your function is called, you receive two parameters, a **request,** and a **response** object. The request object contains all data that was sent to the function. A schema of the request object can be found below for different request channels.

| Property  | Description                                                  | Endpoint | Message queue | Cron job |
| --------- | ------------------------------------------------------------ | -------- | ------------- | -------- |
| ids       | Endpoint path id parameters object                           | Yes      | No            | No       |
| query     | Request query string parameters                              | Yes      | No            | No       |
| headers   | Request headers object                                       | Yes      | No            | No       |
| appParams | App parameters object                                        | Yes      | Yes           | Yes      |
| client    | Requesting device type and IP information                    | Yes      | No            | No       |
| session   | Session of the user making the request                       | Yes      | No            | No       |
| appInfo   | Contextual information about the app and the environment     | Yes      | Yes           | Yes      |
| files     | Array of file objects                                        | Yes      | No            | No       |
| body      | Request body JSON object. This can be a single JSON object or an array of JSON objects | Yes      | Yes           | No       |

Below you can also find sample data for each request property.

```js
//ids
//https://myapp123.c1-na.altogic.com/users/624b52783c77af658ac14ea2/products/6151be8581f301001aa73c3c
{
  userId: '624b52783c77af658ac14ea2', 
  productId: '6151be8581f301001aa73c3c'
}

//query
//https://myapp123.c1-na.altogic.com/users?username=user123&quantity=123
{
  username: 'user123', 
  quantity: 123
}

//headers 
{
  token: 'tk_23423...', 
  'content-type': 'application/json'
}

//appParams
//App params are configured in Atogic Designer -> App Settings -> Parameters
{
  param1: 123, 
  param2: true, 
  param3: 'text value'
}

//client
//Only applicable for request triggered through calling and endpoint and provides calling party info.
{
  ip: '100.123.45.66', 
  deviceType: 'desktop'
}

//session
{
  userId: "62602c378415c0a0519102aa",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbnZJZCI6IjYyNjAyYzM3ODQxNWMwYTA1MTkxMDJiNiIsInVzZXJJZCI6IjYyNjAyYzM3ODQxNWMwYTA1MTkxMDJhYSIsInV1aWQiOiI2NmMxM2JhZS1iOGE1LTQ1NDItOWJkZC0zYmE4NTAwZTU2NjUiLCJpYXQiOjE2NjM2ODYxNTB9.LAbzFnk59Ix8z-6Wkcd3Gz49FWnswtvuGFCqG-AX5fU",
  creationDtm: "2022-09-20T15:02:30.331Z",
  userAgent: {
    family: "Chrome",
    major: "105",
    minor: "0",
    patch: "0",
    device: {
      family: "Other",
      major: "0",
      minor: "0",
      patch: "0",
    },
    os: {
      family: "Mac OS X",
      major: "10",
      minor: "15",
      patch: "7",
    },
  },
  accessGroupKeys: ['admin', 'member'],
}

//appInfo
//Populated by the execution environment of your app
{
  appName: "Practice App",
  environmentName: "Development",
  environmentType: "trial",
  apiBaseUrl: "https://c1-na.altogic.com/e:62602c378415c0a0519102b6",
  executionStartDtm: "2022-09-20T15:02:30.325Z",
}

//files
//List of files. The contents keep the Buffer of the file contents
[
  {
    "fieldName": "file2",
    "fileName": "red.png",
    "encoding": "7bit",
    "mimeType": "image/png",
    "size": 18372,
    "contents": {
                    "type": "Buffer",
                    "data": [
                        123,
                        34,
                        116,
                      ... ]
                }
  },
  ...
]

 //body - This depends on the parameters that you send in your request body
```

The response object has two methods, **send()** and **json()** that can be used to send data back to the calling party. If the function is triggered by calling an endpoint,  the response returned by **send()** or **json()** is returned to the calling party. However, if the function is triggered by a message queue or cron job, there is no tangible calling party, the response returned by **send()** or **json()** method is added to the log records.

## Deploying Your Function

You can deploy your serverless functions using [Altogic CLI](https://www.altogic.com/docs/altogic-cli). Make sure you have installed Altogic CLI and you have successfully logged into your Altogic account. Please ensure you are in the same folder as your `altogic.json` and run `altogic deploy` to deploy your function. You will be prompted to select which environment to deploy if you have multiple execution environments.

When you run the deploy command, Altogic creates a new image and applies this image to your app's execution environment. Depending on the size of your code and its dependencies, it may take a couple of minutes to build and deploy your function. You can run `altogic get deployments` to get the status of your deployment.

## Linking Your Function

After writing and successfully deploying your function to your execution environment, you need to link your function to an endpoint, message queue, and/or scheduled task. You can use [Altogic Designer](https://designer.altogic.com) to configure your endpoint, message queue, and cron job handlers.

## Testing

You can use [Altogic Tester](https://tester.altogic.com) to test your serverless functions using endpoints, message queues, or scheduled tasks (e.g., cron jobs).