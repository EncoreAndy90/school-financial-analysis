import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './App.css'

interface FinancialData {
  year: string
  revenue: number
  costs: number
  netPosition: number
  feeIncrease: number
  payIncrease: number
  discountAmount: number
  grossRevenue: number
}

function App() {
  // Input states
  const [numChildren, setNumChildren] = useState(200)
  const [feePerTerm, setFeePerTerm] = useState(7000)
  const [feeIncrease, setFeeIncrease] = useState(3) // percentage
  const [payIncrease, setPayIncrease] = useState(2) // percentage
  const [currentSurplus, setCurrentSurplus] = useState(100000) // annual surplus (profit)
  const [numStaffChildren, setNumStaffChildren] = useState(0) // children of staff (50% discount)
  const [otherChildrenDiscount, setOtherChildrenDiscount] = useState(15) // discount % for other children (10-20%)
  const [totalDiscountEffect, setTotalDiscountEffect] = useState(12.5) // total discount effect % (10-15%)
  const [inflationYear1, setInflationYear1] = useState(2.5) // percentage
  const [inflationYear2, setInflationYear2] = useState(2.3) // percentage
  const [inflationYear3, setInflationYear3] = useState(2.2) // percentage

  // Calculate financial projections
  const financialData = useMemo(() => {
    const termsPerYear = 3
    
    // Calculate discount effect
    // Option 1: Calculate from staff children and other discounts
    const numOtherChildren = Math.max(0, numChildren - numStaffChildren)
    const staffChildrenDiscount = numStaffChildren * 0.5 // 50% discount
    const otherChildrenDiscountAmount = numOtherChildren * (otherChildrenDiscount / 100)
    const calculatedTotalDiscount = numChildren > 0 
      ? ((staffChildrenDiscount + otherChildrenDiscountAmount) / numChildren) * 100
      : 0
    
    // Use the total discount effect variable (10-15%) or calculated value
    const effectiveDiscount = totalDiscountEffect / 100
    
    // Calculate revenue with discounts applied
    const grossAnnualRevenue = numChildren * feePerTerm * termsPerYear
    const discountAmount = grossAnnualRevenue * effectiveDiscount
    const currentAnnualRevenue = grossAnnualRevenue - discountAmount // Turnover after discounts
    const currentAnnualCosts = currentAnnualRevenue - currentSurplus // Costs = Turnover - Surplus

    const projections: FinancialData[] = []

    // Current year (Year 0)
    projections.push({
      year: 'Current',
      revenue: currentAnnualRevenue,
      costs: currentAnnualCosts,
      netPosition: currentSurplus,
      feeIncrease: 0,
      payIncrease: 0,
      discountAmount: discountAmount,
      grossRevenue: grossAnnualRevenue,
    })

    // Year 1
    const year1FeeMultiplier = 1 + feeIncrease / 100
    const year1PayMultiplier = 1 + payIncrease / 100
    const year1InflationMultiplier = 1 + inflationYear1 / 100

    // Apply fee increase to gross revenue, then apply discount
    const year1GrossRevenue = grossAnnualRevenue * year1FeeMultiplier
    const year1DiscountAmount = year1GrossRevenue * effectiveDiscount
    const year1Revenue = year1GrossRevenue - year1DiscountAmount
    const year1BaseCosts = currentAnnualCosts * year1PayMultiplier
    const year1Costs = year1BaseCosts * year1InflationMultiplier
    const year1Net = year1Revenue - year1Costs

    projections.push({
      year: 'Year 1',
      revenue: year1Revenue,
      costs: year1Costs,
      netPosition: year1Net,
      feeIncrease: feeIncrease,
      payIncrease: payIncrease,
      discountAmount: year1DiscountAmount,
      grossRevenue: year1GrossRevenue,
    })

    // Year 2
    const year2FeeMultiplier = 1 + feeIncrease / 100
    const year2PayMultiplier = 1 + payIncrease / 100
    const year2InflationMultiplier = 1 + inflationYear2 / 100

    // Apply fee increase to previous year's gross revenue, then apply discount
    const year2GrossRevenue = year1GrossRevenue * year2FeeMultiplier
    const year2DiscountAmount = year2GrossRevenue * effectiveDiscount
    const year2Revenue = year2GrossRevenue - year2DiscountAmount
    const year2BaseCosts = year1BaseCosts * year2PayMultiplier
    const year2Costs = year2BaseCosts * year2InflationMultiplier
    const year2Net = year2Revenue - year2Costs

    projections.push({
      year: 'Year 2',
      revenue: year2Revenue,
      costs: year2Costs,
      netPosition: year2Net,
      feeIncrease: feeIncrease,
      payIncrease: payIncrease,
      discountAmount: year2DiscountAmount,
      grossRevenue: year2GrossRevenue,
    })

    // Year 3
    const year3FeeMultiplier = 1 + feeIncrease / 100
    const year3PayMultiplier = 1 + payIncrease / 100
    const year3InflationMultiplier = 1 + inflationYear3 / 100

    // Apply fee increase to previous year's gross revenue, then apply discount
    const year3GrossRevenue = year2GrossRevenue * year3FeeMultiplier
    const year3DiscountAmount = year3GrossRevenue * effectiveDiscount
    const year3Revenue = year3GrossRevenue - year3DiscountAmount
    const year3BaseCosts = year2BaseCosts * year3PayMultiplier
    const year3Costs = year3BaseCosts * year3InflationMultiplier
    const year3Net = year3Revenue - year3Costs

    projections.push({
      year: 'Year 3',
      revenue: year3Revenue,
      costs: year3Costs,
      netPosition: year3Net,
      feeIncrease: feeIncrease,
      payIncrease: payIncrease,
      discountAmount: year3DiscountAmount,
      grossRevenue: year3GrossRevenue,
    })

    return projections
  }, [
    numChildren,
    feePerTerm,
    feeIncrease,
    payIncrease,
    currentSurplus,
    numStaffChildren,
    otherChildrenDiscount,
    totalDiscountEffect,
    inflationYear1,
    inflationYear2,
    inflationYear3,
  ])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Calculate base values for manual calculations display
  const baseCalculations = useMemo(() => {
    const termsPerYear = 3
    const effectiveDiscount = totalDiscountEffect / 100
    const grossAnnualRevenue = numChildren * feePerTerm * termsPerYear
    const discountAmount = grossAnnualRevenue * effectiveDiscount
    const currentAnnualRevenue = grossAnnualRevenue - discountAmount
    const currentAnnualCosts = currentAnnualRevenue - currentSurplus

    return {
      termsPerYear,
      effectiveDiscount,
      grossAnnualRevenue,
      discountAmount,
      currentAnnualRevenue,
      currentAnnualCosts,
    }
  }, [numChildren, feePerTerm, totalDiscountEffect, currentSurplus])

  return (
    <div className="app">
      <header className="header">
        <h1>School Financial Analysis Tool</h1>
        <p>Analyze the impact of fee and pay increases over 3 years</p>
      </header>

      <div className="container">
        <div className="inputs-panel">
          <h2>Input Parameters</h2>

          <div className="input-group">
            <label htmlFor="children">
              Number of Children
              <input
                id="children"
                type="number"
                value={numChildren}
                onChange={(e) => setNumChildren(Number(e.target.value))}
                min="1"
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="fee">
              Fee per Term (£)
              <input
                id="fee"
                type="number"
                value={feePerTerm}
                onChange={(e) => setFeePerTerm(Number(e.target.value))}
                min="0"
                step="100"
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="staffChildren">
              Number of Staff Children
              <input
                id="staffChildren"
                type="number"
                value={numStaffChildren}
                onChange={(e) => setNumStaffChildren(Math.max(0, Math.min(Number(e.target.value), numChildren)))}
                min="0"
                max={numChildren}
              />
            </label>
            <div className="helper-text">
              Staff children receive 50% discount
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="otherDiscount">
              Average Discount for Other Children (%)
              <div className="slider-container">
                <input
                  id="otherDiscount"
                  type="range"
                  min="10"
                  max="20"
                  step="0.5"
                  value={otherChildrenDiscount}
                  onChange={(e) => setOtherChildrenDiscount(Number(e.target.value))}
                />
                <input
                  type="number"
                  value={otherChildrenDiscount}
                  onChange={(e) => setOtherChildrenDiscount(Number(e.target.value))}
                  min="10"
                  max="20"
                  step="0.5"
                  className="number-input"
                />
                <span>%</span>
              </div>
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="totalDiscount">
              Total Discount Effect (%)
              <div className="slider-container">
                <input
                  id="totalDiscount"
                  type="range"
                  min="10"
                  max="15"
                  step="0.1"
                  value={totalDiscountEffect}
                  onChange={(e) => setTotalDiscountEffect(Number(e.target.value))}
                />
                <input
                  type="number"
                  value={totalDiscountEffect}
                  onChange={(e) => setTotalDiscountEffect(Number(e.target.value))}
                  min="10"
                  max="15"
                  step="0.1"
                  className="number-input"
                />
                <span>%</span>
              </div>
            </label>
            <div className="helper-text">
              Overall discount effect applied to total revenue (10-15%)
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="feeIncrease">
              Tuition Fee Increase (%)
              <div className="slider-container">
                <input
                  id="feeIncrease"
                  type="range"
                  min="2"
                  max="6"
                  step="0.1"
                  value={feeIncrease}
                  onChange={(e) => setFeeIncrease(Number(e.target.value))}
                />
                <input
                  type="number"
                  value={feeIncrease}
                  onChange={(e) => setFeeIncrease(Number(e.target.value))}
                  min="2"
                  max="6"
                  step="0.1"
                  className="number-input"
                />
                <span>%</span>
              </div>
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="payIncrease">
              Staff Pay Increase (%)
              <div className="slider-container">
                <input
                  id="payIncrease"
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={payIncrease}
                  onChange={(e) => setPayIncrease(Number(e.target.value))}
                />
                <input
                  type="number"
                  value={payIncrease}
                  onChange={(e) => setPayIncrease(Number(e.target.value))}
                  min="1"
                  max="5"
                  step="0.1"
                  className="number-input"
                />
                <span>%</span>
              </div>
            </label>
          </div>

          <div className="input-group">
            <div className="info-box">
              <strong>Gross Annual Revenue (before discounts):</strong>{' '}
              {formatCurrency(numChildren * feePerTerm * 3)}
              <br />
              <strong>Current Annual Turnover (after discounts):</strong>{' '}
              {formatCurrency(
                (numChildren * feePerTerm * 3) * (1 - totalDiscountEffect / 100)
              )}
              <br />
              <small style={{ opacity: 0.8 }}>
                Discount amount: {formatCurrency(
                  (numChildren * feePerTerm * 3) * (totalDiscountEffect / 100)
                )}
              </small>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="surplus">
              Current Annual Surplus (£)
              <input
                id="surplus"
                type="number"
                value={currentSurplus}
                onChange={(e) => setCurrentSurplus(Number(e.target.value))}
                step="1000"
              />
            </label>
            <div className="helper-text">
              Surplus = Turnover - Costs
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="inflation1">
              Inflation Year 1 (%)
              <input
                id="inflation1"
                type="number"
                value={inflationYear1}
                onChange={(e) => setInflationYear1(Number(e.target.value))}
                min="0"
                max="10"
                step="0.1"
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="inflation2">
              Inflation Year 2 (%)
              <input
                id="inflation2"
                type="number"
                value={inflationYear2}
                onChange={(e) => setInflationYear2(Number(e.target.value))}
                min="0"
                max="10"
                step="0.1"
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="inflation3">
              Inflation Year 3 (%)
              <input
                id="inflation3"
                type="number"
                value={inflationYear3}
                onChange={(e) => setInflationYear3(Number(e.target.value))}
                min="0"
                max="10"
                step="0.1"
              />
            </label>
          </div>
        </div>

        <div className="results-panel">
          <h2>Financial Projections</h2>

          <div className="table-container">
            <table className="financial-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Gross Revenue</th>
                  <th>Discounts</th>
                  <th>Turnover (Revenue)</th>
                  <th>Costs</th>
                  <th>Surplus</th>
                  <th>Fee Increase</th>
                  <th>Pay Increase</th>
                </tr>
              </thead>
              <tbody>
                {financialData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.year}</td>
                    <td>{formatCurrency(row.grossRevenue)}</td>
                    <td className="negative">{formatCurrency(-row.discountAmount)}</td>
                    <td>{formatCurrency(row.revenue)}</td>
                    <td>{formatCurrency(row.costs)}</td>
                    <td
                      className={
                        row.netPosition >= 0 ? 'positive' : 'negative'
                      }
                    >
                      {formatCurrency(row.netPosition)}
                    </td>
                    <td>{row.feeIncrease > 0 ? `${row.feeIncrease}%` : '-'}</td>
                    <td>{row.payIncrease > 0 ? `${row.payIncrease}%` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="charts-container">
            <div className="chart-wrapper">
              <h3>Turnover vs Costs Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    name="Turnover (Revenue)"
                  />
                  <Line
                    type="monotone"
                    dataKey="costs"
                    stroke="#F44336"
                    strokeWidth={2}
                    name="Costs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrapper">
              <h3>Surplus Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar
                    dataKey="netPosition"
                    fill="#2196F3"
                    name="Surplus"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrapper">
              <h3>Turnover vs Costs Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4CAF50" name="Turnover (Revenue)" />
                  <Bar dataKey="costs" fill="#F44336" name="Costs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="calculations-section">
            <h2>Manual Calculations</h2>
            
            <div className="calculation-year">
              <h3>Base Calculations</h3>
              <div className="calculation-steps">
                <div className="calc-step">
                  <strong>Gross Annual Revenue (before discounts):</strong>
                  <div className="calc-formula">
                    {numChildren} children × £{formatNumber(feePerTerm)} per term × {baseCalculations.termsPerYear} terms = {formatCurrency(baseCalculations.grossAnnualRevenue)}
                  </div>
                </div>
                <div className="calc-step">
                  <strong>Discount Amount:</strong>
                  <div className="calc-formula">
                    {formatCurrency(baseCalculations.grossAnnualRevenue)} × {totalDiscountEffect}% = {formatCurrency(baseCalculations.discountAmount)}
                  </div>
                </div>
                <div className="calc-step">
                  <strong>Current Annual Turnover (after discounts):</strong>
                  <div className="calc-formula">
                    {formatCurrency(baseCalculations.grossAnnualRevenue)} - {formatCurrency(baseCalculations.discountAmount)} = {formatCurrency(baseCalculations.currentAnnualRevenue)}
                  </div>
                </div>
                <div className="calc-step">
                  <strong>Current Annual Costs:</strong>
                  <div className="calc-formula">
                    {formatCurrency(baseCalculations.currentAnnualRevenue)} - {formatCurrency(currentSurplus)} (surplus) = {formatCurrency(baseCalculations.currentAnnualCosts)}
                  </div>
                </div>
              </div>
            </div>

            {financialData.slice(1).map((year, index) => {
              const yearNum = index + 1
              const feeMult = 1 + feeIncrease / 100
              const payMult = 1 + payIncrease / 100
              const inflationRate = yearNum === 1 ? inflationYear1 : yearNum === 2 ? inflationYear2 : inflationYear3
              const inflationMult = 1 + inflationRate / 100
              const prevGrossRevenue = index === 0 ? baseCalculations.grossAnnualRevenue : financialData[index].grossRevenue
              
              // Calculate costs step by step - matching the actual calculation logic
              // Year 1: currentAnnualCosts * payMult, then * inflationMult
              // Year 2: (currentAnnualCosts * payMult) * payMult, then * inflationMult
              // Year 3: (currentAnnualCosts * payMult^2) * payMult, then * inflationMult
              let baseCostsBeforePay = baseCalculations.currentAnnualCosts
              if (yearNum > 1) {
                // For years 2+, the base is the previous year's base costs (before inflation)
                baseCostsBeforePay = baseCalculations.currentAnnualCosts * Math.pow(payMult, yearNum - 1)
              }
              const costsAfterPayIncrease = baseCostsBeforePay * payMult
              const costsAfterInflation = costsAfterPayIncrease * inflationMult

              return (
                <div key={yearNum} className="calculation-year">
                  <h3>Year {yearNum} Calculations</h3>
                  <div className="calculation-steps">
                    <div className="calc-step">
                      <strong>Step 1: Apply Fee Increase to Gross Revenue</strong>
                      <div className="calc-formula">
                        {formatCurrency(prevGrossRevenue)} × (1 + {feeIncrease}%) = {formatCurrency(prevGrossRevenue)} × {formatNumber(feeMult)} = {formatCurrency(year.grossRevenue)}
                      </div>
                    </div>
                    <div className="calc-step">
                      <strong>Step 2: Calculate Discount Amount</strong>
                      <div className="calc-formula">
                        {formatCurrency(year.grossRevenue)} × {totalDiscountEffect}% = {formatCurrency(year.discountAmount)}
                      </div>
                    </div>
                    <div className="calc-step">
                      <strong>Step 3: Calculate Turnover (Revenue after discounts)</strong>
                      <div className="calc-formula">
                        {formatCurrency(year.grossRevenue)} - {formatCurrency(year.discountAmount)} = {formatCurrency(year.revenue)}
                      </div>
                    </div>
                    <div className="calc-step">
                      <strong>Step 4: Calculate Costs - Apply Pay Increase</strong>
                      <div className="calc-formula">
                        {yearNum === 1 ? (
                          <>
                            {formatCurrency(baseCalculations.currentAnnualCosts)} × (1 + {payIncrease}%) = {formatCurrency(baseCalculations.currentAnnualCosts)} × {formatNumber(payMult)} = {formatCurrency(costsAfterPayIncrease)}
                          </>
                        ) : (
                          <>
                            Previous year's base costs × (1 + {payIncrease}%) = {formatCurrency(baseCostsBeforePay)} × {formatNumber(payMult)} = {formatCurrency(costsAfterPayIncrease)}
                            <div className="calc-note">
                              (Previous base = {formatCurrency(baseCalculations.currentAnnualCosts)} × {formatNumber(payMult)}<sup>{yearNum - 1}</sup>)
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="calc-step">
                      <strong>Step 5: Apply Inflation to Costs</strong>
                      <div className="calc-formula">
                        {formatCurrency(costsAfterPayIncrease)} × (1 + {inflationRate}%) = {formatCurrency(costsAfterPayIncrease)} × {formatNumber(inflationMult)} = {formatCurrency(year.costs)}
                      </div>
                    </div>
                    <div className="calc-step">
                      <strong>Step 6: Calculate Surplus</strong>
                      <div className="calc-formula">
                        {formatCurrency(year.revenue)} (Turnover) - {formatCurrency(year.costs)} (Costs) = {formatCurrency(year.netPosition)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="summary-box">
            <h3>Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Current Annual Turnover:</span>
                <span className="summary-value">
                  {formatCurrency(financialData[0].revenue)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year 1 Projected Turnover:</span>
                <span className="summary-value">
                  {formatCurrency(financialData[1].revenue)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year 2 Projected Turnover:</span>
                <span className="summary-value">
                  {formatCurrency(financialData[2].revenue)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year 3 Projected Turnover:</span>
                <span className="summary-value">
                  {formatCurrency(financialData[3].revenue)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year 1 Surplus:</span>
                <span
                  className={`summary-value ${
                    financialData[1].netPosition >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {formatCurrency(financialData[1].netPosition)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year 2 Surplus:</span>
                <span
                  className={`summary-value ${
                    financialData[2].netPosition >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {formatCurrency(financialData[2].netPosition)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year 3 Surplus:</span>
                <span
                  className={`summary-value ${
                    financialData[3].netPosition >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {formatCurrency(financialData[3].netPosition)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">3-Year Surplus Change:</span>
                <span
                  className={`summary-value ${
                    financialData[3].netPosition - financialData[0].netPosition >=
                    0
                      ? 'positive'
                      : 'negative'
                  }`}
                >
                  {formatCurrency(
                    financialData[3].netPosition - financialData[0].netPosition
                  )}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Current Year Discounts:</span>
                <span className="summary-value negative">
                  {formatCurrency(financialData[0].discountAmount)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Year 3 Discounts:</span>
                <span className="summary-value negative">
                  {formatCurrency(financialData[3].discountAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
