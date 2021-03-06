# ExpressionBuilder

## What is it good for?
Expression builder is a tool that simplifies the creation of complex string expressions using a C-macro-like syntax.
It was written to help writing complex [Template Functions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions) used in [Azure Template Deployments](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/) and in [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/definition-structure#policy-functions).

For example, here's an expression that adds a prefix to a value in a template parameter if it's not already there:
```
[if(startsWith(parameters('myParameter'), 'prefix-'), parameters('myParameter'), concat('prefix-', parameters('myParameter')))]
```
It's readable, bearly. And as you try to write more complex expressions, it becomes very very hard and using the expression builder can help. Here's the expression builder 'code' that was used to generate the expression:
```
#def PARAMETER parameters('myParameter')
#def HAS_PREFIX startsWith(PARAMETER, 'prefix-')
#def ADD_PREFIX concat('prefix-', PARAMETER)

#eval [if(HAS_PREFIX, PARAMETER, ADD_PREFIX)]
```

You can try it yourself [here](https://armexpressions.z13.web.core.windows.net/?expression=%23def%20PARAMETER%20parameters('myParameter')%0A%23def%20HAS_PREFIX%20startsWith(PARAMETER%2C%20'prefix-')%0A%23def%20ADD_PREFIX%20concat('prefix-'%2C%20PARAMETER)%0A%0A%23eval%20%5Bif(HAS_PREFIX%2C%20PARAMETER%2C%20ADD_PREFIX)%5D).

Pretty cool, right? with the expression builder we were able to:
1. Break a complex expression into multiple lines and giving them meaningful names.
2. Re-use the same expressions more than once

## What's Next
1. Support some sort of looping
2. Improve robustness

## Implementation
The tool is written in TypeScript (which is not my go-to language, generally i'm not a frontend guy, so forgive my ugly code).
### Single page app
The expression builder is available via a single page app hosted on Azure storage account [here](https://armexpressions.z13.web.core.windows.net/).  
Code editor is a fork of [ACE](https://github.com/eladperets/ace) with an additional rule for the expression builder syntax. That's a crazy overkill, but it was the fastest way to make it work without require me to learn how things like webpack work- i'm trying to focus on the implementation, to the frontend stuff.

## Environment Setup
(Works only in windows)
```
npm install   
npm run build
```
The ./out folder will contain the single page app.

Running tests:
```
npm run test
```
