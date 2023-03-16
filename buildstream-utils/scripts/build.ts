const fs = require('fs')
const path = require('path')
const ts = require('typescript')

const tokensPath = path.join(
  __dirname,
  '../../services/buildstream-schema/public/tokens'
)

const tokens = fs.readdirSync(tokensPath)

const tokenArray = tokens.map((token) => {
  const tokenPath = path.join(tokensPath, token)
  const tokenData = fs.readFileSync(tokenPath, 'utf-8')
  return {
    id: token.replace('.json', ''),
    ...JSON.parse(tokenData)
  }
})

function parseValue(value: any) {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined')
  }
  const isObject = typeof value === 'object' && value !== null
  const isArray = Array.isArray(value)

  if (isArray) {
    return ts.createArrayLiteral(
      value.map((item: any) => parseValue(item)),
      true
    )
  }

  if (isObject) {
    return ts.createObjectLiteral(
      Object.entries(value).map(([k, v]) =>
        ts.createPropertyAssignment(k, parseValue(v))
      )
    )
  }
  return ts.createLiteral(value)
}

const tokensVar = ts.createVariableStatement(
  [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
  ts.createVariableDeclarationList(
    [ts.createVariableDeclaration('tokens', undefined, parseValue(tokenArray))],
    ts.NodeFlags.Const
  )
)

const resultFile = ts.createSourceFile(
  '',
  '',
  ts.ScriptTarget.Latest,
  false,
  ts.ScriptKind.TS
)
const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed
})
const result = printer.printNode(ts.EmitHint.Unspecified, tokensVar, resultFile)

console.log(result)

fs.writeFileSync(
  path.join(__dirname, '../src/hooks/useTokens/generated/tokens.ts'),
  result
)
