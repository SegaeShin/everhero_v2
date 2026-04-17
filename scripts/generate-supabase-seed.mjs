import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const workspaceRoot = process.cwd();
const mockDataPath = path.join(workspaceRoot, "lib", "mock-data.ts");
const outputPath = path.join(workspaceRoot, "supabase", "seed.sql");

function extractLiteral(source, marker, openChar, closeChar) {
  const markerIndex = source.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }

  const assignmentIndex = source.indexOf("=", markerIndex);

  if (assignmentIndex === -1) {
    throw new Error(`Assignment not found for marker: ${marker}`);
  }

  const startIndex = source.indexOf(openChar, assignmentIndex);

  if (startIndex === -1) {
    throw new Error(`Opening character not found for marker: ${marker}`);
  }

  let depth = 0;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (char === openChar) {
      depth += 1;
    } else if (char === closeChar) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }
  }

  throw new Error(`Failed to extract literal for marker: ${marker}`);
}

function parseLiteral(literalSource) {
  return vm.runInNewContext(`(${literalSource})`);
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  return Number(value).toString();
}

const source = fs.readFileSync(mockDataPath, "utf8");
const companyProfile = parseLiteral(
  extractLiteral(source, "export const companyProfile", "{", "}")
);
const employees = parseLiteral(extractLiteral(source, "export const employees", "[", "]"));

const lines = [
  "-- Generated from lib/mock-data.ts",
  "-- Run this after supabase/schema.sql",
  "",
  "begin;",
  "",
  "truncate table employee_portfolios restart identity cascade;",
  "truncate table employee_risk_flags restart identity cascade;",
  "truncate table employees restart identity cascade;",
  "truncate table company_profiles restart identity cascade;",
  "",
  "insert into company_profiles (name, industry, employee_count, pension_type, provider, is_active)",
  `values (${sqlString(companyProfile.name)}, ${sqlString(companyProfile.industry)}, ${sqlNumber(companyProfile.employeeCount)}, ${sqlString(companyProfile.pensionType)}, ${sqlString(companyProfile.provider)}, true);`,
  ""
];

employees.forEach((employee) => {
  lines.push(
    "insert into employees (id, name, department, join_date, birth_year, balance, monthly_contribution, return_rate)",
    `values (${sqlString(employee.id)}, ${sqlString(employee.name)}, ${sqlString(employee.department)}, ${sqlString(employee.joinDate)}, ${sqlNumber(employee.birthYear)}, ${sqlNumber(employee.balance)}, ${sqlNumber(employee.monthlyContribution)}, ${sqlNumber(employee.returnRate)});`,
    ""
  );

  employee.riskFlags.forEach((flag) => {
    lines.push(
      "insert into employee_risk_flags (employee_id, flag)",
      `values (${sqlString(employee.id)}, ${sqlString(flag)});`,
      ""
    );
  });

  employee.portfolio.forEach((item) => {
    lines.push(
      "insert into employee_portfolios (employee_id, product_name, category, allocation, return_rate, fee_rate, risk_level)",
      `values (${sqlString(employee.id)}, ${sqlString(item.productName)}, ${sqlString(item.category)}, ${sqlNumber(item.allocation)}, ${sqlNumber(item.returnRate)}, ${sqlNumber(item.feeRate)}, ${sqlNumber(item.riskLevel)});`,
      ""
    );
  });
});

lines.push("commit;", "");

fs.writeFileSync(outputPath, `${lines.join("\n")}`, "utf8");
console.log(`Generated ${path.relative(workspaceRoot, outputPath)}`);
